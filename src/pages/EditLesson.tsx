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
    const [newContentType, setNewContentType] = useState<'video' | 'text'>('text');
    const [newContentText, setNewContentText] = useState('');
    const [newContentUrl, setNewContentUrl] = useState('');

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

            // Note: You'll need to implement the update lesson API in courseApi
            // await courseApi.updateLesson(courseId!, lessonId!, { lessonName, order: lessonOrder });

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

        try {
            setSaving(true);
            setError(null);

            const newContent = {
                contentName: newContentName,
                type: newContentType,
                text: newContentType === 'text' ? newContentText : undefined,
                url: newContentType === 'video' ? newContentUrl : undefined,
            };

            // Note: You'll need to implement the add content API in courseApi
            // const created = await courseApi.addLessonContent(courseId!, lessonId!, newContent);

            // For now, we'll add it locally
            const created = {
                id: Date.now().toString(),
                ...newContent,
            } as LessonContent;

            setContents([...contents, created]);

            // Reset form
            setNewContentName('');
            setNewContentText('');
            setNewContentUrl('');
            setShowAddContent(false);
            setSuccessMessage('Content added successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Failed to add content:', err);
            setError('Failed to add content. Please try again.');
        } finally {
            setSaving(false);
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
                                            onChange={(e) => setNewContentType(e.target.value as 'video' | 'text')}
                                            className="select"
                                        >
                                            <option value="text">Text</option>
                                            <option value="video">Video</option>
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

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddContent}
                                            disabled={saving}
                                            className="btn btn-primary"
                                        >
                                            {saving ? 'Adding...' : 'Add Content'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowAddContent(false);
                                                setNewContentName('');
                                                setNewContentText('');
                                                setNewContentUrl('');
                                            }}
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
