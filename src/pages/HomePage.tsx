import { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedCourses from '../components/home/FeaturedCourses';
import Categories from '../components/home/Categories';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';

const HomePage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Update document title
    document.title = 'ITS';
  }, []);

  return (
    <div>
      <HeroSection />
      <FeaturedCourses />
      <Categories />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default HomePage;