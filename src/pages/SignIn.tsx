import { useEffect } from 'react';
import AuthForm from '../components/auth/AuthForm';
import Logo from '../components/ui/Logo';

const SignIn = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Sign In | ITS';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <Logo className="h-12 w-12" />
        </div>
        <h1 className="mt-3 text-center text-3xl font-bold text-gray-900 dark:text-white">
          ITS
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to access your courses and continue learning
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <AuthForm type="signin" />
      </div>
    </div>
  );
};

export default SignIn;