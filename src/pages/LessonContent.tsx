import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  FileText,
  Video,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play
} from 'lucide-react';
import { courseApi, type Lesson, type LessonContent as LessonContentType, type CourseBasicInfo } from '../services/courseApi';

const LessonContent = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<CourseBasicInfo | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedContents, setCompletedContents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!courseId || !lessonId) {
        setError('Missing course or lesson information.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [lessonData, courseData] = await Promise.all([
          courseApi.getLesson(courseId, lessonId),
          courseApi.getCourseDetail(courseId)
        ]);

        setLesson(lessonData);
        setCourse(courseData);
        document.title = `${lessonData.lessonName} | ITS`;
      } catch (err) {
        console.error('Failed to load lesson:', err);
        setError('Failed to load lesson. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
    window.scrollTo(0, 0);
  }, [courseId, lessonId]);

  const currentContent = lesson?.contents?.[currentContentIndex];

  const handleNext = () => {
    if (lesson?.contents && currentContentIndex < lesson.contents.length - 1) {
      setCurrentContentIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleMarkComplete = () => {
    if (currentContent) {
      setCompletedContents(prev => new Set(prev).add(currentContent.id));
    }
  };

  const jumpToContent = (index: number) => {
    setCurrentContentIndex(index);
    window.scrollTo(0, 0);
  };

  const getContentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <Video size={18} />;
      case 'text':
        return <FileText size={18} />;
      default:
        return <BookOpen size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lesson || !course || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 px-4">
        <AlertTriangle size={64} className="text-warning-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lesson Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          {error || "The lesson you're looking for doesn't exist or has been removed."}
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-primary flex items-center"
        >
          <ChevronLeft size={18} className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  if (!lesson.contents || lesson.contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 px-4">
        <BookOpen size={64} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Content Available</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          This lesson doesn't have any content yet.
        </p>
        <Link 
          to={`/courses/${courseId}`}
          className="btn btn-primary flex items-center"
        >
          <ChevronLeft size={18} className="mr-2" />
          Back to Course
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link 
              to={`/courses/${courseId}`}
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-2"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Course
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {lesson.lessonName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {course.title} • Lesson {lesson.order}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {/* Content Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                  <div className="flex items-center mb-2">
                    {getContentIcon(currentContent?.type || '')}
                    <span className="ml-2 text-sm font-medium uppercase tracking-wide">
                      {currentContent?.type || 'Content'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    {currentContent?.contentName || 'Untitled Content'}
                  </h2>
                  <p className="mt-2 text-primary-100">
                    Content {currentContentIndex + 1} of {lesson.contents.length}
                  </p>
                </div>

                {/* Content Body */}
                <div className="p-6">
                  {currentContent?.type === 'video' && (
                    <div className="mb-6">
                      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                        {currentContent.url ? (
                          <video 
                            controls 
                            className="w-full h-full rounded-lg"
                            src={currentContent.url}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="text-center text-gray-400">
                            <Play size={64} className="mx-auto mb-4 opacity-50" />
                            <p>Video URL not available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentContent?.type === 'text' && (
                    <div className="prose dark:prose-invert max-w-none">
                      {currentContent.text ? (
                        <div 
                          className="text-gray-700 dark:text-gray-300 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: currentContent.text }}
                        />
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <FileText size={48} className="mx-auto mb-4 opacity-50" />
                          <p>No text content available</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mark as Complete Button */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {completedContents.has(currentContent?.id || '') ? (
                      <div className="flex items-center justify-center text-success-600 dark:text-success-400">
                        <CheckCircle size={20} className="mr-2" />
                        <span className="font-medium">Completed</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleMarkComplete}
                        className="w-full btn btn-primary"
                      >
                        Mark as Complete
                      </button>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handlePrevious}
                      disabled={currentContentIndex === 0}
                      className={`btn btn-outline flex items-center ${
                        currentContentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ChevronLeft size={18} className="mr-2" />
                      Previous
                    </button>

                    {currentContentIndex === lesson.contents.length - 1 ? (
                      <Link
                        to={`/courses/${courseId}`}
                        className="btn btn-primary flex items-center"
                      >
                        Back to Course
                        <ChevronRight size={18} className="ml-2" />
                      </Link>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="btn btn-primary flex items-center"
                      >
                        Next
                        <ChevronRight size={18} className="ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Content List */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <BookOpen size={20} className="mr-2" />
                  Lesson Contents
                </h3>

                <div className="space-y-2">
                  {lesson.contents.map((content, index) => (
                    <button
                      key={content.id}
                      onClick={() => jumpToContent(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentContentIndex === index
                          ? 'bg-primary-100 dark:bg-primary-900/30 border-l-4 border-primary-600'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-650 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`mt-0.5 mr-3 ${
                          currentContentIndex === index 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {getContentIcon(content.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            currentContentIndex === index
                              ? 'text-primary-900 dark:text-primary-100'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {content.contentName || 'Untitled'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 uppercase">
                            {content.type}
                          </p>
                        </div>
                        {completedContents.has(content.id) && (
                          <CheckCircle size={16} className="text-success-500 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progress</span>
                    <span className="font-medium">
                      {completedContents.size} / {lesson.contents.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-success-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedContents.size / lesson.contents.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
