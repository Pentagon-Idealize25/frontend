import React from 'react';

interface Filters {
  expertise: string[];
  experience: string[];
  consultationMode: string[];
}

interface FilterSidebarProps {
  onFilterChange: (filterType: string, value?: string, checked?: boolean) => void;
  filters: Filters;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, filters }) => {
  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    onFilterChange(filterType, value, checked);
  };

  return (
    <div className="w-full md:w-80 bg-white rounded-lg shadow-md p-6 h-fit">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Filter Lawyers</h3>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Area of Expertise</h4>
        <div className="space-y-2">
          {['Mental illness', 'Corporate Law', 'Family Law', 'Property Law', 'Contract Law'].map((area) => (
            <label key={area} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                checked={filters.expertise.includes(area)}
                onChange={(e) => handleFilterChange('expertise', area, e.target.checked)}
              />
              <span className="text-sm text-gray-600">{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Experience</h4>
        <div className="space-y-2">
          {['0-5 years', '6-10 years', '10+ years'].map((exp) => (
            <label key={exp} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                checked={filters.experience.includes(exp)}
                onChange={(e) => handleFilterChange('experience', exp, e.target.checked)}
              />
              <span className="text-sm text-gray-600">{exp}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Consultation Mode</h4>
        <div className="space-y-2">
          {['Online', 'In-person', 'Phone', 'Any'].map((mode) => (
            <label key={mode} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                checked={filters.consultationMode.includes(mode)}
                onChange={(e) => handleFilterChange('consultationMode', mode, e.target.checked)}
              />
              <span className="text-sm text-gray-600">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={() => onFilterChange('reset')}
        className="w-full bg-gray-800 text-white py-2 px-4 rounded font-medium hover:bg-gray-900 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
export type { Filters, FilterSidebarProps };