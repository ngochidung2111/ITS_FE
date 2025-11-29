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
import courses, { type Course, type Section, type LectureItem, type Author, authors } from '../utils/courses';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundCourse = courses.find(c => c.id === courseId);
    
    if (foundCourse) {
      setCourse(foundCourse);
      document.title = `${foundCourse.title} | ITS`;
      
      const foundAuthor = authors.find(a => a.id === foundCourse.authorId);
      if (foundAuthor) {
        setAuthor(foundAuthor);
      }
      
      if (foundCourse.curriculum.length > 0) {
        setActiveSectionId(foundCourse.curriculum[0].id);
      }
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [courseId]);

  const toggleSection = (sectionId: string) => {
    setActiveSectionId(activeSectionId === sectionId ? null : sectionId);
  };

  const getTotalLectures = (curriculum: Section[]) => {
    return curriculum.reduce((total, section) => total + section.lectures.length, 0);
  };

  const getTotalDuration = (curriculum: Section[]) => {
    let totalMinutes = 0;
    
    curriculum.forEach(section => {
      section.lectures.forEach(lecture => {
        const [minutes, seconds] = lecture.duration.split(':').map(Number);
        totalMinutes += minutes + (seconds / 60);
      });
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    
    return `${hours}h ${mins}m`;
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          The course you're looking for doesn't exist or has been removed.
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
                  <div className="flex items-center">
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={`${i < Math.floor(course.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{course.rating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-300">({course.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Users size={18} className="mr-1" />
                    <span>{course.enrolledStudents.toLocaleString()} students</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Clock size={18} className="mr-1" />
                    <span>Last updated {course.lastUpdated}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="badge badge-primary">{course.category}</span>
                  <span className="badge badge-secondary">{course.level}</span>
                  <span className="badge badge-accent">{course.language}</span>
                </div>
                
                {author && (
                  <div className="flex items-center">
                    <img 
                      src={author.avatarUrl} 
                      alt={author.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
                    />
                    <div className="ml-2">
                      <p className="font-medium">{author.name}</p>
                      <p className="text-sm text-gray-300">{author.role}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Course Card */}
              <div className="md:w-5/12 md:max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {/* Course Image */}
                  <div className="relative">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <PlayCircle size={64} className="text-white opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
                    </div>
                  </div>
                  
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
                            {getTotalLectures(course.curriculum)} lectures
                          </p>
                        </div>
                        <div className="flex items-start">
                          <Clock size={18} className="text-gray-700 dark:text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">
                            {getTotalDuration(course.curriculum)} total length
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
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button>
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
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Reviews
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
                      {course.longDescription}
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What you'll learn</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {course.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={18} className="text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Requirements</h3>
                    <ul className="space-y-2 mb-6">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-700 dark:bg-gray-300 mt-2 mr-2"></div>
                          <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {author && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Instructor</h2>
                      <div className="flex items-start">
                        <img 
                          src={author.avatarUrl}
                          alt={author.name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{author.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{author.role}</p>
                          <p className="text-gray-700 dark:text-gray-300">{author.bio}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Content</h3>
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{course.curriculum.length} sections</span>
                      <span>{getTotalLectures(course.curriculum)} lectures</span>
                      <span>{getTotalDuration(course.curriculum)} total</span>
                    </div>
                    
                    <div className="mb-4">
                      <Link to={`/lecture/${course.id}/${course.curriculum[0].lectures[0].id}`} className="btn btn-primary w-full">
                        Preview Course
                      </Link>
                    </div>
                    
                    <div className="space-y-3">
                      {course.curriculum.slice(0, 3).map((section) => (
                        <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="flex items-center justify-between w-full p-4 text-left font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span>{section.title}</span>
                            <ChevronDown 
                              size={18} 
                              className={`transform transition-transform ${activeSectionId === section.id ? 'rotate-180' : ''}`} 
                            />
                          </button>
                          
                          {activeSectionId === section.id && (
                            <div className="p-4 space-y-2">
                              {section.lectures.slice(0, 2).map((lecture) => (
                                <div key={lecture.id} className="flex items-start">
                                  <PlayCircle size={16} className="text-gray-600 dark:text-gray-400 mt-1 mr-2 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-gray-800 dark:text-gray-200">{lecture.title}</p>
                                    <div className="flex items-center text-sm">
                                      <span className="text-gray-500 dark:text-gray-400">{lecture.duration}</span>
                                      {lecture.isFree && (
                                        <span className="ml-2 text-primary-600 dark:text-primary-400">Preview</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {section.lectures.length > 2 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                                  + {section.lectures.length - 2} more lectures
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {course.curriculum.length > 3 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                          + {course.curriculum.length - 3} more sections
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
                    <span>{course.curriculum.length} sections</span>
                    <span className="mx-2">•</span>
                    <span>{getTotalLectures(course.curriculum)} lectures</span>
                    <span className="mx-2">•</span>
                    <span>{getTotalDuration(course.curriculum)} total length</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {course.curriculum.map((section) => (
                    <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center justify-between w-full p-4 text-left font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <span>{section.title}</span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                            {section.lectures.length} lectures • {getTotalDuration([section])}
                          </span>
                          <ChevronDown 
                            size={18} 
                            className={`transform transition-transform ${activeSectionId === section.id ? 'rotate-180' : ''}`} 
                          />
                        </div>
                      </button>
                      
                      {activeSectionId === section.id && (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {section.lectures.map((lecture) => (
                            <div key={lecture.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                              <div className="flex items-start">
                                <PlayCircle size={18} className="text-gray-600 dark:text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <Link 
                                      to={`/lecture/${course.id}/${lecture.id}`}
                                      className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
                                    >
                                      {lecture.title}
                                    </Link>
                                    <div className="flex items-center">
                                      {lecture.isFree && (
                                        <span className="px-2 py-1 mr-3 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                                          Preview
                                        </span>
                                      )}
                                      <span className="text-sm text-gray-500 dark:text-gray-400">{lecture.duration}</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {lecture.description}
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
            
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="md:w-1/3 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                      {course.rating.toFixed(1)}
                    </div>
                    <div className="flex mb-2">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          size={24} 
                          className={`${i < Math.floor(course.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} 
                        />
                      ))}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Course Rating • {course.reviewCount} Reviews
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Student Reviews</h2>
                    
                    {course.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {course.reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                            <div className="flex items-start">
                              <img 
                                src={review.userAvatarUrl}
                                alt={review.userName}
                                className="w-10 h-10 rounded-full object-cover mr-4"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-900 dark:text-white">{review.userName}</h4>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                                </div>
                                <div className="flex my-1">
                                  {Array(5).fill(0).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      size={16} 
                                      className={`${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} 
                                    />
                                  ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mt-2">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        This course doesn't have any reviews yet.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Share your thoughts about this course with other students.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rating
                      </label>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            size={24} 
                            className="text-gray-300 dark:text-gray-600 hover:text-yellow-500 hover:fill-yellow-500 cursor-pointer" 
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Review
                      </label>
                      <textarea 
                        rows={4}
                        className="input"
                        placeholder="Write your review here..."
                      ></textarea>
                    </div>
                    <button className="btn btn-primary">
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;