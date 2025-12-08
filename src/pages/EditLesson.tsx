import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    BookOpen,
    ArrowLeft,
    Save,
    Trash2,
    Plus,
    Video,
    FileText,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { courseApi, type Lesson, type LessonContent } from '../services/courseApi';

const EditLesson = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [lessonName, setLessonName] = useState('');
    const [lessonOrder, setLessonOrder] = useState<number>(1);
    const [contents, setContents] = useState<LessonContent[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // New content form
    const [showAddContent, setShowAddContent] = useState(false);
    const [newContentName, setNewContentName] = useState('');
    const [newContentType, setNewContentType] = useState<'video' | 'text' | 'media'>('text');
    const [newContentText, setNewContentText] = useState('');
    const [newContentUrl, setNewContentUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchLesson();
    }, [courseId, lessonId]);

    const fetchLesson = async () => {
        if (!courseId || !lessonId) {
            setError('Missing course or lesson ID');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await courseApi.getLesson(courseId, lessonId);
            setLesson(data);
            setLessonName(data.lessonName || '');
            setLessonOrder(data.order || 1);
            setContents(data.contents || []);
            document.title = `Edit ${data.lessonName} | ITS`;
        } catch (err) {
            console.error('Failed to load lesson:', err);
            setError('Failed to load lesson. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLesson = async () => {
        if (!lessonName.trim()) {
            setError('Lesson name is required');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await courseApi.updateLesson(courseId!, lessonId!, {
                title: lessonName,
                order: lessonOrder
            });

            setSuccessMessage('Lesson updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Failed to update lesson:', err);
            setError('Failed to update lesson. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddContent = async () => {
        if (!newContentName.trim()) {
            setError('Content name is required');
            return;
        }

        if (newContentType === 'text' && !newContentText.trim()) {
            setError('Text content is required');
            return;
        }

        if (newContentType === 'video' && !newContentUrl.trim()) {
            setError('Video URL is required');
            return;
        }

        if (newContentType === 'media' && !selectedFile) {
            setError('Please select a file to upload');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            if (newContentType === 'media' && selectedFile) {
                // Handle media upload with S3
                await handleMediaUpload();
            } else {
                // Handle text or video URL content
                const contentPayload = {
                    contentName: newContentName,
                    type: newContentType,
                    order: contents.length + 1,
                    ...(newContentType === 'text' && { text: newContentText }),
                    ...(newContentType === 'video' && { url: newContentUrl })
                };

                const created = await courseApi.createLessonContent(courseId!, lessonId!, contentPayload);
                setContents([...contents, created]);

                // Reset form
                resetContentForm();
                setSuccessMessage('Content added successfully!');
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (err) {
            console.error('Failed to add content:', err);
            setError('Failed to add content. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleMediaUpload = async () => {
        if (!selectedFile) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);

            // Determine the content type based on file MIME type
            const getContentType = (file: File): 'video' | 'audio' | 'image' => {
                if (file.type.startsWith('video/')) return 'video';
                if (file.type.startsWith('audio/')) return 'audio';
                if (file.type.startsWith('image/')) return 'image';

                // Fallback based on file extension
                const ext = file.name.split('.').pop()?.toLowerCase();
                if (['mp4', 'mov', 'avi', 'webm'].includes(ext || '')) return 'video';
                if (['mp3', 'wav', 'ogg'].includes(ext || '')) return 'audio';
                if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';

                return 'video'; // default
            };

            // Step 1: Create content and get pre-signed S3 URL
            const contentPayload = {
                contentName: newContentName,
                type: getContentType(selectedFile),
                order: contents.length + 1
            };

            console.log('Step 1: Creating content with payload:', contentPayload);
            const response = await courseApi.createLessonContent(courseId!, lessonId!, contentPayload);
            console.log('Step 1 Response:', response);

            // Response structure: { contentId, preSignedUrl, fields, key, message }
            const { preSignedUrl, fields, key, contentId } = response as any;
            const url = preSignedUrl;

            if (!url || !fields || !key) {
                console.error('Invalid response structure:', response);
                throw new Error(`Invalid S3 upload response. Missing: ${!url ? 'preSignedUrl' : ''} ${!fields ? 'fields' : ''} ${!key ? 'key' : ''}`);
            }

            // Step 2: Upload file to S3 using pre-signed URL
            const formData = new FormData();

            // Add all fields from pre-signed URL response
            Object.keys(fields).forEach(fieldKey => {
                formData.append(fieldKey, fields[fieldKey]);
            });

            // Add the file last
            formData.append('file', selectedFile);

            console.log('Step 2: Uploading to S3 URL:', url);
            console.log('FormData fields:', Object.keys(fields));

            // Upload to S3
            const uploadResponse = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            console.log('Step 2 Upload response status:', uploadResponse.status);

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('S3 upload failed:', errorText);
                throw new Error(`Failed to upload file to S3: ${uploadResponse.status} ${errorText}`);
            }

            setUploadProgress(100);

            // Step 3: Confirm upload completion
            console.log('Step 3: Confirming upload with contentId:', contentId, 'key:', key);

            await courseApi.confirmMediaUpload(contentId, key);
            console.log('Step 3: Upload confirmed');

            // Refresh lesson data to get the updated content with URL
            const updatedLesson = await courseApi.getLesson(courseId!, lessonId!);
            setContents(updatedLesson.contents || []);

            // Reset form
            resetContentForm();
            setSuccessMessage('Media uploaded successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);

        } catch (err: any) {
            console.error('Failed to upload media:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                statusText: err.response?.statusText,
                headers: err.response?.headers,
                config: {
                    url: err.config?.url,
                    method: err.config?.method,
                    data: err.config?.data
                },
                stack: err.stack
            });

            // Extract detailed error message
            let errorMessage = 'Failed to upload media. Please try again.';

            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.message) {
                    errorMessage = Array.isArray(data.message)
                        ? data.message.join(', ')
                        : data.message;
                } else if (data.error) {
                    errorMessage = data.error;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const resetContentForm = () => {
        setNewContentName('');
        setNewContentText('');
        setNewContentUrl('');
        setSelectedFile(null);
        setShowAddContent(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (50MB limit)
            const maxSize = 50 * 1024 * 1024; // 50MB
            if (file.size > maxSize) {
                setError('File size must be less than 50MB');
                return;
            }

            // Validate file type - allow video, audio, image files
            const allowedTypes = [
                // Video
                'video/mp4',
                'video/quicktime',
                'video/x-msvideo',
                'video/webm',
                // Audio
                'audio/mpeg',
                'audio/wav',
                'audio/ogg',
                // Images
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                // Documents (if backend supports them as media)
                'application/pdf'
            ];

            const isValidType = allowedTypes.includes(file.type) ||
                file.type.startsWith('video/') ||
                file.type.startsWith('audio/') ||
                file.type.startsWith('image/');

            if (!isValidType) {
                setError('File type not supported. Allowed: Videos (MP4, MOV, etc.), Audio (MP3, WAV), Images (JPG, PNG, GIF), PDF');
                return;
            }

            setSelectedFile(file);
            setError(null);
        }
    };

    const handleDeleteContent = async (contentId: string) => {
        if (!confirm('Are you sure you want to delete this content?')) {
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await courseApi.deleteLessonContent(courseId!, lessonId!, contentId);

            setContents(contents.filter(c => c.id !== contentId));
            setSuccessMessage('Content deleted successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Failed to delete content:', err);
            setError('Failed to delete content. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
                <div className="w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 px-4">
                <AlertCircle size={64} className="text-warning-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lesson Not Found</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-primary flex items-center"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            to={`/instructor/courses/${courseId}`}
                            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-4"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Course
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Edit Lesson
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Update lesson details and manage content
                        </p>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 rounded-lg p-4 flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 rounded-lg p-4">
                            <p className="text-green-700 dark:text-green-400">{successMessage}</p>
                        </div>
                    )}

                    {/* Lesson Details Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Lesson Details
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Lesson Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={lessonName}
                                    onChange={(e) => setLessonName(e.target.value)}
                                    className="input"
                                    placeholder="e.g., Introduction to Variables"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Order
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={lessonOrder}
                                    onChange={(e) => setLessonOrder(parseInt(e.target.value) || 1)}
                                    className="input"
                                />
                            </div>

                            <button
                                onClick={handleSaveLesson}
                                disabled={saving}
                                className="btn btn-primary flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} className="mr-2" />
                                        Save Lesson
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Lesson Contents */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Lesson Contents ({contents.length})
                            </h2>
                            <button
                                onClick={() => setShowAddContent(!showAddContent)}
                                className="btn btn-primary flex items-center text-sm"
                            >
                                <Plus size={16} className="mr-2" />
                                Add Content
                            </button>
                        </div>

                        {/* Add Content Form */}
                        {showAddContent && (
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Add New Content
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Content Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newContentName}
                                            onChange={(e) => setNewContentName(e.target.value)}
                                            className="input"
                                            placeholder="e.g., What are Variables?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Content Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={newContentType}
                                            onChange={(e) => setNewContentType(e.target.value as 'video' | 'text' | 'media')}
                                            className="select"
                                        >
                                            <option value="text">Text</option>
                                            <option value="video">Video URL</option>
                                            <option value="media">Media Upload (PDF, DOC, MP4, etc.)</option>
                                        </select>
                                    </div>

                                    {newContentType === 'text' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Text Content <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={newContentText}
                                                onChange={(e) => setNewContentText(e.target.value)}
                                                rows={6}
                                                className="input resize-none"
                                                placeholder="Enter your lesson content here..."
                                            />
                                        </div>
                                    )}

                                    {newContentType === 'video' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Video URL <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="url"
                                                value={newContentUrl}
                                                onChange={(e) => setNewContentUrl(e.target.value)}
                                                className="input"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    )}

                                    {newContentType === 'media' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Upload File <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="video/*,audio/*,image/*,.pdf"
                                                className="block w-full text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none"
                                            />
                                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                Supported: Videos (MP4, MOV, etc.), Audio (MP3, WAV), Images (JPG, PNG, GIF), PDF (Max 50MB)
                                            </p>
                                            {selectedFile && (
                                                <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                                    Selected: <span className="font-medium">{selectedFile.name}</span> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                                </div>
                                            )}
                                            {isUploading && uploadProgress > 0 && (
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                        <span>Uploading...</span>
                                                        <span>{uploadProgress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddContent}
                                            disabled={saving || isUploading}
                                            className="btn btn-primary"
                                        >
                                            {isUploading ? 'Uploading...' : saving ? 'Adding...' : 'Add Content'}
                                        </button>
                                        <button
                                            onClick={resetContentForm}
                                            disabled={saving || isUploading}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contents List */}
                        {contents.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No content added yet. Click "Add Content" to get started.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {contents.map((content, index) => (
                                    <div
                                        key={content.id}
                                        className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                                    >
                                        <div className="flex items-start flex-1">
                                            <div className="mr-3 mt-1">
                                                {content.type === 'video' ? (
                                                    <Video size={20} className="text-primary-600 dark:text-primary-400" />
                                                ) : (
                                                    <FileText size={20} className="text-gray-600 dark:text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                                    {index + 1}. {content.contentName}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Type: <span className="uppercase">{content.type}</span>
                                                </p>
                                                {content.type === 'text' && content.text && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                                        {content.text.replace(/<[^>]*>/g, '')}
                                                    </p>
                                                )}
                                                {content.type === 'video' && content.url && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 truncate">
                                                        URL: {content.url}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteContent(content.id)}
                                            disabled={saving}
                                            className="ml-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            title="Delete content"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditLesson;
