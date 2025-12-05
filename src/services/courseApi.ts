import axios from 'axios';
import { type GetCourseDetailDto } from '../types/course';

const API_BASE_URL = 'https://674eb152bb559617b26c411d.mockapi.io/api/v1';

export const courseApi = {
  getCourseDetail: async (courseId: string): Promise<GetCourseDetailDto> => {
    const response = await axios.get<GetCourseDetailDto>(
      `${API_BASE_URL}/course/${courseId}`
    );
    return response.data;
  }
};
