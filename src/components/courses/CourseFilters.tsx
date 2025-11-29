import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
interface CourseFiltersProps {
  categories: string[];
  levels: string[];
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}
export interface FilterState {
  category: string;
  level: string;
  priceRange: [number, number] | null;
  sort: string;
}
const CourseFilters = ({
  categories,
  levels,
  onFilterChange,
  onReset
}: CourseFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    level: '',
    priceRange: null,
    sort: 'popular'
  });
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  const resetFilters = () => {
    const resetState = {
      category: '',
      level: '',
      priceRange: null,
      sort: 'popular'
    };
    setFilters(resetState);
    onReset();
  };
  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <button
          className="flex items-center text-gray-700 dark:text-gray-200 font-medium md:hidden"
          onClick={toggleFilters}>
          <Filter size={18} className="mr-2" />
          Filters
          <ChevronDown size={18} className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className="hidden md:flex items-center space-x-2 text-gray-700 dark:text-gray-200 font-medium">
          <Filter size={18} />
          <span>Filters</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-[darkred] hover:underline flex items-center text-sm font-medium">
          <X size={16} className="mr-1" />
          Reset All
        </button>
      </div>

      <div className={`${isOpen || 'md:block hidden'} p-4`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Level
            </label>
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="select">
              <option value="">All Levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price
            </label>
            <select
              value={filters.priceRange ? `${filters.priceRange[0]}-${filters.priceRange[1]}` : ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  handleFilterChange('priceRange', null);
                } else {
                  const [min, max] = value.split('-').map(Number);
                  handleFilterChange('priceRange', [min, max]);
                }
              }}
              className="select">
              <option value="">All Prices</option>
              <option value="0-0">Free</option>
              <option value="0.01-20">Under $20</option>
              <option value="20-50">$20 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-999999">$100+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="select">
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CourseFilters;
