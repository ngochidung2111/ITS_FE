import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  ChevronDown, 
  Share2, 
  Heart,
  ShoppingCart,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { type GetCourseDetailDto } from '../types/course';
import { courseApi } from '../services/courseApi';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<GetCourseDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'quizzes'>('curriculum');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchCourseDetail = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await courseApi.getCourseDetail(courseId);
        setCourse(data);
        document.title = `${data.title} | ITS`;

        if (data.lessons.length > 0) {
          setActiveSectionId(data.lessons[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch course detail:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  const toggleSection = (sectionId: string) => {
    setActiveSectionId(activeSectionId === sectionId ? null : sectionId);
  };

  const getTotalContents = (lessons: GetCourseDetailDto['lessons']) => {
    return lessons.reduce(
      (total: number, lesson: GetCourseDetailDto['lessons'][number]) => total + lesson.contents.length,
      0
    );
  };

  const getTotalDuration = (lessons: GetCourseDetailDto['lessons']) => {
    const totalItems = getTotalContents(lessons);
    return `${totalItems} items`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 px-4">
        <AlertTriangle size={64} className="text-warning-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {error ? 'Error Loading Course' : 'Course Not Found'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          {error || "The course you're looking for doesn't exist or has been removed."}
        </p>
        <button 
          onClick={() => navigate('/courses')}
          className="btn btn-primary flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Courses
        </button>
      </div>
    );
  }

  const lessons = course.lessons ?? [];
  const firstContent = lessons[0]?.contents[0];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-16">
      {/* Course Header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Course Info */}
              <div className="md:w-7/12">
                <Link 
                  to="/courses"
                  className="inline-flex items-center text-primary-300 hover:text-primary-200 mb-4"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Courses
                </Link>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                
                <p className="text-lg text-gray-300 mb-6">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center text-gray-300">
                    <Users size={18} className="mr-1" />
                    <span>Status: {course.status}</span>
                  </div>
                </div>
                
                {course.instructor && (
                  <div className="flex items-center">
                    
                    <div className="ml-2">
                      <p className="font-medium">{course.instructor?.name}</p>
                      <p className="text-sm text-gray-300">{course.instructor?.email}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Course Card */}
              <div className="md:w-5/12 md:max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  
                  
                  {/* Card Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${course.price?.toFixed(2)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ${(course.price ? course.price * 1.4 : 0).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        40% off! Sale ends in 2 days
                      </p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <button className="btn btn-primary w-full flex items-center justify-center">
                        <ShoppingCart size={18} className="mr-2" />
                        Add to Cart
                      </button>
                      <button className="btn btn-outline w-full">
                        Buy Now
                      </button>
                    </div>
                    
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                      30-Day Money-Back Guarantee
                    </p>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">This course includes:</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <PlayCircle size={18} className="text-gray-700 dark:text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">
                            {getTotalContents(lessons)} lectures
                          </p>
                        </div>
                        <div className="flex items-start">
                          <Clock size={18} className="text-gray-700 dark:text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">
                            {getTotalDuration(lessons)} total length
                          </p>
                        </div>
                        <div className="flex items-start">
                          <BookOpen size={18} className="text-gray-700 dark:text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">
                            {course.quizzes.length} quizzes
                          </p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle size={18} className="text-gray-700 dark:text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">
                            Certificate of completion
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4 mt-6">
                      <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <Heart size={18} className="mr-1" />
                        Wishlist
                      </button>
                      <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <Share2 size={18} className="mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="flex space-x-8">
              {/* <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button> */}
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'curriculum'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Curriculum
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'quizzes'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Quizzes
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Course</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">
                      {course.description}
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What you'll learn</h3>
                    {/* <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {course.objectives?.map((objective: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={18} className="text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                        </li>
                      ))}
                    </ul> */}
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Requirements</h3>
                    {/* <ul className="space-y-2 mb-6">
                      {course.requirements?.map((requirement: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-700 dark:bg-gray-300 mt-2 mr-2"></div>
                          <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                        </li>
                      ))}
                    </ul> */}
                  </div>
                  
                  {course.instructor && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Instructor</h2>
                      <div className="flex items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{course.instructor.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{course.instructor.email}</p>
                          {/* <p className="text-gray-700 dark:text-gray-300">{course.instructor.bio}</p> */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Content</h3>
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{lessons.length} sections</span>
                      <span>{getTotalContents(lessons)} lectures</span>
                      <span>{getTotalDuration(lessons)} total</span>
                    </div>
                    
                    <div className="mb-4">
                      {firstContent ? (
                        <Link to={`/lecture/${course.id}/${firstContent.id}`} className="btn btn-primary w-full">
                          Preview Course
                        </Link>
                      ) : null}
                    </div>
                    
                    <div className="space-y-3">
                      {lessons.slice(0, 3).map((lesson: GetCourseDetailDto['lessons'][number]) => (
                        <div key={lesson.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection(lesson.id)}
                            className="flex items-center justify-between w-full p-4 text-left font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span>{lesson.lessonName}</span>
                            <ChevronDown 
                              size={18} 
                              className={`transform transition-transform ${activeSectionId === lesson.id ? 'rotate-180' : ''}`} 
                            />
                          </button>
                          
                          {activeSectionId === lesson.id && (
                            <div className="p-4 space-y-2">
                              {lesson.contents.slice(0, 2).map((content: GetCourseDetailDto['lessons'][number]['contents'][number]) => (
                                <div key={content.id} className="flex items-start">
                                  <PlayCircle size={16} className="text-gray-600 dark:text-gray-400 mt-1 mr-2 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-gray-800 dark:text-gray-200">{content.contentName}</p>
                                    <div className="flex items-center text-sm">
                                      <span className="text-gray-500 dark:text-gray-400">{content.type}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {lesson.contents.length > 2 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                                  + {lesson.contents.length - 2} more lectures
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {lessons.length > 3 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                          + {lessons.length - 3} more sections
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Curriculum</h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span>{lessons.length} sections</span>
                    <span className="mx-2">•</span>
                    <span>{getTotalContents(lessons)} lectures</span>
                    <span className="mx-2">•</span>
                    <span>{getTotalDuration(lessons)} total length</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {lessons.map((lesson: GetCourseDetailDto['lessons'][number]) => (
                    <div key={lesson.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(lesson.id)}
                        className="flex items-center justify-between w-full p-4 text-left font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <span>{lesson.lessonName}</span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                            {lesson.contents.length} lectures • {lesson.contents.length} items
                          </span>
                          <ChevronDown 
                            size={18} 
                            className={`transform transition-transform ${activeSectionId === lesson.id ? 'rotate-180' : ''}`} 
                          />
                        </div>
                      </button>
                      
                      {activeSectionId === lesson.id && (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {lesson.contents.map((content: GetCourseDetailDto['lessons'][number]['contents'][number]) => (
                            <div key={content.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                              <div className="flex items-start">
                                <PlayCircle size={18} className="text-gray-600 dark:text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <Link 
                                      to={`/lecture/${course.id}/${content.id}`}
                                      className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
                                    >
                                      {content.contentName}
                                    </Link>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-500 dark:text-gray-400">{content.type}</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {content.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Quizzes</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Test your knowledge with {course.quizzes.length} quiz{course.quizzes.length !== 1 ? 'zes' : ''} in this course.
                  </p>
                </div>
                
                {course.quizzes.length > 0 ? (
                  <div className="space-y-4">
                    {course.quizzes.map((quiz) => (
                      <div key={quiz.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {quiz.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center">
                                  <BookOpen size={16} className="mr-1" />
                                  <span>{quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock size={16} className="mr-1" />
                                  <span>{quiz.timeLimit ? `${Math.floor(quiz.timeLimit / 60)} minutes` : 'No time limit'}</span>
                                </div>
                              </div>
                            </div>
                            <Link
                              to={`/quiz/${course.id}/${quiz.id}`}
                              className="btn btn-primary"
                            >
                              Start Quiz
                            </Link>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Topics covered:</h4>
                            <div className="space-y-2">
                              {quiz.questions.slice(0, 3).map((question) => (
                                <div key={question.id} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                  <CheckCircle size={16} className="text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{question.questionName}</span>
                                </div>
                              ))}
                              {quiz.questions.length > 3 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 ml-6">
                                  + {quiz.questions.length - 3} more question{quiz.questions.length - 3 !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No quizzes available for this course yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;