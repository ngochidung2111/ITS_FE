import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Play
} from 'lucide-react';
import { courseApi, type Lesson, type Quiz, type LessonContent } from '../services/courseApi';
import ModalEditCourse from '../components/courses/ModalEditCourse';
import ModalCreateLesson from '../components/lessons/ModalCreateLesson';
import type { CreateLessonData } from '../types/course';
import ModalCreateContent from '../components/lessons/ModalCreateContent';

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  price: string | number;
  status: string;
}

const InstructorCourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [deletingContentId, setDeletingContentId] = useState<string | null>(null);
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);
  const [loadingLessonId, setLoadingLessonId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    price: ''
  });
  const [lessionId, setLessionId] = useState('');
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [isOpenUploadContent, setIsOpenUploadContent] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCourseData = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [courseData, lessonsData, quizzesData] = await Promise.all([
          courseApi.getCourseDetail(courseId),
          courseApi.getCourseLessonsWithContents(courseId),
          courseApi.getCourseQuizzes(courseId)
        ]);

        setCourse(courseData as CourseDetail);
        setLessons(lessonsData || []);
        setQuizzes(quizzesData || []);
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (course) {
      setEditData({
        title: course.title,
        description: course.description,
        price: course.price.toString()
      });
    }
  }, [course]);

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingLessonId(lessonId);
      await courseApi.deleteLesson(courseId!, lessonId);
      setLessons(lessons.filter(l => l.id !== lessonId));
      if (expandedLesson === lessonId) {
        setExpandedLesson(null);
      }
    } catch (err) {
      console.error('Failed to delete lesson:', err);
      setError('Failed to delete lesson. Please try again later.');
    } finally {
      setDeletingLessonId(null);
    }
  };

  const handleUpdateCourse = async () => {
    try {
      const dto = {
        title: editData.title,
        description: editData.description,
        price: Number(editData.price)
      };

      const updated = await courseApi.updateCourse(courseId!, dto);

      setCourse(updated);
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update course");
    }
};

  const handleCreateLesson = async (data: CreateLessonData) => {
    try {
      const newLesson = await courseApi.createLesson(courseId!, data);
      setLessons([...lessons, newLesson]);
      setIsCreateLessonOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create lesson");
    }
  };


  const handleDeleteContent = async (lessonId: string, contentId: string) => {
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      setDeletingContentId(contentId);
      await courseApi.deleteLessonContent(courseId!, lessonId, contentId);
      setLessons(
        lessons.map(lesson => {
          if (lesson.id === lessonId) {
            return {
              ...lesson,
              contents: (lesson.contents || []).filter(c => c.id !== contentId)
            };
          }
          return lesson;
        })
      );
    } catch (err) {
      console.error('Failed to delete content:', err);
      setError('Failed to delete content. Please try again later.');
    } finally {
      setDeletingContentId(null);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      setDeletingQuizId(quizId);
      await courseApi.deleteQuiz(courseId!, quizId);
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } catch (err) {
      console.error('Failed to delete quiz:', err);
      setError('Failed to delete quiz. Please try again later.');
    } finally {
      setDeletingQuizId(null);
    }
  };

  const handleExpandLesson = async (lessonId: string) => {
    if (expandedLesson === lessonId) {
      // Collapse if already expanded
      setExpandedLesson(null);
      return;
    }

    try {
      setLoadingLessonId(lessonId);
      // Fetch the lesson with all its contents
      const lessonData = await courseApi.getLesson(courseId!, lessonId);
      
      // Update the lesson in the state with the fetched data
      setLessons(
        lessons.map(lesson => 
          lesson.id === lessonId ? lessonData : lesson
        )
      );
      
      // Expand the lesson
      setExpandedLesson(lessonId);
    } catch (err) {
      console.error('Failed to fetch lesson details:', err);
      setError('Failed to load lesson details. Please try again later.');
    } finally {
      setLoadingLessonId(null);
    }
  };

  const handleUploaded = async (contentId: string, key: string) => {
    console.log("Uploaded S3 Key:", key);
    try {
      await courseApi.confirmUploadContent(contentId, key);
      alert("Content uploaded successfully");
    }
    catch(err){
      console.log(err)
      alert("Failed to upload content")
    }
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
          onClick={() => navigate('/instructor/courses')}
          className="btn btn-primary flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to My Courses
        </button>
      </div>
    );
  }

  const handleNavigateEditQuiz = async (quizId: string, courseId: string) =>{
    try {

      if (!quizId || !courseId){
        return;
      }
      navigate(`/instructor/courses/${courseId}/quizzes/${quizId}/edit`)

    }catch (err){
      console.log(err)
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-16 pb-12">
      {/* Header */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/instructor/courses"
              className="inline-flex items-center text-primary-300 hover:text-primary-200 mb-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to My Courses
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-300">${Number(course.price).toFixed(2)}</p>
              </div>
              <button onClick={() => setIsEditOpen(true)} className="btn btn-primary cursor-pointer">Edit Course</button>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lessons Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <BookOpen size={24} className="mr-3" />
                  Lessons ({lessons.length})
                </h2>
                <button onClick={() => setIsCreateLessonOpen(true)} className="btn btn-primary flex items-center text-sm">
                  <Plus size={16} className="mr-1" />
                  Add Lesson
                </button>
              </div>

              {lessons.length > 0 ? (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                      {/* Lesson Header */}
                      <button
                        onClick={() => handleExpandLesson(lesson.id)}
                        disabled={loadingLessonId === lesson.id}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-center flex-1 text-left">
                          {expandedLesson === lesson.id ? (
                            <ChevronDown size={18} className="text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0" />
                          ) : (
                            <ChevronRight size={18} className="text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0" />
                          )}
                          <span className="text-primary-600 dark:text-primary-400 font-semibold mr-3">
                            {index + 1}.
                          </span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {lesson.lessonName}
                          </span>
                          {lesson.contents && lesson.contents.length > 0 && (
                            <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full ml-3">
                              {lesson.contents.length} content{lesson.contents.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button 
                          onClick={() => {
                            setIsOpenUploadContent(true)
                            setLessionId(lesson.id)
                          }} 
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            disabled={deletingLessonId === lesson.id}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </button>

                      {/* Lesson Contents */}
                      {expandedLesson === lesson.id && (
                        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 p-4 space-y-2">
                          {lesson.contents && lesson.contents.length > 0 ? (
                            lesson.contents.map((content, contentIndex) => (
                              <div
                                key={content.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              >
                                <div className="flex items-center flex-1 text-left">
                                  {content.type === 'video' ? (
                                    <Play size={16} className="text-red-500 mr-2 flex-shrink-0" />
                                  ) : (
                                    <FileText size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <span className="text-gray-900 dark:text-white font-medium block text-sm">
                                      {content.contentName || `${content.type.charAt(0).toUpperCase() + content.type.slice(1)} ${contentIndex + 1}`}
                                    </span>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 block capitalize">
                                      {content.type}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <button className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteContent(lesson.id, content.id)}
                                    disabled={deletingContentId === content.id}
                                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-600 dark:text-gray-400">No contents added yet</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No lessons yet</p>
                  <button onClick={() => setIsCreateLessonOpen(true)} className="btn btn-primary inline-flex items-center text-sm">
                    <Plus size={16} className="mr-1" />
                    Add Your First Lesson
                  </button>
                </div>
              )}
            </div>

            {/* Quizzes Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <HelpCircle size={24} className="mr-3" />
                  Quizzes ({quizzes.length})
                </h2>
                <button className="btn btn-primary flex items-center text-sm">
                  <Plus size={16} className="mr-1" />
                  Add Quiz
                </button>
              </div>

              {quizzes.length > 0 ? (
                <div className="space-y-3">
                  {quizzes.map((quiz, index) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <span className="text-primary-600 dark:text-primary-400 font-semibold mr-3">
                          {index + 1}.
                        </span>
                        <div>
                          <span className="text-gray-900 dark:text-white font-medium block">
                            {quiz.title}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.floor(quiz.timeLimit / 60)} minutes
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleNavigateEditQuiz(quiz.id, course.id)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          disabled={deletingQuizId === quiz.id}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No quizzes yet</p>
                  <button className="btn btn-primary inline-flex items-center text-sm">
                    <Plus size={16} className="mr-1" />
                    Add Your First Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EDIT COURSE MODAL */}
      {isEditOpen && <ModalEditCourse editData={editData} setEditData={setEditData} setIsEditOpen={setIsEditOpen} handleUpdateCourse={handleUpdateCourse} />}

      {/* CREATE LESSON MODAL */}
      {isCreateLessonOpen && <ModalCreateLesson isOpen={isCreateLessonOpen} onClose={() => setIsCreateLessonOpen(false)} onSubmit={handleCreateLesson} />}

      {/* CREATE CONTENT MODAL */}
      {isOpenUploadContent && <ModalCreateContent isOpen={isOpenUploadContent} courseId={courseId!} lessonId={lessionId} onClose={() => setIsOpenUploadContent(false)} onUploaded={handleUploaded} />}

    </div>


    

    
  );
};

export default InstructorCourseDetail;
