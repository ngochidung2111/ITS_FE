import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import VideoLecture from './pages/VideoLecture';
import Quiz from './pages/Quiz';
import LessonContent from './pages/LessonContent';
import NotFound from './pages/NotFound';
import PublicCourses from './pages/PublicCourses';
import CreateCourse from './pages/CreateCourse';
import InstructorCourses from './pages/InstructorCourses';
import InstructorCourseDetail from './pages/InstructorCourseDetail';
function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Loading ITS...
          </h2>
        </div>
      </div>
    );
  }
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<PublicCourses />} />
            <Route path="courses/create" element={<CreateCourse />} />
            <Route path="courses/:courseId" element={<CourseDetail />} />
            <Route path="instructor/courses" element={<InstructorCourses />} />
            <Route path="instructor/courses/:courseId" element={<InstructorCourseDetail />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="lecture/:courseId/:lectureId" element={<VideoLecture />} />
            <Route path="courses/:courseId/lessons/:lessonId" element={<LessonContent />} />
            <Route path="courses/:courseId/quizzes/:quizId" element={<Quiz />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;