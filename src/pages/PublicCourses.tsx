import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, AlertCircle, Filter } from 'lucide-react';
import PublicCourseCard from '../components/courses/PublicCourseCard';

//TODO: check the sign in method from other branches

interface ApiCourse {
    id: string;
    title: string;
    description: string;
    price: string;
}

const PublicCourses = () => {
    const [courses, setCourses] = useState<ApiCourse[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<ApiCourse[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [priceFilter, setPriceFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('default');

    useEffect(() => {
        document.title = 'Public Courses | ITS';
        window.scrollTo(0, 0);
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Get JWT token from localStorage
            // const token = localStorage.getItem('jwt_token');
            const token = localStorage.getItem('userToken') ?
                localStorage.getItem('userToken') :
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imluc3RydWN0b3IxQGV4YW1wbGUuY29tIiwiaWQiOiJmODMxYjY2MC1mNGIzLTQ0YzQtOWQwZC00NDUzYTRkOWIyMGUiLCJyb2xlIjoiaW5zdHJ1Y3RvciIsImlhdCI6MTc2NTAxMDI2NSwiZXhwIjoxNzY1MDk2NjY1fQ.x4uVG_12OghbIrhJQBL0Rfim7PzpVx9kn2OaVnao7BI"


            if (!token) {
                throw new Error('Authentication required. Please sign in to view courses.');
            }

            const response = await fetch('http://localhost:3000/courses', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Try to get error message from response body
                let errorMessage = `Failed to fetch courses (${response.status})`;

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    // If response is not JSON, use status text
                    errorMessage = `${response.status}: ${response.statusText}`;
                }

                // Handle specific status codes
                if (response.status === 401) {
                    errorMessage = 'Session expired. Please sign in again.';
                    localStorage.removeItem('jwt_token'); // Clear invalid token
                } else if (response.status === 403) {
                    errorMessage = 'Access denied. You do not have permission to view courses.';
                }

                throw new Error(errorMessage);
            }

            const data: ApiCourse[] = await response.json();
            setCourses(data);
            setFilteredCourses(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load courses');
            console.error('Error fetching courses:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [searchQuery, priceFilter, sortBy, courses]);

    const applyFilters = () => {
        let results = [...courses];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(course =>
                course.title.toLowerCase().includes(query) ||
                course.description.toLowerCase().includes(query)
            );
        }

        // Apply price filter
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(Number);
            results = results.filter(course => {
                const price = parseFloat(course.price);
                return price >= min && price <= max;
            });
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-high':
                results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'title-asc':
                results.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                results.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                // Keep original order
                break;
        }

        setFilteredCourses(results);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const resetFilters = () => {
        setSearchQuery('');
        setPriceFilter('');
        setSortBy('default');
        setFilteredCourses(courses);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Explore Our Courses
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Browse through our extensive collection of high-quality courses across various categories and skill levels
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search for courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-12 py-3"
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <button type="submit" className="absolute inset-y-0 right-0 btn btn-primary rounded-l-none">
                            Search
                        </button>
                    </form>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
                    <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 font-medium">
                            <Filter className="h-5 w-5" />
                            <span>Filters</span>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="text-red-600 hover:underline flex items-center text-sm font-medium"
                        >
                            Reset All
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price Range
                                </label>
                                <select
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value)}
                                    className="select"
                                >
                                    <option value="">All Prices</option>
                                    <option value="0-30">Under $30</option>
                                    <option value="30-50">$30 - $50</option>
                                    <option value="50-80">$50 - $80</option>
                                    <option value="80-999999">$80+</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="select"
                                >
                                    <option value="default">Default</option>
                                    <option value="title-asc">Title: A to Z</option>
                                    <option value="title-desc">Title: Z to A</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="mt-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-12 h-12 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Error Loading Courses
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={fetchCourses} className="btn btn-primary">
                                    Try Again
                                </button>
                                {(error.includes('Authentication') || error.includes('Session expired')) && (
                                    <Link to="/signin" className="btn btn-secondary">
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        <>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredCourses.map(course => (
                                    <PublicCourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                <BookOpen className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No courses found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                We couldn't find any courses that match your search and filters.
                            </p>
                            <button onClick={resetFilters} className="btn btn-primary">
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default PublicCourses;