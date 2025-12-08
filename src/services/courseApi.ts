import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('userToken');
};

// API instance with auth header
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CourseBasicInfo {
  id: string;
  title: string;
  description: string;
  price: string | number;
  status: string;
  instructor?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LessonContent {
  id: string;
  order?: number;
  serial?: number;
  contentName?: string;
  type: string;
  text?: string | null;
  content?: string;
  url?: string | null;
  lessonId: string;
}

export interface Lesson {
  id: string;
  lessonName: string;
  order: number;
  courseId: string;
  contents?: LessonContent[];
}

export interface Quiz {
  id: string;
  title: string;
  timeLimit: number;
  courseId: string;
}

export interface QuizAnswer {
  id: string;
  content: string;
  isCorrect: boolean;
  questionId: string;
}

export interface QuizQuestion {
  id: string;
  questionName: string;
  quizId: string;
  answers: QuizAnswer[];
}

export interface QuizDetail extends Quiz {
  questions: QuizQuestion[];
}

export const courseApi = {
  /**
   * Get basic course info (title, description, price, status)
   */
  getCourseDetail: async (courseId: string): Promise<CourseBasicInfo> => {
    const response = await apiClient.get<CourseBasicInfo>(
      `/courses/${courseId}`
    );
    return response.data;
  },

  /**
   * Get course lessons (without contents)
   */
  getCourseLessons: async (courseId: string): Promise<Lesson[]> => {
    const response = await apiClient.get<Lesson[]>(
      `/courses/${courseId}/lessons`
    );
    return response.data;
  },

  /**
   * Get lesson contents by lesson ID
   */
  getLessonContents: async (courseId: string, lessonId: string): Promise<Lesson['contents']> => {
    const response = await apiClient.get<Lesson['contents']>(
      `/courses/${courseId}/lessons/${lessonId}`
    );
    return response.data;
  },

  /**
   * Get course quizzes
   */
  getCourseQuizzes: async (courseId: string): Promise<Quiz[]> => {
    const response = await apiClient.get<Quiz[]>(
      `/courses/${courseId}/quizzes`
    );
    return response.data;
  },

  /**
   * Get quiz detail including questions and answers
   */
  getQuizDetail: async (courseId: string, quizId: string): Promise<QuizDetail> => {
    const response = await apiClient.get<QuizDetail>(
      `/courses/${courseId}/quizzes/${quizId}`
    );
    return response.data;
  },

  /**
   * Get quiz detail by quiz id only
   */
  getQuizDetailById: async (quizId: string): Promise<QuizDetail> => {
    const response = await apiClient.get<QuizDetail>(
      `/courses/1/quizzes/${quizId}`
    );
    return response.data;
  },

  /**
   * Get course instructor info
   */
  getCourseInstructor: async (courseId: string): Promise<CourseBasicInfo['instructor']> => {
    const response = await apiClient.get<CourseBasicInfo['instructor']>(
      `/courses/${courseId}/instructor`
    );
    return response.data;
  },

  /**
   * Get all courses for current instructor
   */
  getInstructorCourses: async () => {
    const response = await apiClient.get<any[]>(`/courses/instructor/me`);
    return response.data;
  },

  /**
   * Get all lessons with contents for a course
   */
  getCourseLessonsWithContents: async (courseId: string): Promise<Lesson[]> => {
    const response = await apiClient.get<Lesson[]>(
      `/courses/${courseId}/lessons`
    );
    return response.data;
  },

  /**
   * Get single lesson with its contents
   */
  getLesson: async (courseId: string, lessonId: string): Promise<Lesson> => {
    const response = await apiClient.get<Lesson>(
      `/courses/${courseId}/lessons/${lessonId}`
    );
    return response.data;
  },

  /**
   * Create a new lesson for a course
   */
  createLesson: async (courseId: string, lessonData: { lessonName: string; order: number }): Promise<Lesson> => {
    const response = await apiClient.post<Lesson>(
      `/courses/${courseId}/lessons`,
      lessonData
    );
    return response.data;
  },

  /**
   * Update a lesson
   */
  updateLesson: async (courseId: string, lessonId: string, lessonData: { lessonName?: string; order?: number }): Promise<Lesson> => {
    const response = await apiClient.put<Lesson>(
      `/courses/${courseId}/lessons/${lessonId}`,
      lessonData
    );
    return response.data;
  },

  /**
   * Delete a lesson
   */
  deleteLesson: async (courseId: string, lessonId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`);
  },

  /**
   * Create content for a lesson
   */
  createLessonContent: async (
    courseId: string,
    lessonId: string,
    contentData: Partial<LessonContent>
  ): Promise<LessonContent> => {
    const response = await apiClient.post<LessonContent>(
      `/courses/${courseId}/lessons/${lessonId}/contents`,
      contentData
    );
    return response.data;
  },

  /**
   * Update lesson content
   */
  updateLessonContent: async (
    courseId: string,
    lessonId: string,
    contentId: string,
    contentData: Partial<LessonContent>
  ): Promise<LessonContent> => {
    const response = await apiClient.put<LessonContent>(
      `/courses/${courseId}/lessons/${lessonId}/contents/${contentId}`,
      contentData
    );
    return response.data;
  },

  /**
   * Delete lesson content
   */
  deleteLessonContent: async (courseId: string, lessonId: string, contentId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}/lessons/${lessonId}/content/${contentId}`);
  },

  /**
   * Create a quiz for a course
   */
  createQuiz: async (courseId: string, quizData: { title: string; timeLimit: number }): Promise<Quiz> => {
    const response = await apiClient.post<Quiz>(
      `/courses/${courseId}/quizzes`,
      quizData
    );
    return response.data;
  },

  /**
   * Update a quiz
   */
  updateQuiz: async (courseId: string, quizId: string, quizData: { quizName?: string; timeLimit?: number }): Promise<Quiz> => {
    const response = await apiClient.patch<Quiz>(
      `/courses/${courseId}/quizzes/${quizId}`,
      quizData
    );
    return response.data;
  },

  /**
   * Delete a quiz
   */
  deleteQuiz: async (courseId: string, quizId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}/quizzes/${quizId}`);
  },

  /**
   * Thêm Question mới vào Quiz
   */
  createQuestion: async (courseId: string, quizId: string, questionData: Omit<QuizQuestion, 'id' | 'quizId'>): Promise<QuizQuestion> => {
      const response = await apiClient.post<QuizQuestion>(
          `/courses/${courseId}/quizzes/${quizId}/questions`,
          questionData
      );
      return response.data;
  },

  /**
   * Xóa một Question cụ thể
   */
  deleteQuestion: async (courseId: string, quizId: string, questionId: string): Promise<void> => {
      await apiClient.delete(
          `/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`
      );
  },

  /**
   * Delete a course
   */
  deleteCourse: async (courseId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}`);
  },

  /**
   * Update course info
   */
  updateCourse: async (courseId: string, courseData: Partial<CourseBasicInfo>): Promise<CourseBasicInfo> => {
    const response = await apiClient.put<CourseBasicInfo>(
      `/courses/${courseId}`,
      courseData
    );
    return response.data;
  }
};
