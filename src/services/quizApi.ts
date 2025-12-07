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

export interface Answer {
  content: string;
  isCorrect: boolean;
}

export interface Question {
  questionName: string;
  answers: Answer[];
}

export interface Quiz {
    title: string,
    timeLimit?: number,
    questions: Question[]
}

export const quizApi = {
  /**
   * Create quiz in course
   */
  createQuiz: async (courseId: string, quizData: Quiz) => {
    const response = await apiClient.post(
      `/courses/${courseId}/quizzes`, quizData
    );
    return response.data;
  },

  /**
   * Get quiz in course 
   */
  
};