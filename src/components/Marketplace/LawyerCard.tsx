import React from 'react';
import Image from 'next/image';

interface Lawyer {
  _id: string;
  lId: string;
  barRegistration: number;
  lawyerName: string;
  lawyerAddress: string;
  yearsOfExperience: number;
  contact: string;
  email: string;
  currentLawFirm: string;
  areaOfExpertise: string[];
  languages: string[];
  servicesOffered: string[];
  consultationMode: string[];
  imageUrl?: string;
}

interface LawyerCardProps {
  lawyer: Lawyer;
}

const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="relative">
        <Image
          src={lawyer.imageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"}
          alt={lawyer.lawyerName}
          width={400}
          height={200}
          className="w-full h-50 object-cover"
          priority
        />
        <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-semibold">
          Bar: {lawyer.barRegistration}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{lawyer.lawyerName}</h3>
        <p className="text-sm text-gray-600 mb-2">{lawyer.currentLawFirm}</p>
        <p className="text-sm text-gray-500 mb-2">{lawyer.lawyerAddress}</p>
        
        <div className="mb-3">
          <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {lawyer.yearsOfExperience} years experience
          </span>
        </div>
        
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Specialization:</p>
          <div className="flex flex-wrap gap-1">
            {lawyer.areaOfExpertise.map((area, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {area}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Languages:</p>
          <p className="text-xs text-gray-700">{lawyer.languages.join(", ")}</p>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button className="flex-1 bg-gray-800 text-white py-2 px-3 rounded text-sm font-medium hover:bg-gray-900 transition-colors">
            Contact
          </button>
          <button className="flex-1 border border-gray-800 text-gray-800 py-2 px-3 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
            View Profile
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          <p>📞 {lawyer.contact}</p>
          <p>✉️ {lawyer.email}</p>
        </div>
      </div>
    </div>
  );
};

export default LawyerCard;
export type { Lawyer, LawyerCardProps };