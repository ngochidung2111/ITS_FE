import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
const CallToAction = () => {
  const benefits = [
    'Access to 200+ premium courses',
    'Learn at your own pace, anywhere, anytime',
    'Expert instructors and industry professionals',
    'Hands-on projects and assignments',
    'Certificate upon completion',
    '30-day money-back guarantee'
  ];
  return (
    <section className="py-16 bg-gradient-to-r from-teal-600 to-amber-500 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Learning Journey Today</h2>
              <p className="text-white/90 text-lg mb-8">
                Join thousands of students who have already transformed their careers with ITS. Get unlimited access to our entire library of courses.
              </p>
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-white mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/courses" 
                  className="btn bg-white text-teal-700 hover:bg-white/90">
                  Browse Courses
                </Link>
                <Link 
                  to="/signup" 
                  className="btn bg-transparent border-2 border-white hover:bg-white/10">
                  Sign Up Free
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-8 dark:bg-gray-800 shadow-xl transform rotate-3 absolute inset-0"></div>
              <div className="bg-white rounded-lg p-8 dark:bg-gray-800 shadow-xl relative transform -rotate-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Premium Membership</h3>
                  <span className="badge badge-accent">Best Value</span>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">$19.99</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">/month</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    <span className="line-through">$29.99</span> <span className="text-green-600">33% off</span>
                  </p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Unlimited access to all courses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Downloadable resources</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Mobile and TV access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Certificate of completion</span>
                  </li>
                </ul>
                
                <button className="w-full btn btn-primary">
                  Get Started Now
                </button>
                
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
                  No credit card required. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CallToAction;
