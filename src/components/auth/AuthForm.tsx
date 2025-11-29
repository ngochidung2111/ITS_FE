import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
interface AuthFormProps {
  type: 'signin' | 'signup';
}
const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, name, rememberMe });
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        {type === 'signin' ? 'Sign in to your account' : 'Create a new account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'signup' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input pl-10"
                placeholder="John Doe"/>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-10"
              placeholder="you@example.com"/>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            {type === 'signin' && (
              <Link to="/forgot-password" className="text-sm font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400">
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={type === 'signin' ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10 pr-10"
              placeholder="••••••••"/>
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {type === 'signin' && (
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>
        )}

        <div>
          <button
            type="submit"
            className="btn btn-primary bg-pink-600 hover:bg-pink-500 text-white w-full flex items-center justify-center">
            {type === 'signin' ? 'Sign In' : 'Sign Up'}
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path
                d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                fill="#6b7280"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#6b7280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path
                d="M24 12.073c0-5.8-4.701-10.5-10.5-10.5s-10.5 4.7-10.5 10.5c0 5.242 3.837 9.58 8.852 10.367v-7.337h-2.663v-3.03h2.663V9.692c0-2.625 1.565-4.076 3.958-4.076 1.146 0 2.345.205 2.345.205v2.579h-1.32c-1.302 0-1.708.807-1.708 1.635v1.968h2.905l-.465 3.03h-2.44v7.337c5.015-.787 8.852-5.124 8.852-10.367z"/>
            </svg>
            Facebook
          </button>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {type === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
        <Link
          to={type === 'signin' ? '/signup' : '/signin'}
          className="font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400">
          {type === 'signin' ? 'Sign up now' : 'Sign in'}
        </Link>
      </p>
    </div>
  );
};
export default AuthForm;
