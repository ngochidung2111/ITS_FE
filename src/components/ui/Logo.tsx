import { BookOpen } from 'lucide-react';
interface LogoProps {
  className?: string;
}
const Logo = ({ className }: LogoProps) => {
  return (
    <div className={`bg-accent-600 p-1.5 rounded-md ${className}`}>
      <BookOpen className="h-5 w-5 text-white" />
    </div>
  );
};
export default Logo;