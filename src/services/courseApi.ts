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

export interface Lesson {
  id: string;
  lessonName: string;
  order: number;
  courseId: string;
  contents?: {
    id: string;
    serial: number;
    contentName?: string;
    type: string;
    content?: string;
    url?: string;
  }[];
}

export interface Quiz {
  id: string;
  title: string;
  timeLimit: number;
  courseId: string;
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
      `/courses/${courseId}/lessons/${lessonId}/contents`
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
   * Get course instructor info
   */
  getCourseInstructor: async (courseId: string): Promise<CourseBasicInfo['instructor']> => {
    const response = await apiClient.get<CourseBasicInfo['instructor']>(
      `/courses/${courseId}/instructor`
    );
    return response.data;
  }
};
