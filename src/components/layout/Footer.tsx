import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import Logo from '../ui/Logo';
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Logo className="h-10 w-10" />
              <span className="ml-3 text-2xl font-bold">ITS</span>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              ITS is a modern learning platform offering high-quality, industry-relevant courses to help you
              stay ahead in the tech world. Whether you're a beginner or a pro, our content is crafted to boost your
              skills and confidence.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="text-gray-400 hover:text-white">All Courses</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Pricing</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-gray-400 hover:text-white">Programming</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Web Development</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Design</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Data Science</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Mobile Development</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-400" />
                <a href="mailto:info@saketlearnhub.com" className="text-gray-400 hover:text-white">imsaket123@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-gray-400" />
                <a href="tel:+91-916-208-7327" className="text-gray-400 hover:text-white">+91-916-208-7327</a>
              </li>
            </ul>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="bg-white rounded-full p-2 hover:bg-blue-600 transition-colors">
                <Facebook className="text-blue-600 hover:text-white" size={20} />
              </a>
              <a href="#" className="bg-white rounded-full p-2 hover:bg-black transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="text-black hover:text-white"
                  width="20"
                  height="20">
                  <path d="M20.25 3H16.8L12 9.15 7.2 3H3.75L10.5 12.015 3.6 21H7.05L12 14.385 16.95 21H20.4L13.5 12.015 20.25 3Z" />
                </svg>
              </a>
              <a href="#" className="bg-white rounded-full p-2 hover:bg-pink-500 transition-colors">
                <Instagram className="text-pink-500 hover:text-white" size={20} />
              </a>
              <a href="#" className="bg-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                <Linkedin className="text-blue-700 hover:text-white" size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} ITS. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <Link to="#" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              <Link to="#" className="text-gray-400 hover:text-white">Terms of Service</Link>
              <Link to="#" className="text-gray-400 hover:text-white">Cookie Policy</Link>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">Built with ❤️ by Saket Kumar Sinha</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
