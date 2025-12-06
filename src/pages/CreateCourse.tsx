import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, DollarSign, FileText, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    // Validation errors
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [priceError, setPriceError] = useState('');

    useEffect(() => {
        document.title = 'Create Course | ITS';
        window.scrollTo(0, 0);
    }, []);

    const validateForm = (): boolean => {
        let isValid = true;

        // Reset errors
        setTitleError('');
        setDescriptionError('');
        setPriceError('');

        // Validate title
        if (!title.trim()) {
            setTitleError('Title is required');
            isValid = false;
        } else if (title.trim().length < 3) {
            setTitleError('Title must be at least 3 characters');
            isValid = false;
        }

        // Validate description
        if (!description.trim()) {
            setDescriptionError('Description is required');
            isValid = false;
        } else if (description.trim().length < 10) {
            setDescriptionError('Description must be at least 10 characters');
            isValid = false;
        }

        // Validate price
        if (!price.trim()) {
            setPriceError('Price is required');
            isValid = false;
        } else {
            const priceNum = parseFloat(price);
            if (isNaN(priceNum)) {
                setPriceError('Price must be a valid number');
                isValid = false;
            } else if (priceNum < 0) {
                setPriceError('Price cannot be negative');
                isValid = false;
            } else if (priceNum > 999999) {
                setPriceError('Price is too high');
                isValid = false;
            }
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Get JWT token from localStorage
            // const token = localStorage.getItem('jwt_token');
            const token = localStorage.getItem('userToken') ?
                localStorage.getItem('userToken') :
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imluc3RydWN0b3IxQGV4YW1wbGUuY29tIiwiaWQiOiJmODMxYjY2MC1mNGIzLTQ0YzQtOWQwZC00NDUzYTRkOWIyMGUiLCJyb2xlIjoiaW5zdHJ1Y3RvciIsImlhdCI6MTc2NTAxMDI2NSwiZXhwIjoxNzY1MDk2NjY1fQ.x4uVG_12OghbIrhJQBL0Rfim7PzpVx9kn2OaVnao7BI"


            if (!token) {
                throw new Error('Authentication required. Please sign in to create a course.');
            }

            const response = await fetch('http://localhost:3000/courses', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    price: parseFloat(price)
                })
            });

            if (!response.ok) {
                // Try to get error message from response body
                let errorMessage = `Failed to create course (${response.status})`;

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    errorMessage = `${response.status}: ${response.statusText}`;
                }

                // Handle specific status codes
                if (response.status === 401) {
                    errorMessage = 'Session expired. Please sign in again.';
                    localStorage.removeItem('jwt_token');
                } else if (response.status === 403) {
                    errorMessage = 'Access denied. You do not have permission to create courses.';
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            setSuccess(true);

            // Reset form
            setTitle('');
            setDescription('');
            setPrice('');

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/courses');
            }, 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create course');
            console.error('Error creating course:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setTitle('');
        setDescription('');
        setPrice('');
        setTitleError('');
        setDescriptionError('');
        setPriceError('');
        setError(null);
        setSuccess(false);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/courses"
                        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Courses
                    </Link>

                </div>
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Create New Course
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Fill in the details below to create a new course
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 rounded-lg p-4 flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-green-800 dark:text-green-300">
                                    Course Created Successfully!
                                </h3>
                                <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                                    Redirecting to courses page...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 rounded-lg p-4 flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-red-800 dark:text-red-300">
                                    Error Creating Course
                                </h3>
                                <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                                    {error}
                                </p>
                                {(error.includes('Authentication') || error.includes('Session expired')) && (
                                    <Link
                                        to="/signin"
                                        className="inline-block mt-2 text-sm text-red-700 dark:text-red-400 underline hover:no-underline"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title Field */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Course Title <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BookOpen className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className={`input pl-10 ${titleError ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="e.g., Advanced NestJS"
                                        disabled={isLoading}
                                    />
                                </div>
                                {titleError && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{titleError}</p>
                                )}
                            </div>

                            {/* Description Field */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                        className={`input pl-10 resize-none ${descriptionError ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="e.g., Build production apps with NestJS..."
                                        disabled={isLoading}
                                    />
                                </div>
                                {descriptionError && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{descriptionError}</p>
                                )}
                            </div>

                            {/* Price Field */}
                            <div>
                                <label
                                    htmlFor="price"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Price (USD) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className={`input pl-10 ${priceError ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="e.g., 36.36"
                                        disabled={isLoading}
                                    />
                                </div>
                                {priceError && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{priceError}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-primary flex-1 flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <BookOpen className="h-5 w-5 mr-2" />
                                            Create Course
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={isLoading}
                                    className="btn btn-secondary flex-1"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                            Tips for Creating a Course:
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
                            <li>Use a clear and descriptive title</li>
                            <li>Provide a detailed description of what students will learn</li>
                            <li>Set a competitive price based on course value</li>
                            <li>All fields are required to create a course</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
