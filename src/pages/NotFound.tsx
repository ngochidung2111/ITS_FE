import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-12 px-4">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-500">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mt-4">Page not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn btn-primary inline-flex items-center">
            <Home size={18} className="mr-2" />
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="btn btn-outline inline-flex items-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;