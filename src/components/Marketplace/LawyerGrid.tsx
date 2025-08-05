import React from 'react';
import LawyerCard, { type Lawyer } from './LawyerCard';

interface LawyerGridProps {
  lawyers: Lawyer[];
}

const LawyerGrid: React.FC<LawyerGridProps> = ({ lawyers }) => {
  return (
    <div className="flex-1">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Available Lawyers ({lawyers.length})
        </h2>
        
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {lawyers.map((lawyer) => (
          <LawyerCard key={lawyer._id} lawyer={lawyer} />
        ))}
      </div>
      
      {lawyers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⚖️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No lawyers found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default LawyerGrid;
export type { LawyerGridProps };