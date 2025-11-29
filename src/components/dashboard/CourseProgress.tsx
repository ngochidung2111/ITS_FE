import { BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Course } from '../../utils/courses';
import type { Progress } from '../../utils/userProgress';
interface CourseProgressProps {
  course: Course;
  progress: Progress;
}
const CourseProgress = ({ course, progress }: CourseProgressProps) => {
  const formattedDate = new Date(progress.lastAccessed).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const formattedTime = new Date(progress.lastAccessed).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const totalLectures = course.curriculum.reduce((acc, section) => acc + section.lectures.length, 0);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden">
        <img 
          src={course.imageUrl} 
          alt={course.title} 
          className="w-full h-32 object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <span className="bg-teal-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {course.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <Link to={`/courses/${course.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            {course.title}
          </h3>
        </Link>
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-center justify-between text-sm text-teal-600 dark:text-teal-400 mb-1">
              <span>Progress</span>
              <span>{progress.overallProgress}%</span>
            </div>
            <div className="w-full bg-teal-200 dark:bg-teal-700/30 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full"
                style={{ width: `${progress.overallProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center text-sm text-teal-600 dark:text-teal-400">
            <BookOpen size={16} className="mr-1" />
            <span>{progress.completedLectures.length} / {totalLectures} lectures completed</span>
          </div>
          <div className="flex items-center text-sm text-teal-600 dark:text-teal-400">
            <Clock size={16} className="mr-1" />
            <span>Last accessed on {formattedDate} at {formattedTime}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link 
            to={`/courses/${course.id}`}
            className="flex-1 text-center py-2 text-sm font-medium border border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors">
            View Course
          </Link>
          <Link 
            to={getContinueLearningUrl(course, progress)}
            className="flex-1 text-center py-2 text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};
const getContinueLearningUrl = (course: Course, progress: Progress): string => {
  if (progress.completedLectures.length === 0) {
    return `/lecture/${course.id}/${course.curriculum[0].lectures[0].id}`;
  }
  const allLectureIds = course.curriculum.flatMap(section => 
    section.lectures.map(lecture => lecture.id)
  );
  const lastCompletedIndex = allLectureIds.findIndex(id => 
    id === progress.completedLectures[progress.completedLectures.length - 1]
  );
  if (lastCompletedIndex < allLectureIds.length - 1) {
    return `/lecture/${course.id}/${allLectureIds[lastCompletedIndex + 1]}`;
  }
  return `/courses/${course.id}`;
};
export default CourseProgress;