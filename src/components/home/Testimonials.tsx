import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import testimonials from '../../utils/testimonials';
const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const goToNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  };
  const goToPrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  };
  useEffect(() => {
    const interval = setInterval(goToNextSlide, 8000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeIndex]);
  return (
    <section className="py-16 bg-accent-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Students Say</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from our students about how ITS has helped them achieve their learning goals
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <button
            onClick={goToPrevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={isAnimating}
            aria-label="Previous testimonial">
            <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
          
          <button
            onClick={goToNextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={isAnimating}
            aria-label="Next testimonial">
            <ChevronRight size={24} className="text-gray-700 dark:text-gray-300" />
          </button>

          <div className="overflow-hidden rounded-xl shadow-lg">
            <div 
              className="transition-all duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)`, display: 'flex' }}>
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className="flex-shrink-0 w-full p-8 bg-white dark:bg-gray-800">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="md:w-1/4 flex flex-col items-center">
                      <img 
                        src={testimonial.avatarUrl} 
                        alt={testimonial.name} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-accent-200 dark:border-accent-900"/>
                      <div className="mt-4 text-center">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{testimonial.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm">{testimonial.company}</p>
                        <div className="flex items-center justify-center mt-2">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={`${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-3/4">
                      <div className="relative">
                        <svg className="absolute -top-2 -left-2 w-10 h-10 text-accent-200 dark:text-accent-800" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <p className="relative text-lg text-gray-600 dark:text-gray-300 mt-6 italic">
                          {testimonial.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setActiveIndex(index);
                  }
                }}
                className={`w-3 h-3 rounded-full ${
                  activeIndex === index 
                    ? 'bg-accent-600' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                } transition-colors duration-200`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Testimonials;