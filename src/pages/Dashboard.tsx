import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Award, Bell, ArrowRight, BookOpen, Search } from 'lucide-react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import CourseProgress from '../components/dashboard/CourseProgress';
import ProgressChart from '../components/dashboard/ProgressChart';
import userData from '../utils/userProgress';
import courses from '../utils/courses';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Dashboard | ITS';
  }, []);
  
  const enrolledCourses = courses.filter(course => 
    userData.enrolledCourses.includes(course.id)
  );
  
  const weeklyProgressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [15, 25, 10, 30, 20, 5, 25]
  };
  
  const completedLectures = userData.progress.reduce(
    (total, course) => total + course.completedLectures.length, 
    0
  );
  
  const averageProgress = userData.progress.length 
    ? userData.progress.reduce((sum, course) => sum + course.overallProgress, 0) / userData.progress.length 
    : 0;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar 
        isMobile={true} 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
      <DashboardSidebar 
        isMobile={false} 
        isOpen={true} 
        onClose={() => {}} 
      />
      
      <div className="lg:pl-64">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <button
                type="button"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <BookOpen className="h-6 w-6" />
              </button>
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white lg:ml-0">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <button
                type="button"
                className="relative p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span className="sr-only">Toggle theme</span>
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              <div className="flex items-center">
                <img
                  src={userData.avatarUrl}
                  alt="User avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>
        
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {userData.name}!</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Continue your learning journey. You're making great progress!
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Courses Enrolled</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{userData.enrolledCourses.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <Award className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Certificates Earned</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{userData.certificates.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Lectures</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completedLectures}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Progress</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{Math.round(averageProgress)}%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Continue Learning</h2>
              <Link 
                to="/dashboard/courses" 
                className="text-teal-600 dark:text-teal-400 hover:underline flex items-center text-sm font-medium"
              >
                View all courses
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => {
                const courseProgress = userData.progress.find(p => p.courseId === course.id);
                if (!courseProgress) return null;
                
                return (
                  <CourseProgress 
                    key={course.id} 
                    course={course} 
                    progress={courseProgress} 
                  />
                );
              })}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Learning Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressChart 
                data={weeklyProgressData} 
                title="Weekly Learning Activity" 
              />
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Deadlines</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Assignment Due: React Components
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Modern React with Redux • Due in 2 days
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Calendar className="h-5 w-5 text-warning-600 dark:text-warning-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Quiz: Python Basics
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Complete Python Bootcamp • Due in 5 days
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Calendar className="h-5 w-5 text-success-600 dark:text-success-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Project Submission: UI Redesign
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        UI/UX Design Masterclass • Due in 7 days
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <button className="text-teal-600 dark:text-teal-400 hover:underline text-sm font-medium">
                    View Full Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended for You</h2>
              <Link 
                to="/courses" 
                className="text-teal-600 dark:text-teal-400 hover:underline flex items-center text-sm font-medium"
              >
                Browse all courses
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter(course => !userData.enrolledCourses.includes(course.id))
                .slice(0, 3)
                .map(course => (
                  <div key={course.id} className="card group">
                    <div className="relative overflow-hidden">
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-md">
                          {course.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <Link to={`/courses/${course.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {course.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-gray-900 dark:text-white">
                          ${course.price?.toFixed(2)}
                        </div>
                        <Link 
                          to={`/courses/${course.id}`} 
                          className="px-4 py-1.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                        >
                          View Course
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center space-x-3">
              <span className="text-gray-700 dark:text-gray-300">Made by Saket</span>
              <span className="inline-block px-2 py-1 bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-300 rounded-md text-xs font-medium">
                ITS
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;