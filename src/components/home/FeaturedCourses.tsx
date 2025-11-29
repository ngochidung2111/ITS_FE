import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import courses from '../../utils/courses';
import { type Course } from '../../utils/courses';
const FeaturedCourses = () => {
  const [visibleCourses, setVisibleCourses] = useState<Course[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  useEffect(() => {
    const featuredCourses = courses.filter(course => course.isFeatured);
    setVisibleCourses(featuredCourses);
  }, []);
  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => {
        slider.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, [visibleCourses]);
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Courses</h2>
            <p className="text-gray-600 dark:text-gray-400">Handpicked courses curated by our experts</p>
          </div>
          <Link to="/courses" className="btn btn-outline">
            View All
          </Link>
        </div>

        <div className="relative">
          <button 
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-100 dark:hover:bg-orange-700'}`}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left">
            <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>

          <div 
            ref={sliderRef}
            className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {visibleCourses.map(course => (
              <div key={course.id} className="flex-shrink-0 w-full sm:w-[340px]">
                <div className="card group h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title} 
                      className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"/>
                    <div className="absolute top-3 left-3">
                      <span className="badge badge-[orange] bg-orange-500 text-white">
                        {course.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-[orange] bg-orange-400 text-white">
                        {course.level}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm mb-1">
                      <div className="flex items-center">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={`${i < Math.floor(course.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} 
                          />
                        ))}
                      </div>
                      <span className="ml-1">{course.rating.toFixed(1)}</span>
                      <span className="ml-1">({course.reviewCount})</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {course.enrolledStudents.toLocaleString()} students enrolled
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                      </div>
                      <Link to={`/courses/${course.id}`} className="btn bg-orange-600 text-white hover:bg-orange-700 text-sm py-1.5">
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-100 dark:hover:bg-orange-700'}`}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right">
            <ChevronRight size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default FeaturedCourses;
