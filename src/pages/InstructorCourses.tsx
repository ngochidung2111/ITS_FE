import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  AlertTriangle,
  DollarSign,
  BookOpen,
  Edit,
  Trash2
} from 'lucide-react';
import { courseApi } from '../services/courseApi';

interface InstructorCourse {
  id: string;
  title: string;
  price: string | number;
}

const InstructorCourses = () => {
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await courseApi.getInstructorCourses();
        setCourses(data || []);
      } catch (err) {
        console.error('Failed to fetch instructor courses:', err);
        setError('Failed to load your courses. Please try again later.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(courseId);
      await courseApi.deleteCourse(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (err) {
      console.error('Failed to delete course:', err);
      setError('Failed to delete course. Please try again later.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-16 pb-12">
      {/* Header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">My Courses</h1>
                <p className="text-gray-300">
                  Manage and create your courses for students
                </p>
              </div>
              <Link
                to="/courses/create"
                className="btn btn-primary flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Create New Course
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-300">Error</h3>
                  <p className="text-red-800 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Placeholder Image */}
                  <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center group-hover:opacity-90 transition-opacity">
                    <BookOpen size={48} className="text-white opacity-80" />
                  </div>

                  {/* Course Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center text-primary-600 dark:text-primary-400">
                        <DollarSign size={18} className="mr-1" />
                        <span className="font-semibold">
                          {Number(course.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to={`/instructor/courses/${course.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                      >
                        <Edit size={16} />
                        Manage
                      </Link>
                      <button 
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={deletingId === course.id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                        {deletingId === course.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen size={64} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No courses yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Start creating courses to share your knowledge with students. Click the button above to get started.
              </p>
              <Link
                to="/courses/create"
                className="btn btn-primary inline-flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Create Your First Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourses;
