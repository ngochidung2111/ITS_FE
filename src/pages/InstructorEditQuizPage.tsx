import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Save, Loader2, AlertTriangle, Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'; 
import axios from 'axios';

import { 
    courseApi, 
    type QuizDetail, 
    type QuizQuestion, 
    type QuizAnswer 
} from '../services/courseApi'; 

const INITIAL_ANSWERS = [
    { content: '', isCorrect: true },
    { content: '', isCorrect: false },
];

interface NewQuestionPayload {
    questionName: string;
    answers: { content: string; isCorrect: boolean; }[];
}


//Logic pop up model for create new question
const QuestionFormModal = ({ 
    courseId, 
    quizId, 
    onClose, 
    onSuccess 
}: { 
    courseId: string; 
    quizId: string; 
    onClose: () => void; 
    onSuccess: () => void; 
}) => {
    const [qName, setQName] = useState('');
    const [answers, setAnswers] = useState(INITIAL_ANSWERS);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const modalRef = useRef<HTMLDivElement>(null); 

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close model if click outside
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]); 

    const handleAnswerContentChange = (index: number, newContent: string) => {
        setAnswers(answers.map((ans, i) => 
            i === index ? { ...ans, content: newContent } : ans
        ));
    };

    const handleSetCorrect = (index: number) => {
        setAnswers(answers.map((ans, i) => 
            i === index ? { ...ans, isCorrect: true } : { ...ans, isCorrect: false }
        ));
    };

    const handleAddAnswer = () => {
        setAnswers(prev => [...prev, { content: '', isCorrect: false }]);
    };

    const handleDeleteAnswer = (index: number) => {
        if (answers.length <= 1) {
            alert("A question must have at least one answer option.");
            return;
        }
        setAnswers(answers.filter((_, i) => i !== index));
    };

    const handleSaveNewQuestion = async () => {
        const trimmedQName = qName.trim();
        const validAnswers = answers.filter(a => a.content.trim() !== '');

        if (!trimmedQName || trimmedQName.length < 3) {
            setError('Question text must be at least 3 characters long.');
            return;
        }
        if (validAnswers.length === 0) {
            setError('Please provide at least one answer option.');
            return;
        }
        if (!validAnswers.some(a => a.isCorrect)) {
            setError('You must select one correct answer.');
            return;
        }
        setError(null);

        try {
            setIsSaving(true);
            const payload: NewQuestionPayload = {
                questionName: trimmedQName,
                answers: validAnswers,
            };

            await (courseApi.createQuestion as any)(courseId, quizId, payload);
            
            alert('Question successfully created!');
            onSuccess(); // Yêu cầu fetch lại dữ liệu cha
            onClose();

        } catch (err) {
            console.error("Failed to create question:", err);
            setError('SAVE FAILED: Could not create question. Check console.');
            
            if (axios.isAxiosError(err) && err.response && err.response.data) {
                 setError(`Server Error: ${JSON.stringify(err.response.data)}`);
            }
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div 
            ref={modalRef} 
            className="absolute top-full right-0 mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-xl w-80 z-50 transform transition-all max-h-[80vh] overflow-y-auto"
        >
            <h3 className="text-lg font-bold mb-3 border-b pb-2">Add New Question</h3>
            
            {error && <div className="p-2 mb-3 text-red-700 bg-red-100 rounded-lg text-xs">{error}</div>}

            <label className="block text-gray-700 font-medium mb-1 text-sm">Question Text *</label>
            <input 
                type="text" 
                value={qName} 
                onChange={(e) => setQName(e.target.value)} 
                className="w-full p-2 border rounded-lg mb-3 text-sm" 
                disabled={isSaving}
                placeholder="Question text"
            />
            
            <h4 className="font-medium mb-2 text-sm">Answers (Select One Correct) *</h4>
            <div className="space-y-2">
                {answers.map((a, index) => (
                    <div key={index} className="flex items-center">
                        <input 
                            type="checkbox" 
                            checked={a.isCorrect} 
                            onChange={() => handleSetCorrect(index)}
                            className="w-4 h-4 text-success-600 rounded-full mr-2"
                            disabled={isSaving}
                        />
                        <input 
                            type="text" 
                            value={a.content} 
                            onChange={(e) => handleAnswerContentChange(index, e.target.value)}
                            className="flex-1 p-2 border rounded-lg text-sm"
                            disabled={isSaving}
                            placeholder={`Option ${index + 1}`}
                        />
                        <button onClick={() => handleDeleteAnswer(index)} className="ml-2 text-red-500 hover:bg-red-50 p-1 rounded" disabled={isSaving}>
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={handleAddAnswer} className="btn btn-secondary-sm mt-3 mb-4 text-xs" disabled={isSaving}>
                <Plus size={12} className="mr-1" /> Add Option
            </button>


            <div className="flex justify-end space-x-3 border-t pt-3">
                <button onClick={onClose} className="btn btn-outline-sm" disabled={isSaving}>Cancel</button>
                <button onClick={handleSaveNewQuestion} className="btn btn-primary-sm" disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin mr-2" size={14} /> : <Save size={14} className="mr-2" />}
                    Save
                </button>
            </div>
        </div>
    );
};

const InstructorEditQuizPage = () => {
    const { courseId, quizId } = useParams<{ courseId: string, quizId: string }>();
    const navigate = useNavigate();

    const [quizData, setQuizData] = useState<QuizDetail | null>(null);
    const [originalQuizData, setOriginalQuizData] = useState<QuizDetail | null>(null); 
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSavingBasic, setIsSavingBasic] = useState(false);
    
    const [isAddingQuestion, setIsAddingQuestion] = useState(false); 

    const fetchQuizData = useCallback(async () => {
        if (!courseId || !quizId) {
            setError("Missing Course ID or Quiz ID.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const fetchedQuiz = await courseApi.getQuizDetail(courseId, quizId);
            
            const quizCopy = JSON.parse(JSON.stringify(fetchedQuiz));
            
            setQuizData(fetchedQuiz);
            setOriginalQuizData(quizCopy); 

        } catch (err) {
            console.error("Failed to load quiz for editing:", err);
            setError("Failed to load Quiz details. Please check network or API endpoint.");
        } finally {
            setLoading(false);
        }
    }, [courseId, quizId]);

    useEffect(() => {
        fetchQuizData();
    }, [fetchQuizData]);

    
    // --- HÀM KIỂM TRA THAY ĐỔI CỦA BASIC INFO (DIRTY CHECK) ---
    const isBasicInfoDirty = useCallback(() => {
        if (!quizData || !originalQuizData) return false;
        
        const isTitleDirty = quizData.title.trim() !== originalQuizData.title.trim();
        const isTimeLimitDirty = quizData.timeLimit !== originalQuizData.timeLimit;
        
        return isTitleDirty || isTimeLimitDirty;
    }, [quizData, originalQuizData]);

    const handleSaveBasicInfo = async () => {
        if (!quizData || !courseId || !quizId || !isBasicInfoDirty()) {
            navigate(`/instructor/courses/${courseId}`);
            return;
        }

        if (!quizData.title.trim() || quizData.timeLimit <= 0) {
            alert("Quiz Title and Time Limit must be valid.");
            return;
        }

        try {
            setIsSavingBasic(true);
            const basicUpdateData = {
                "quizName": quizData.title.trim(), 
                "timeLimit": quizData.timeLimit,
            };

            await (courseApi.updateQuiz as any)(courseId, quizId, basicUpdateData); 
            
            const newOriginalData = JSON.parse(JSON.stringify(quizData));
            setOriginalQuizData(newOriginalData);

            alert('Quiz Basic Info updated successfully! Redirecting to Course Details.');
            navigate(`/instructor/courses/${courseId}`); 

        } catch (err) {
            console.error("Error saving basic info:", err);
            alert('SAVE FAILED. Check console for details.');
        } finally {
            setIsSavingBasic(false);
        }
    };
    
    const handleDeleteQuestion = async (qId: string) => {
        if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) return;

        try {
            if (qId.length > 10) { 
                await (courseApi.deleteQuestion as any)(courseId, quizId, qId); 
            }
            
            await fetchQuizData(); // Refetch data 
            
        } catch (err) {
            console.error("Failed to delete question:", err);
            alert('Failed to delete question. Please check the console.');
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen pt-16">
                <Loader2 className="animate-spin text-primary-500" size={40} />
            </div>
        );
    }
    
    if (error || !quizData) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                <AlertTriangle className="mx-auto mb-2 text-red-600" size={30} />
                <h2 className="text-xl font-bold">Error Loading Quiz</h2>
                <p>{error || 'Quiz not found or connection error.'}</p>
                <Link to={`/instructor/courses/${courseId}`} className="btn btn-primary mt-4">
                    <ChevronLeft size={16} className="mr-2" /> Back to Course
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pt-24 pb-12 px-4"> 
            
            <Link to={`/instructor/courses/${courseId}`} className="text-primary-600 hover:underline flex items-center mb-6">
                <ChevronLeft size={16} className="mr-2" />
                Back to Course Detail
            </Link>
            <h1 className="text-3xl font-bold mb-8 text-gray-900">
                Editing Quiz: <span className="text-primary-600">{quizData.title}</span>
            </h1>

            <div className="space-y-10">
                
                {/* 1. THÔNG TIN CƠ BẢN (BASIC INFO) */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Basic Settings</h2>
                        <button 
                            onClick={handleSaveBasicInfo} 
                            disabled={isSavingBasic || !isBasicInfoDirty()}
                            className={`btn flex items-center text-sm min-w-[120px] 
                                ${!isBasicInfoDirty() || isSavingBasic
                                    ? 'disabled:bg-gray-400 disabled:text-gray-700 disabled:hover:bg-gray-400 disabled:cursor-not-allowed bg-gray-400 hover:bg-gray-400' 
                                    : 'btn-primary'
                                }`}
                        >
                            {isSavingBasic ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                            {isSavingBasic ? "Saving..." : "Save & Exit"}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Quiz Title</label>
                            <input 
                                type="text"
                                value={quizData.title}
                                onChange={(e) => setQuizData(prev => prev ? {...prev, title: e.target.value} : null)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                disabled={isSavingBasic}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Time Limit (minutes)</label>
                            <input 
                                type="number"
                                value={quizData.timeLimit / 60}
                                onChange={(e) => setQuizData(prev => prev ? {...prev, timeLimit: Number(e.target.value) * 60} : null)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                min="1"
                                disabled={isSavingBasic}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. QUẢN LÝ CÂU HỎI (QUESTIONS MANAGEMENT) */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative"> 
                    
                    <div className="flex justify-between items-center mb-6 relative"> 
                        <h2 className="text-xl font-semibold text-gray-800">
                            Questions ({quizData.questions.length})
                        </h2>
                        {/* CONTAINER NÚT VÀ POPOVER (relative) */}
                        <div className="relative"> 
                            <button onClick={() => setIsAddingQuestion(true)} className="btn btn-primary flex items-center text-sm">
                                <Plus size={16} className="mr-1" /> Add Question
                            </button>
                            
                            {isAddingQuestion && (
                                <QuestionFormModal 
                                    courseId={courseId!}
                                    quizId={quizId!}
                                    onClose={() => setIsAddingQuestion(false)}
                                    onSuccess={fetchQuizData} 
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {quizData.questions.map((q, qIndex) => (
                            <div key={q.id} className="p-0 border rounded-lg overflow-hidden">
                                
                                <div className="p-4 bg-gray-100 flex justify-between items-center">
                                    <div className="flex-1 mr-4 flex items-center">
                                        <span className="font-semibold text-gray-800 mr-2">{qIndex + 1}.</span>
                                        <div 
                                            className="inline-block p-1 bg-transparent text-base font-medium w-11/12 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap"
                                            title={q.questionName}
                                        >
                                            {q.questionName}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* Hiển thị số lượng đáp án */}
                                        <div className="p-2 text-gray-500">
                                            {q.answers.length} {q.answers.length === 1 ? 'Answer' : 'Answers'}
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteQuestion(q.id)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                            title="Delete Question"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-white border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Answers:</h4>
                                    <div className="space-y-2">
                                        {q.answers.map((a, aIndex) => (
                                            <div key={aIndex} className="flex items-center p-2 rounded-md border border-gray-100">
                                                <div className={`w-4 h-4 rounded-full mr-3 ${a.isCorrect ? 'bg-success-500' : 'bg-gray-300'}`}></div>
                                                <div className="flex-1 text-sm">{a.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorEditQuizPage;