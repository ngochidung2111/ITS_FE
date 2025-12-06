import { Link } from 'react-router-dom';

interface PublicCourseCardProps {
    course: {
        id: string;
        title: string;
        description: string;
        price: string;
    };
}

// Function to get course image based on title/topic
const getCourseImage = (title: string): string => {
    const lowerTitle = title.toLowerCase();

    // Programming/Development courses
    if (lowerTitle.includes('nestjs') || lowerTitle.includes('node') || lowerTitle.includes('backend') || lowerTitle.includes('javascript') || lowerTitle.includes('typescript')) {
        return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80';
    }

    // Physics courses
    if (lowerTitle.includes('physic')) {
        return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80';
    }

    // Math/Calculus courses
    if (lowerTitle.includes('calculus') || lowerTitle.includes('math') || lowerTitle.includes('algebra') || lowerTitle.includes('geometry')) {
        return 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=800&q=80';
    }

    // Science courses
    if (lowerTitle.includes('science') || lowerTitle.includes('chemistry') || lowerTitle.includes('biology')) {
        return 'https://images.pexels.com/photos/714699/pexels-photo-714699.jpeg?w=800';
    }

    // Business courses
    if (lowerTitle.includes('business') || lowerTitle.includes('marketing') || lowerTitle.includes('management')) {
        return 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=800';
    }

    // Design courses
    if (lowerTitle.includes('design') || lowerTitle.includes('ui') || lowerTitle.includes('ux')) {
        return 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=800';
    }

    // Default fallback image
    return 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=800';
};

const PublicCourseCard = ({ course }: PublicCourseCardProps) => {
    return (
        <Link
            to={`/courses/${course.id}`}
            className="card group h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        >
            {/* Course Image */}
            <div className="relative overflow-hidden">
                <img
                    src={getCourseImage(course.title)}
                    alt={course.title}
                    className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Course Content */}
            <div className="p-5 grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                    {course.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 grow text-sm">
                    {course.description}
                </p>

                {/* Price and Action */}
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                        <span className="font-bold text-gray-900 dark:text-white text-xl">
                            ${parseFloat(course.price).toFixed(2)}
                        </span>
                    </div>
                    <span className="btn btn-success text-sm py-2 px-4 hover:shadow-lg transition-shadow">
                        View Course
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default PublicCourseCard;
