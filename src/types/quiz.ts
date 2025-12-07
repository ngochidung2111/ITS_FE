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