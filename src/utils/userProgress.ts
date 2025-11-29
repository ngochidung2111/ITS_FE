export interface Progress {
  courseId: string;
  completedLectures: string[];
  quizResults: {
    quizId: string;
    score: number;
    completed: boolean;
  }[];
  overallProgress: number;
  lastAccessed: string;
}
export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  userName: string;
  issueDate: string;
  imageUrl: string;
}
export interface UserData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  enrolledCourses: string[];
  progress: Progress[];
  certificates: Certificate[];
  joinDate: string;
}
const userData: UserData = {
  id: "u1",
  name: "Saket Kumar Sinha",
  email: "imsaket123@gmail.com",
  avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
  enrolledCourses: ["c1", "c2", "c4"],
  progress: [
    {
      courseId: "c1",
      completedLectures: ["l1", "l2", "l3"],
      quizResults: [
        {
          quizId: "q1",
          score: 90,
          completed: true
        }
      ],
      overallProgress: 25,
      lastAccessed: "2024-05-20T14:30:00Z"
    },
    {
      courseId: "c2",
      completedLectures: ["l1", "l2"],
      quizResults: [
        {
          quizId: "q1",
          score: 85,
          completed: true
        }
      ],
      overallProgress: 15,
      lastAccessed: "2024-05-19T10:15:00Z"
    },
    {
      courseId: "c4",
      completedLectures: ["l1"],
      quizResults: [],
      overallProgress: 5,
      lastAccessed: "2024-05-18T16:45:00Z"
    }
  ],
  certificates: [
    {
      id: "cert1",
      courseId: "c1",
      courseName: "Complete Python Bootcamp: From Zero to Hero",
      userName: "Saket Kumar Sinha",
      issueDate: "2024-03-15",
      imageUrl: "/certificates/python-certificate.jpg"
    }
  ],
  joinDate: "2024-01-10"
};
export default userData;