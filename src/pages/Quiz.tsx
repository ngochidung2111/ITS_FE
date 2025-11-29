import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle, AlertTriangle, Clock, Flag, HelpCircle } from 'lucide-react';
import courses, { type Course, type Quiz, type Question } from '../utils/courses';

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(900); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    let foundQuiz: Quiz | null = null;
    let foundCourse: Course | null = null;
    
    for (const course of courses) {
      const quiz = course.quizzes.find(q => q.id === quizId);
      if (quiz) {
        foundQuiz = quiz;
        foundCourse = course;
        break;
      }
    }
    
    if (foundQuiz && foundCourse) {
      setQuiz(foundQuiz);
      setCourse(foundCourse);
      setSelectedOptions(new Array(foundQuiz.questions.length).fill(-1));
      document.title = `${foundQuiz.title} | ITS`;
    }

    setTimeout(() => {
      setLoading(false);
    }, 800);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizId]);
  
  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const toggleFlagged = (index: number) => {
    if (flaggedQuestions.includes(index)) {
      setFlaggedQuestions(flaggedQuestions.filter(i => i !== index));
    } else {
      setFlaggedQuestions([...flaggedQuestions, index]);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const calculateScore = () => {
    if (!quiz) return 0;
    
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctOptionIndex) {
        correctAnswers++;
      }
    });
    
    return Math.round((correctAnswers / quiz.questions.length) * 100);
  };
  
  const handleSubmit = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setIsSubmitted(true);
  };
  
  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };
  
  const isQuestionAnswered = (index: number) => {
    return selectedOptions[index] !== -1;
  };
  
  const isQuestionCorrect = (index: number) => {
    if (!quiz) return false;
    return selectedOptions[index] === quiz.questions[index].correctOptionIndex;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!quiz || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 px-4">
        <AlertTriangle size={64} className="text-warning-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          The quiz you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          to={`/courses/${course?.id}`}
          className="btn btn-primary flex items-center"
        >
          <ChevronLeft size={18} className="mr-2" />
          Back to Course
        </Link>
      </div>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link 
              to={`/courses/${course.id}`}
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-2"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Course
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{quiz.description}</p>
          </div>
          
          {isSubmitted ? (
            /* Results Screen */
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  score >= 70 
                    ? 'bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400' 
                    : 'bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400'
                }`}>
                  {score >= 70 ? (
                    <CheckCircle size={40} />
                  ) : (
                    <AlertTriangle size={40} />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {score >= 70 ? 'Quiz Passed!' : 'Almost There!'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You scored {score}% on this quiz.
                </p>
                <div className="w-full max-w-xs mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
                  <div 
                    className={`h-4 rounded-full ${
                      score >= 70 ? 'bg-success-500' : 'bg-warning-500'
                    }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Question Review</h3>
                <div className="space-y-6">
                  {quiz.questions.map((question, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${
                        isQuestionCorrect(index)
                          ? 'border-success-200 bg-success-50 dark:border-success-900 dark:bg-success-900/20'
                          : 'border-error-200 bg-error-50 dark:border-error-900 dark:bg-error-900/20'
                      }`}
                    >
                      <div className="flex items-start">
                        <span className="font-medium text-gray-800 dark:text-gray-200 mr-2">{index + 1}.</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">{question.text}</p>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div 
                                key={optionIndex}
                                className={`p-3 rounded-md flex items-center ${
                                  optionIndex === question.correctOptionIndex
                                    ? 'bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800'
                                    : selectedOptions[index] === optionIndex
                                      ? 'bg-error-100 dark:bg-error-900/30 border border-error-200 dark:border-error-800'
                                      : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                <div className={`w-5 h-5 flex-shrink-0 rounded-full border ${
                                  selectedOptions[index] === optionIndex
                                    ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
                                    : 'border-gray-400 dark:border-gray-500'
                                } mr-3`}>
                                  {selectedOptions[index] === optionIndex && (
                                    <span className="flex items-center justify-center h-full text-white text-xs">
                                      ✓
                                    </span>
                                  )}
                                </div>
                                <span className={`${
                                  optionIndex === question.correctOptionIndex
                                    ? 'text-success-800 dark:text-success-200 font-medium'
                                    : selectedOptions[index] === optionIndex
                                      ? 'text-error-800 dark:text-error-200'
                                      : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {option}
                                </span>
                                {optionIndex === question.correctOptionIndex && (
                                  <CheckCircle size={16} className="ml-auto text-success-600 dark:text-success-400" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to={`/courses/${course.id}`}
                    className="btn btn-primary"
                  >
                    Back to Course
                  </Link>
                  <button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setCurrentQuestionIndex(0);
                      setSelectedOptions(new Array(quiz.questions.length).fill(-1));
                      setFlaggedQuestions([]);
                      setTimeLeft(900);
                    }}
                    className="btn btn-outline"
                  >
                    Retry Quiz
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Quiz Screen */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  {/* Timer */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <Clock size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">Time Remaining: <span className="font-medium">{formatTime(timeLeft)}</span></span>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      Question <span className="font-medium">{currentQuestionIndex + 1}</span> of <span className="font-medium">{quiz.questions.length}</span>
                    </div>
                  </div>
                  
                  {/* Question */}
                  <div className="p-6">
                    <div className="flex items-start mb-6">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {currentQuestion.text}
                        </h2>
                      </div>
                      <button 
                        onClick={() => toggleFlagged(currentQuestionIndex)}
                        className={`ml-4 p-2 rounded-full ${
                          flaggedQuestions.includes(currentQuestionIndex)
                            ? 'text-warning-600 bg-warning-100 dark:text-warning-400 dark:bg-warning-900/30'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                        title={flaggedQuestions.includes(currentQuestionIndex) ? "Unflag question" : "Flag for review"}
                      >
                        <Flag size={20} />
                      </button>
                    </div>
                    
                    {/* Options */}
                    <div className="space-y-3 mb-8">
                      {currentQuestion.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleOptionSelect(currentQuestionIndex, optionIndex)}
                          className={`w-full p-4 rounded-lg border text-left transition-colors ${
                            selectedOptions[currentQuestionIndex] === optionIndex
                              ? 'bg-primary-100 border-primary-300 dark:bg-primary-900/30 dark:border-primary-700'
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border ${
                              selectedOptions[currentQuestionIndex] === optionIndex
                                ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
                                : 'border-gray-400 dark:border-gray-500'
                            } mr-3`}>
                              {selectedOptions[currentQuestionIndex] === optionIndex && (
                                <span className="flex items-center justify-center h-full text-white text-xs">
                                  ✓
                                </span>
                              )}
                            </div>
                            <span className={`${
                              selectedOptions[currentQuestionIndex] === optionIndex
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {option}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                      <button
                        onClick={handlePrevious}
                        className={`btn btn-outline ${currentQuestionIndex === 0 ? 'invisible' : ''}`}
                      >
                        Previous
                      </button>
                      
                      {currentQuestionIndex === quiz.questions.length - 1 ? (
                        <button
                          onClick={handleSubmit}
                          className="btn btn-primary"
                        >
                          Submit Quiz
                        </button>
                      ) : (
                        <button
                          onClick={handleNext}
                          className="btn btn-primary"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Question Navigator */}
              <div className="md:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Question Navigator</h3>
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {quiz.questions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => jumpToQuestion(index)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium
                          ${currentQuestionIndex === index 
                            ? 'bg-primary-600 text-white' 
                            : flaggedQuestions.includes(index)
                              ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                              : isQuestionAnswered(index)
                                ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-primary-600 rounded-md mr-2"></div>
                      <span className="text-gray-700 dark:text-gray-300">Current Question</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-success-100 dark:bg-success-900/30 rounded-md mr-2"></div>
                      <span className="text-gray-700 dark:text-gray-300">Answered</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-warning-100 dark:bg-warning-900/30 rounded-md mr-2"></div>
                      <span className="text-gray-700 dark:text-gray-300">Flagged for Review</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded-md mr-2"></div>
                      <span className="text-gray-700 dark:text-gray-300">Unanswered</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span>Answered:</span>
                      <span className="font-medium">{selectedOptions.filter(opt => opt !== -1).length} of {quiz.questions.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${(selectedOptions.filter(opt => opt !== -1).length / quiz.questions.length) * 100}%` }}
                      ></div>
                    </div>
                    
                    <button
                      onClick={handleSubmit}
                      className="w-full btn btn-primary"
                    >
                      Submit Quiz
                    </button>
                    
                    <div className="mt-4 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                      <HelpCircle size={16} className="mr-1" />
                      <span>Need help? <button className="text-primary-600 dark:text-primary-400 hover:underline">View instructions</button></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;