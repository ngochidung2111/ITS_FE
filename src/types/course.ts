export interface GetCourseDetailDto {
  id: string;
  title: string;
  description?: string;
  price: number;
  status: string;

  instructor: {
    id: string;
    name: string;
    email: string;
  };

  lessons: {
    id: string;
    lessonName: string;

    contents: {
      id: string;
      serial: number;
      contentName?: string;
      type: string;
      content?: string;
      url?: string;
    }[];
  }[];

  quizzes: {
    id: string;
    title: string;
    timeLimit: number;

    questions: {
      id: string;
      questionName: string;

      answers: {
        id: string;
        content: string;
        correct: boolean;
      }[];
    }[];
  }[];
}

export type ContentType = "text" | "video" | "audio" | "image";

export interface Content {
  order?: number;
  contentName: string;
  type: ContentType;
  text?: string;
}

export interface CreateLessonData {
  lessonName: string;
  order?: number;
  contents?: Content[];
}
