import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Edit2,
  Trash2,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
  ListOrdered,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import { quizApi } from "../services/quizApi";
import { type Question, type Quiz } from "../types/quiz";

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionName: "",
      answers: [
        { content: "Option A", isCorrect: true },
        { content: "Option A", isCorrect: false },
        { content: "Option A", isCorrect: false },
        { content: "Option A", isCorrect: false },
      ],
    },
  ]);

  // const toggleQuestion = (idx: number) => {
  //   setQuestions(
  //     questions.map((q, index) => (index === idx ? { ...q, expanded: !q.expanded } : q))
  //   );
  // };

  const handleCreateQuiz = async () => {
    if (!quizTitle || !timeLimit || !questions) {
      alert("Please fill all the required fields!!");
      return;
    }
    setLoading(true);
    const quiz: Quiz = {
      title: quizTitle,
      timeLimit: timeLimit,
      questions: questions,
    };
    try {
      const response = await quizApi.createQuiz(courseId as string, quiz);
      if (response) {
        console.log("Response ", response);
      }
    } catch (error) {
      console.log("Error ", error);
    }

    setLoading(false);
    setDone(true);
  };
  const addQuestion = () => {
    const newQuestion: Question = {
      questionName: "",
      answers: [
        { content: "Option A", isCorrect: true },
        { content: "Option A", isCorrect: false },
        { content: "Option A", isCorrect: false },
        { content: "Option A", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (idx: number, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q, index) => (index === idx ? { ...q, ...updates } : q))
    );
  };

  const updateAnswer = (
    questionIndex: number,
    answerIndex: number,
    field: string,
    value: any
  ) => {
    setQuestions((prev) =>
      prev.map((q, qIdx) =>
        qIdx === questionIndex
          ? {
              ...q,
              answers: q.answers.map((ans, aIdx) =>
                aIdx === answerIndex
                  ? { ...ans, [field]: value } // UPDATE FIELD HERE
                  : ans
              ),
            }
          : q
      )
    );
  };

  const deleteQuestion = (idx: number) => {
    setQuestions(questions.filter((q, index) => index !== idx));
  };

  const setCorrectAnswer = (questionIndex: number, answerIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, qIdx) =>
        qIdx === questionIndex
          ? {
              ...q,
              answers: q.answers.map((ans, aIdx) => ({
                ...ans,
                isCorrect: aIdx === answerIndex, // chỉ answer được click = true
              })),
            }
          : q
      )
    );
  };
  // const setCorrectAnswer = (questionId: string, optionId: string) => {
  //   updateQuestion(questionId, { correctAnswer: optionId });
  // };

  if (loading) {
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
  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="container mx-auto my-20 space-y-10">
          <h1 className="text-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Create Quiz Successfully!
          </h1>
          <div className="text-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(-1);
              }}
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  } else
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <Link
                to={`/#`}
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-2"
              >
                <ChevronLeft size={16} className="mr-1" />
                Back to Course
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Create New Quiz
              </h1>
            </div>
            <div className="space-y-8">
              {/* Quiz Details Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold  mb-6">Quiz Details</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium  mb-2">
                      Quiz Title
                    </label>
                    <input
                      placeholder="Enter quiz title..."
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="input pl-5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium  mb-2">
                      Description
                    </label>
                    <div className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800">
                      <div className="flex items-center border border-gray-300 dark:border-gray-700 gap-1  p-2">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Bold className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Italic className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Underline className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <LinkIcon className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <List className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <ListOrdered className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <RotateCcw className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <textarea
                        placeholder="Describe the quiz..."
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 dark:bg-gray-800 dark:text-white resize-none focus:outline-none"
                        rows={6}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold  mb-6">Settings</h2>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium  mb-2">
                      Time Limit (minutes)
                    </label>
                    <select
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 border  border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500"
                    >
                      <option className="bg-gray-700" value={0}>
                        No limit
                      </option>
                      <option className="bg-gray-700" value={5}>
                        5 minutes
                      </option>
                      <option className="bg-gray-700" value={10}>
                        10 minutes
                      </option>
                      <option className="bg-gray-700" value={15}>
                        15 minutes
                      </option>
                      <option className="bg-gray-700" value={30}>
                        30 minutes
                      </option>
                      <option className="bg-gray-700" value={60}>
                        60 minutes
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold ">Questions</h2>
                  <button onClick={addQuestion} className="btn btn-primary">
                    + Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.map((question, indexQues) => (
                    <div
                      key={indexQues}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        //onClick={() => toggleQuestion(index)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-600">
                            {indexQues + 1}
                          </span>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">
                              {question.questionName || "Untitled question"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Multiple Choice
                            </p>
                          </div>
                        </div>
                      </button>

                      <div className="border-t border-gray-200 p-4 bg-white">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question
                          </label>
                          <input
                            value={question.questionName}
                            onChange={(e) =>
                              updateQuestion(indexQues, {
                                questionName: e.target.value,
                              })
                            }
                            placeholder="Enter question text"
                            className="w-full px-4 py-2 text-gray-700 border border-gray-300 dark:border-gray-700 rounded-lg
					 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
					"
                          />
                        </div>

                        <div className="space-y-3 mb-4">
                          {question.answers?.map((option, indexAns) => (
                            <div
                              key={indexAns}
                              className="flex items-center gap-3"
                            >
                              <input
                                type="radio"
                                id={`${indexQues}-${indexAns}`}
                                name={`question-${indexQues}`}
                                checked={option.isCorrect}
                                onChange={() =>
                                  setCorrectAnswer(indexQues, indexAns)
                                }
                                className="w-4 h-4 text-blue-600"
                              />
                              <input
                                placeholder={option.content}
                                defaultValue={option.content}
                                className="flex h-10 w-full border-b font-medium text-gray-600 rounded-md px-3 py-2 text-base border-0 outline-0 md:text-sm"
                                onChange={(e) =>
                                  updateAnswer(
                                    indexQues,
                                    indexAns,
                                    "content",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteQuestion(indexQues)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mb-8">
                <button className="btn btn-outline">Save Quiz</button>
                <button className="btn btn-outline">Preview</button>
                <button className="btn btn-primary" onClick={handleCreateQuiz}>
                  Publish Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default CreateQuizPage;
