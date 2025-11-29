export interface Author {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
}
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  rating: number;
  comment: string;
  date: string;
}
export interface LectureItem {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  isFree: boolean;
}
export interface Section {
  id: string;
  title: string;
  lectures: LectureItem[];
}
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number | null;
  isFeatured: boolean;
  isPopular: boolean;
  enrolledStudents: number;
  rating: number;
  reviewCount: number;
  language: string;
  lastUpdated: string;
  authorId: string;
  curriculum: Section[];
  requirements: string[];
  objectives: string[];
  tags: string[];
  quizzes: Quiz[];
  reviews: Review[];
}
export const authors: Author[] = [
  {
    id: "a1",
    name: "Saket Kumar Sinha",
    role: "Lead Instructor & AI Expert",
    avatarUrl: "/images/saket.jpg",
    bio: "Saket is a renowned AI expert with over 10 years of teaching experience. He specializes in machine learning, deep learning, and natural language processing."
  },
  {
    id: "a2",
    name: "Santosh Kumar",
    role: "Web Development Instructor",
    avatarUrl: "/images/santosh.jpg",
    bio: "Santosh is a full-stack developer with expertise in React, Node.js, and modern web technologies. He has helped thousands of students launch their web development careers."
  },
  {
    id: "a3",
    name: "Ujjawal Singh",
    role: "UI/UX Design Expert",
    avatarUrl: "/images/ujjawal.png",
    bio: "Ujjawal is a seasoned designer with experience at top tech companies. His courses focus on practical design skills that help students create beautiful, user-friendly interfaces."
  },
  {
    id: "a4",
    name: "Sanskriti",
    role: "Data Science Instructor",
    avatarUrl: "/images/image8.png",
    bio: "Sanskriti is a data scientist with a background in statistics and machine learning. She specializes in teaching complex concepts in an easy-to-understand manner."
  }
];
const courses: Course[] = [
  {
    id: "c1",
    title: "Complete Python Bootcamp: From Zero to Hero",
    slug: "complete-python-bootcamp",
    description: "Learn Python like a professional! Start from the basics and go all the way to creating your own applications.",
    longDescription: "This comprehensive Python course will take you from beginner to advanced level. You'll learn the basics of Python, data structures, object-oriented programming, and how to build real-world applications. By the end of this course, you'll have a solid understanding of Python and be ready to tackle complex programming challenges.",
    imageUrl: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    category: "Programming",
    level: "Beginner",
    price: 59.99,
    isFeatured: true,
    isPopular: true,
    enrolledStudents: 12568,
    rating: 4.8,
    reviewCount: 2341,
    language: "English",
    lastUpdated: "2023-12-15",
    authorId: "a1",
    curriculum: [
      {
        id: "s1",
        title: "Introduction to Python",
        lectures: [
          {
            id: "l1",
            title: "Welcome to the Course",
            duration: "5:20",
            videoUrl: "https://example.com/video1",
            description: "An introduction to what you'll learn in this course.",
            isFree: true
          },
          {
            id: "l2",
            title: "Installing Python",
            duration: "12:45",
            videoUrl: "https://example.com/video2",
            description: "Step-by-step guide to installing Python on different operating systems.",
            isFree: true
          },
          {
            id: "l3",
            title: "Your First Python Program",
            duration: "18:30",
            videoUrl: "https://example.com/video3",
            description: "Write and run your first Python program.",
            isFree: false
          }
        ]
      },
      {
        id: "s2",
        title: "Python Basics",
        lectures: [
          {
            id: "l4",
            title: "Variables and Data Types",
            duration: "25:15",
            videoUrl: "https://example.com/video4",
            description: "Learn about different data types in Python and how to use variables.",
            isFree: false
          },
          {
            id: "l5",
            title: "Operators and Expressions",
            duration: "22:10",
            videoUrl: "https://example.com/video5",
            description: "Understanding operators and how to use them in expressions.",
            isFree: false
          }
        ]
      }
    ],
    requirements: [
      "No programming experience needed!",
      "Basic computer skills",
      "Desire to learn Python"
    ],
    objectives: [
      "Build 5 real-world Python applications",
      "Master Python fundamentals and advanced concepts",
      "Learn object-oriented programming",
      "Understand data structures and algorithms in Python"
    ],
    tags: ["Python", "Programming", "Beginner", "Web Development", "Data Science"],
    quizzes: [
      {
        id: "q1",
        title: "Python Basics Quiz",
        description: "Test your knowledge of Python basics.",
        questions: [
          {
            id: "qu1",
            text: "What is the correct way to create a variable in Python?",
            options: [
              "var x = 5",
              "x = 5",
              "int x = 5",
              "let x = 5"
            ],
            correctOptionIndex: 1
          },
          {
            id: "qu2",
            text: "Which of the following is NOT a data type in Python?",
            options: [
              "String",
              "Integer",
              "Boolean",
              "Character"
            ],
            correctOptionIndex: 3
          }
        ]
      }
    ],
    reviews: [
      {
        id: "r1",
        userId: "u1",
        userName: "Pritish Sahoo",
        userAvatarUrl: "/images/Pritish.png",
        rating: 5,
        comment: "This course is amazing! I went from knowing nothing about Python to building my own applications.",
        date: "2025-05-25"
      },
      {
        id: "r2",
        userId: "u2",
        userName: "Saptarshi Sarkar",
        userAvatarUrl: "/images/saptarshi.png",
        rating: 4,
        comment: "Great course with lots of practical examples. Helped me understand Python fundamentals clearly.",
        date: "2025-05-15"
      }
    ]
  },
  {
    id: "c2",
    title: "Modern React with Redux",
    slug: "modern-react-with-redux",
    description: "Master React v18 and Redux with React Router, Webpack, and Create-React-App.",
    longDescription: "This course will teach you how to build dynamic, responsive web applications with React and Redux. You'll learn about React components, hooks, state management with Redux, routing with React Router, and how to deploy your applications. Through hands-on projects, you'll gain practical experience that you can apply to real-world scenarios.",
    imageUrl: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg",
    category: "Web Development",
    level: "Intermediate",
    price: 79.99,
    isFeatured: true,
    isPopular: true,
    enrolledStudents: 8762,
    rating: 4.7,
    reviewCount: 1542,
    language: "English",
    lastUpdated: "2023-11-30",
    authorId: "a2",
    curriculum: [
      {
        id: "s1",
        title: "Getting Started with React",
        lectures: [
          {
            id: "l1",
            title: "Introduction to React",
            duration: "15:20",
            videoUrl: "https://example.com/video1",
            description: "Understanding what React is and why it's popular.",
            isFree: true
          },
          {
            id: "l2",
            title: "Setting Up Your Development Environment",
            duration: "20:45",
            videoUrl: "https://example.com/video2",
            description: "Installing Node.js, npm, and creating your first React app.",
            isFree: true
          }
        ]
      },
      {
        id: "s2",
        title: "React Fundamentals",
        lectures: [
          {
            id: "l3",
            title: "Components and Props",
            duration: "28:15",
            videoUrl: "https://example.com/video3",
            description: "Learn about React components and how to pass data with props.",
            isFree: false
          },
          {
            id: "l4",
            title: "State and Lifecycle",
            duration: "32:10",
            videoUrl: "https://example.com/video4",
            description: "Understanding state management and component lifecycle in React.",
            isFree: false
          }
        ]
      }
    ],
    requirements: [
      "Basic knowledge of JavaScript",
      "Understanding of HTML and CSS",
      "Node.js installed on your computer"
    ],
    objectives: [
      "Build powerful, fast, user-friendly web applications",
      "Master the fundamentals of React and Redux",
      "Learn to implement authentication in your applications",
      "Deploy your applications to production"
    ],
    tags: ["React", "Redux", "JavaScript", "Web Development", "Frontend"],
    quizzes: [
      {
        id: "q2",
        title: "React Basics Quiz",
        description: "Test your understanding of React fundamentals.",
        questions: [
          {
            id: "qu1",
            text: "What is JSX?",
            options: [
              "A JavaScript library",
              "A syntax extension for JavaScript",
              "A programming language",
              "A database"
            ],
            correctOptionIndex: 1
          },
          {
            id: "qu2",
            text: "What is the correct way to render a component in React?",
            options: [
              "<Component />",
              "Component()",
              "render(Component)",
              "new Component()"
            ],
            correctOptionIndex: 0
          }
        ]
      }
    ],
    reviews: [
      {
        id: "r1",
        userId: "u3",
        userName: "Raja Kumar Rana",
        userAvatarUrl: "/images/Raja.png",
        rating: 5,
        comment: "This course has been instrumental in helping me land my first job as a React developer!",
        date: "2024-12-12"
      },
      {
        id: "r2",
        userId: "u4",
        userName: "Nikhil Soni",
        userAvatarUrl: "/images/nikhil.png",
        rating: 4,
        comment: "Great explanation of Redux concepts. I finally understand how to manage state properly.",
        date: "2024-11-25"
      }
    ]
  },
  {
    id: "c3",
    title: "UI/UX Design Masterclass",
    slug: "ui-ux-design-masterclass",
    description: "Learn to design beautiful and functional user interfaces from scratch.",
    longDescription: "This comprehensive UI/UX design course will teach you everything you need to know to create stunning and user-friendly interfaces. From color theory to typography, from wireframing to prototyping, you'll learn the principles and tools used by professional designers. By the end of the course, you'll have a portfolio of projects that showcase your design skills.",
    imageUrl: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    category: "Design",
    level: "Beginner",
    price: 69.99,
    isFeatured: false,
    isPopular: true,
    enrolledStudents: 6543,
    rating: 4.6,
    reviewCount: 987,
    language: "English",
    lastUpdated: "2024-01-10",
    authorId: "a3",
    curriculum: [
      {
        id: "s1",
        title: "Introduction to UI/UX Design",
        lectures: [
          {
            id: "l1",
            title: "What is UI/UX Design?",
            duration: "10:20",
            videoUrl: "https://example.com/video1",
            description: "Understanding the difference between UI and UX design.",
            isFree: true
          },
          {
            id: "l2",
            title: "Design Thinking Process",
            duration: "18:45",
            videoUrl: "https://example.com/video2",
            description: "Learn about the design thinking methodology and how to apply it to your projects.",
            isFree: true
          }
        ]
      },
      {
        id: "s2",
        title: "Design Principles",
        lectures: [
          {
            id: "l3",
            title: "Color Theory",
            duration: "25:30",
            videoUrl: "https://example.com/video3",
            description: "Understanding color psychology and how to create effective color schemes.",
            isFree: false
          },
          {
            id: "l4",
            title: "Typography Fundamentals",
            duration: "22:15",
            videoUrl: "https://example.com/video4",
            description: "Learn how to choose and pair fonts for maximum readability and visual impact.",
            isFree: false
          }
        ]
      }
    ],
    requirements: [
      "No design experience required",
      "A computer with internet access",
      "Willingness to learn and practice"
    ],
    objectives: [
      "Create beautiful user interfaces from scratch",
      "Understand the principles of user experience design",
      "Master industry-standard design tools",
      "Build a professional design portfolio"
    ],
    tags: ["UI Design", "UX Design", "Figma", "Web Design", "Mobile Design"],
    quizzes: [
      {
        id: "q1",
        title: "Design Principles Quiz",
        description: "Test your knowledge of fundamental design principles.",
        questions: [
          {
            id: "qu1",
            text: "What does UI stand for?",
            options: [
              "User Interface",
              "User Interaction",
              "User Implementation",
              "User Innovation"
            ],
            correctOptionIndex: 0
          },
          {
            id: "qu2",
            text: "Which of the following is NOT a principle of good UX design?",
            options: [
              "Usability",
              "Accessibility",
              "Complexity",
              "Consistency"
            ],
            correctOptionIndex: 2
          }
        ]
      }
    ],
    reviews: [
      {
        id: "r1",
        userId: "u5",
        userName: "Saptarshi Sarkar",
        userAvatarUrl: "/images/saptarshi.png",
        rating: 5,
        comment: "This course transformed my approach to design. The instructor explains complex concepts in a simple way.",
        date: "2025-02-05"
      },
      {
        id: "r2",
        userId: "u6",
        userName: "Aditya Shrivastava",
        userAvatarUrl: "/images/aditya.jpg",
        rating: 4,
        comment: "Great introduction to UI/UX design. I feel confident applying these principles to my projects now.",
        date: "2025-01-18"
      }
    ]
  },
  {
    id: "c4",
    title: "Data Science and Machine Learning Bootcamp",
    slug: "data-science-machine-learning-bootcamp",
    description: "Learn data science, data analysis, machine learning, and Python with this comprehensive course.",
    longDescription: "This bootcamp covers everything you need to know to become a data scientist. You'll learn Python, data analysis with pandas, data visualization with matplotlib and seaborn, machine learning with scikit-learn, and deep learning with TensorFlow. Through hands-on projects and real-world datasets, you'll develop the skills needed to solve complex data problems.",
    imageUrl: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg",
    category: "Data Science",
    level: "Intermediate",
    price: 89.99,
    isFeatured: true,
    isPopular: false,
    enrolledStudents: 5421,
    rating: 4.9,
    reviewCount: 876,
    language: "English",
    lastUpdated: "2024-02-20",
    authorId: "a4",
    curriculum: [
      {
        id: "s1",
        title: "Python for Data Science",
        lectures: [
          {
            id: "l1",
            title: "Introduction to Python for Data Science",
            duration: "20:15",
            videoUrl: "https://example.com/video1",
            description: "Learn why Python is the most popular language for data science.",
            isFree: true
          },
          {
            id: "l2",
            title: "NumPy Fundamentals",
            duration: "30:45",
            videoUrl: "https://example.com/video2",
            description: "Master NumPy arrays and mathematical operations for data processing.",
            isFree: false
          }
        ]
      },
      {
        id: "s2",
        title: "Data Analysis with Pandas",
        lectures: [
          {
            id: "l3",
            title: "Introduction to Pandas",
            duration: "28:30",
            videoUrl: "https://example.com/video3",
            description: "Learn how to use pandas for data manipulation and analysis.",
            isFree: false
          },
          {
            id: "l4",
            title: "Data Cleaning and Preprocessing",
            duration: "35:15",
            videoUrl: "https://example.com/video4",
            description: "Master techniques for cleaning and preparing data for analysis.",
            isFree: false
          }
        ]
      }
    ],
    requirements: [
      "Basic knowledge of Python programming",
      "Understanding of basic statistics",
      "A computer with at least 8GB of RAM"
    ],
    objectives: [
      "Master the Python data science ecosystem",
      "Perform data analysis and visualization",
      "Build and evaluate machine learning models",
      "Apply deep learning to solve complex problems"
    ],
    tags: ["Data Science", "Machine Learning", "Python", "Deep Learning", "AI"],
    quizzes: [
      {
        id: "q1",
        title: "Python for Data Science Quiz",
        description: "Test your knowledge of Python libraries for data science.",
        questions: [
          {
            id: "qu1",
            text: "Which library is used for numerical computing in Python?",
            options: [
              "Pandas",
              "NumPy",
              "Matplotlib",
              "Scikit-learn"
            ],
            correctOptionIndex: 1
          },
          {
            id: "qu2",
            text: "What is the primary data structure in pandas?",
            options: [
              "Array",
              "List",
              "DataFrame",
              "Dictionary"
            ],
            correctOptionIndex: 2
          }
        ]
      }
    ],
    reviews: [
      {
        id: "r1",
        userId: "u7",
        userName: "Adiya Shrivastava",
        userAvatarUrl: "/images/aditya.png",
        rating: 5,
        comment: "This bootcamp helped me transition from a software developer to a data scientist. The content is excellent!",
        date: "2025-04-30"
      },
      {
        id: "r2",
        userId: "u8",
        userName: "Nikhil Soni",
        userAvatarUrl: "/images/nikhil.png",
        rating: 5,
        comment: "The instructor explains complex machine learning concepts in a very accessible way. Highly recommended!",
        date: "2025-02-15"
      }
    ]
  },
  {
    id: "c5",
    title: "iOS App Development with Swift",
    slug: "ios-app-development-swift",
    description: "Learn iOS app development using Swift 5 and Xcode. Build real-world iOS apps from scratch!",
    longDescription: "This course will teach you how to build beautiful iOS apps using Swift and Xcode. You'll start with the basics of Swift programming and gradually move to more advanced topics like Core Data, networking, and SwiftUI. By the end of the course, you'll have built several complete apps that you can add to your portfolio.",
    imageUrl: "https://images.pexels.com/photos/1181275/pexels-photo-1181275.jpeg",
    category: "Mobile Development",
    level: "Intermediate",
    price: 79.99,
    isFeatured: false,
    isPopular: false,
    enrolledStudents: 4321,
    rating: 4.7,
    reviewCount: 654,
    language: "English",
    lastUpdated: "2023-10-15",
    authorId: "a2",
    curriculum: [
      {
        id: "s1",
        title: "Introduction to Swift",
        lectures: [
          {
            id: "l1",
            title: "Getting Started with Swift",
            duration: "18:20",
            videoUrl: "https://example.com/video1",
            description: "Learn the basics of Swift programming language.",
            isFree: true
          },
          {
            id: "l2",
            title: "Swift Syntax and Data Types",
            duration: "25:45",
            videoUrl: "https://example.com/video2",
            description: "Understanding variables, constants, and basic data types in Swift.",
            isFree: false
          }
        ]
      },
      {
        id: "s2",
        title: "iOS App Development Fundamentals",
        lectures: [
          {
            id: "l3",
            title: "Introduction to Xcode",
            duration: "22:30",
            videoUrl: "https://example.com/video3",
            description: "Learn how to use Xcode, Apple's integrated development environment.",
            isFree: false
          },
          {
            id: "l4",
            title: "Building User Interfaces with UIKit",
            duration: "35:15",
            videoUrl: "https://example.com/video4",
            description: "Learn how to create user interfaces using UIKit components.",
            isFree: false
          }
        ]
      }
    ],
    requirements: [
      "Mac computer with macOS",
      "Basic programming knowledge",
      "No prior iOS development experience required"
    ],
    objectives: [
      "Master Swift programming language",
      "Build several complete iOS applications",
      "Understand iOS app architecture and design patterns",
      "Publish your app to the App Store"
    ],
    tags: ["iOS", "Swift", "Mobile Development", "Xcode", "App Development"],
    quizzes: [
      {
        id: "q1",
        title: "Swift Fundamentals Quiz",
        description: "Test your knowledge of Swift programming language.",
        questions: [
          {
            id: "qu1",
            text: "Which keyword is used to declare a constant in Swift?",
            options: [
              "var",
              "const",
              "let",
              "final"
            ],
            correctOptionIndex: 2
          },
          {
            id: "qu2",
            text: "What is the Swift equivalent of null?",
            options: [
              "nil",
              "null",
              "None",
              "undefined"
            ],
            correctOptionIndex: 0
          }
        ]
      }
    ],
    reviews: [
      {
        id: "r1",
        userId: "u9",
        userName: "Pritish Sahoo",
        userAvatarUrl: "/images/Pritish.png",
        rating: 5,
        comment: "This course is perfect for beginners. I was able to build my first iOS app within weeks!",
        date: "2025-04-10"
      },
      {
        id: "r2",
        userId: "u10",
        userName: "Raja Kumar Rana",
        userAvatarUrl: "/images/Raja.png",
        rating: 4,
        comment: "The instructor is very knowledgeable and explains concepts clearly. Great course overall.",
        date: "2025-02-20"
      }
    ]
  },
  {
    id: "c6",
    title: "Advanced JavaScript: From Fundamentals to Functional Programming",
    slug: "advanced-javascript-fundamentals-functional",
    description: "Take your JavaScript skills to the next level with advanced concepts and functional programming.",
    longDescription: "This course is designed for developers who want to deepen their understanding of JavaScript. You'll learn advanced concepts like closures, prototypes, and the event loop, as well as functional programming techniques. By the end of the course, you'll be able to write clean, efficient, and maintainable JavaScript code.",
    imageUrl: "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg",
    category: "Programming",
    level: "Advanced",
    price: 69.99,
    isFeatured: false,
    isPopular: false,
    enrolledStudents: 3876,
    rating: 4.8,
    reviewCount: 543,
    language: "English",
    lastUpdated: "2023-12-05",
    authorId: "a1",
    curriculum: [
      {
        id: "s1",
        title: "JavaScript Under the Hood",
        lectures: [
          {
            id: "l1",
            title: "Execution Context and Call Stack",
            duration: "28:20",
            videoUrl: "https://example.com/video1",
            description: "Understand how JavaScript executes your code behind the scenes.",
            isFree: true
          },
          {
            id: "l2",
            title: "Scope and Closures",
            duration: "32:45",
            videoUrl: "https://example.com/video2",
            description: "Master JavaScript closures and lexical scope.",
            isFree: false
          }
        ]
      },
      {
        id: "s2",
        title: "Functional Programming in JavaScript",
        lectures: [
          {
            id: "l3",
            title: "First-Class Functions",
            duration: "25:30",
            videoUrl: "https://example.com/video3",
            description: "Learn how to use functions as values in JavaScript.",
            isFree: false
          },
          {
            id: "l4",
            title: "Pure Functions and Immutability",
            duration: "30:15",
            videoUrl: "https://example.com/video4",
            description: "Understand the principles of pure functions and immutable data.",
            isFree: false
          }
        ]
      }
    ],
    requirements: [
      "Basic knowledge of JavaScript",
      "Understanding of HTML and CSS",
      "Familiarity with ES6 features"
    ],
    objectives: [
      "Master advanced JavaScript concepts",
      "Apply functional programming techniques",
      "Understand JavaScript design patterns",
      "Write clean, efficient, and maintainable code"
    ],
    tags: ["JavaScript", "Functional Programming", "Web Development", "ES6", "Programming"],
    quizzes: [
      {
        id: "q1",
        title: "Advanced JavaScript Quiz",
        description: "Test your knowledge of advanced JavaScript concepts.",
        questions: [
          {
            id: "qu1",
            text: "What is a closure in JavaScript?",
            options: [
              "A function that returns another function",
              "A function that has access to variables in its outer scope",
              "A design pattern",
              "A way to hide implementation details"
            ],
            correctOptionIndex: 1
          },
          {
            id: "qu2",
            text: "Which of the following is NOT a principle of functional programming?",
            options: [
              "Pure functions",
              "Immutability",
              "First-class functions",
              "Object mutation"
            ],
            correctOptionIndex: 3
          }
        ]
      }
    ],
    reviews: [
      {
        id: "r1",
        userId: "u11",
        userName: "Nikhil Soni",
        userAvatarUrl: "/images/nikhil.png",
        rating: 5,
        comment: "This course really helped me understand the intricacies of JavaScript. Highly recommended for serious developers.",
        date: "2025-01-15"
      },
      {
        id: "r2",
        userId: "u12",
        userName: "Saptarshi Sarkar",
        userAvatarUrl: "/images/saptarshi.png",
        rating: 4,
        comment: "Great explanations of complex topics. The functional programming section was particularly enlightening.",
        date: "2024-12-20"
      }
    ]
  }
];
export default courses;