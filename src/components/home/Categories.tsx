import { BookOpen, Code, PenTool, Database, Smartphone, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  courseCount: number;
  color: string;
}
const Categories = () => {
  const categories: Category[] = [
    {
      id: 'programming',
      name: 'Programming',
      icon: <Code />,
      courseCount: 42,
      color: 'bg-blue-500'
    },
    {
      id: 'web-development',
      name: 'Web Development',
      icon: <BookOpen />,
      courseCount: 65,
      color: 'bg-purple-500'
    },
    {
      id: 'design',
      name: 'Design',
      icon: <PenTool />,
      courseCount: 28,
      color: 'bg-pink-500'
    },
    {
      id: 'data-science',
      name: 'Data Science',
      icon: <Database />,
      courseCount: 36,
      color: 'bg-green-500'
    },
    {
      id: 'mobile-development',
      name: 'Mobile Development',
      icon: <Smartphone />,
      courseCount: 24,
      color: 'bg-orange-500'
    },
    {
      id: 'artificial-intelligence',
      name: 'Artificial Intelligence',
      icon: <BrainCircuit />,
      courseCount: 18,
      color: 'bg-red-500'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explore Categories</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse through our diverse range of courses across various fields and disciplines
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/courses?category=${category.id}`}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1 text-center h-full flex flex-col items-center justify-center">
                <div className={`${category.color} text-white p-3 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.courseCount} courses
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Categories;