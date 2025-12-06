import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, BookOpen, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { isAuthenticated, user, logoutContext } = useAuth();
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };
  const navbarBgClass = isHomePage && !isScrolled
    ? 'bg-transparent'
    : 'bg-white dark:bg-gray-900 shadow-md';
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navbarBgClass}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <Logo />
              <span className={`ml-2 text-xl font-bold ${isHomePage && !isScrolled ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                ITS
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/courses" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isHomePage && !isScrolled ? 'text-white hover:bg-white/10' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                Courses
              </Link>
              {/* Dashboard Link (Chỉ hiện khi Đăng nhập) */}
              { isAuthenticated && (<Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isHomePage && !isScrolled ? 'text-white hover:bg-white/10' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                Dashboard
              </Link>)}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${isHomePage && !isScrolled ? 'text-white hover:bg-white/10' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                aria-label="Toggle dark mode">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {isAuthenticated ? (
                // ĐÃ ĐĂNG NHẬP: Hiển thị tên và nút Logout
                <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${isHomePage && !isScrolled ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        Hi, {displayName}
                    </span>
                    <button
                        onClick={logoutContext} 
                        className="py-2 px-4 rounded-md text-white bg-red-700 hover:bg-red-800 transition-colors text-sm">
                        Log Out
                    </button>
                </div>
              ) : (
                <>
              <Link
                to="/signin"
                className="btn btn-outline">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="py-2 px-4 rounded-md text-white bg-red-700 hover:bg-red-800 transition-colors">
                Sign Up
              </Link>
              </>)}
            </div>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full mr-2 ${isHomePage && !isScrolled ? 'text-white hover:bg-white/10' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              aria-label="Toggle dark mode">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md ${isHomePage && !isScrolled ? 'text-white hover:bg-white/10' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              aria-expanded={isOpen}
              aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white dark:bg-gray-900 shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/courses"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={closeMenu}>
            <div className="flex items-center">
              <BookOpen size={18} className="mr-2" />
              Courses
            </div>
          </Link>
          <Link
            to="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={closeMenu}>
            <div className="flex items-center">
              <User size={18} className="mr-2" />
              Dashboard
            </div>
          </Link>
          <div className="flex space-x-2 px-3 py-2">
            <Link
              to="/signin"
              className="flex-1 py-2 px-4 text-center rounded-md text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
              onClick={closeMenu}>
              Sign In
            </Link>
            <Link
              to="/signup"
              className="flex-1 py-2 px-4 text-center rounded-md text-white bg-red-700 hover:bg-red-800"
              onClick={closeMenu}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
