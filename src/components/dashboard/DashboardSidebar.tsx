
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, AlignCenterVertical as Certificate, MessageSquare, Settings, LogOut, X } from 'lucide-react';
import Logo from '../ui/Logo';
import { useState } from 'react';
interface SidebarLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}
interface DashboardSidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}
const DashboardSidebar = ({ isMobile, isOpen, onClose }: DashboardSidebarProps) => {
  const location = useLocation();
  const links: SidebarLink[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard size={20} />
    },
    {
      name: 'My Courses',
      href: '/dashboard/courses',
      icon: <BookOpen size={20} />
    },
    {
      name: 'Schedule',
      href: '/dashboard/schedule',
      icon: <Calendar size={20} />
    },
    {
      name: 'Certificates',
      href: '/dashboard/certificates',
      icon: <Certificate size={20} />
    },
    {
      name: 'Messages',
      href: '/dashboard/messages',
      icon: <MessageSquare size={20} />
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings size={20} />
    }
  ];
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/80 z-40"
          onClick={onClose}
        ></div>
      )}
      <div 
        className={`
          ${isMobile 
            ? `fixed inset-y-0 z-50 transition-transform transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'hidden lg:flex'
          }
          w-64 flex-col fixed inset-y-0
        `}
      >
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Sidebar header */}
          <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center">
              <Logo className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ITS</span>
            </Link>
            {isMobile && (
              <button 
                onClick={onClose}
                className="ml-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${isActive(link.href)
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/20 dark:text-amber-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                  onClick={isMobile ? onClose : undefined} >
                  <span className="mr-3 text-gray-500 dark:text-gray-400">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <img
              src="/images/saket.jpg"
              alt="Saket Kumar Sinha"
              className="h-10 w-10 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Saket Kumar Sinha</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">imsaket123@gmail.com</p>
              </div>
            </div>
            <button className="mt-4 w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default DashboardSidebar;
