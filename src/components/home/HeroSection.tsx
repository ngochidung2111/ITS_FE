import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-400/80 z-10" />
        <img
          src="https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Students learning"
          className="h-full w-full object-cover"/>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col justify-center h-screen">
        <div className="max-w-3xl">
          <h1
            className={`text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 transition-all duration-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            Transform Your Learning Journey with ITS
          </h1>
          <p
            className={`text-gray-100 text-xl md:text-2xl mb-8 transition-all duration-700 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            Access quality courses taught by industry experts. Develop new skills and advance your career with our engaging learning platform.
          </p>
          <div
            className={`bg-white dark:bg-gray-800 rounded-lg p-2 flex items-center mb-8 shadow-lg transition-all duration-700 delay-500 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <Search className="text-orange-600 dark:text-amber-400 ml-2" size={20} />
            <input
              type="text"
              placeholder="What do you want to learn today?"
              className="flex-1 px-4 py-2 focus:outline-none bg-transparent dark:text-white"/>
            <button className="btn bg-orange-600 hover:bg-orange-700 text-white ml-2">
              Search
            </button>
          </div>
          <div
            className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 transition-all duration-700 delay-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <Link to="/courses" className="btn bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center">
              Browse Courses
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              to="/signup"
              className="btn btn-outline border-orange-400 text-orange-400 hover:bg-orange-400/20 bg-transparent">
              Sign Up Free
            </Link>
          </div>
          <div
            className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 delay-900 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">50+</p>
              <p className="text-orange-200">Expert Instructors</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">200+</p>
              <p className="text-orange-200">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">50K+</p>
              <p className="text-orange-200">Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">4.8</p>
              <p className="text-orange-200">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none transform translate-y-1">
        <svg
          className="relative block w-full h-24 md:h-32"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,94.17,208.35,82.73A826.23,826.23,0,0,0,321.39,56.44Z"
            fill="#f9fafb"
            className="dark:fill-gray-900"
          ></path>
        </svg>
      </div>
    </div>
  );
};
export default HeroSection;
