'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MarketplaceHeader from '../../components/Marketplace/MarketplaceHeader';
import FilterSidebar, { type Filters } from '../../components/Marketplace/FilterSidebar';
import LawyerGrid from '../../components/Marketplace/LawyerGrid';
import { type Lawyer } from '../../components/Marketplace/LawyerCard';
import CustomerNavbar from '../../components/CustomerHeader/customersidebar';

// Sample data

const sampleLawyers: Lawyer[] = [
  {
    _id: "687be98d4e710b8309221056",
    lId: "225508",
    barRegistration: 225508,
    lawyerName: "Tharundi Lavanya",
    lawyerAddress: "Angoda",
    yearsOfExperience: 6,
    contact: "0111042838",
    email: "lava@gmail.com",
    currentLawFirm: "TLM Law Associates",
    areaOfExpertise: ["Mental illness"],
    languages: ["French"],
    servicesOffered: ["All"],
    consultationMode: ["Any"],
    imageUrl: "/image.png"
  },
  {
    _id: "687be98d4e710b8309221057",
    lId: "225509",
    barRegistration: 225509,
    lawyerName: "Sahara Arunodya",
    lawyerAddress: "Colombo 03",
    yearsOfExperience: 8,
    contact: "0112345678",
    email: "sahara@lawfirm.com",
    currentLawFirm: "Legal Associates",
    areaOfExpertise: ["Corporate Law", "Contract Law"],
    languages: ["English", "Sinhala"],
    servicesOffered: ["Legal Consultation", "Document Review"],
    consultationMode: ["Online", "In-person"],
    imageUrl: "/profile2.jpg"
  },
  {
    _id: "687be98d4e710b8309221058",
    lId: "225510",
    barRegistration: 225510,
    lawyerName: "Priya Mendis",
    lawyerAddress: "Kandy",
    yearsOfExperience: 12,
    contact: "0812234567",
    email: "priya@mendislaw.com",
    currentLawFirm: "Mendis & Associates",
    areaOfExpertise: ["Family Law", "Property Law"],
    languages: ["English", "Sinhala", "Tamil"],
    servicesOffered: ["Divorce Proceedings", "Property Transfers"],
    consultationMode: ["In-person", "Phone"],
    imageUrl: "/image3.jpg"
  }
];

const MarketplacePage: React.FC = () => {
  // const [lawyers, setLawyers] = useState<Lawyer[]>(sampleLawyers);
  const lawyers = sampleLawyers
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>(sampleLawyers);
  const [filters, setFilters] = useState<Filters>({
    expertise: [],
    experience: [],
    consultationMode: []
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>(''); // NEW STATE for sorting


  const filterLawyers = useCallback(() => {
    const filtered = lawyers.filter(lawyer => {
      if (searchTerm && !lawyer.lawyerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !lawyer.areaOfExpertise.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }

      if (filters.expertise.length > 0) {
        if (!filters.expertise.some(exp => lawyer.areaOfExpertise.includes(exp))) {
          return false;
        }
      }

      if (filters.experience.length > 0) {
        const expMatch = filters.experience.some(exp => {
          if (exp === '0-5 years' && lawyer.yearsOfExperience <= 5) return true;
          if (exp === '6-10 years' && lawyer.yearsOfExperience >= 6 && lawyer.yearsOfExperience <= 10) return true;
          if (exp === '10+ years' && lawyer.yearsOfExperience > 10) return true;
          return false;
        });
        if (!expMatch) return false;
      }

      if (filters.consultationMode.length > 0) {
        if (!filters.consultationMode.some(mode => lawyer.consultationMode.includes(mode))) {
          return false;
        }
      }

      return true;
    });

    setFilteredLawyers(filtered);
  }, [filters, searchTerm, lawyers]);

  useEffect(() => {
    filterLawyers();
  }, [filterLawyers]);

  const handleFilterChange = (filterType: string, value?: string, checked?: boolean) => {
    if (filterType === 'reset') {
      setFilters({
        expertise: [],
        experience: [],
        consultationMode: []
      });
      return;
    }

    if (value !== undefined && checked !== undefined) {
      setFilters(prev => ({
        ...prev,
        [filterType]: checked
          ? [...prev[filterType as keyof Filters], value]
          : prev[filterType as keyof Filters].filter(item => item !== value)
      }));
    }
  };

  const sortedFilteredLawyers = useMemo(() => {
    const sorted = [...filteredLawyers];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.lawyerName.localeCompare(b.lawyerName));
      case 'experience':
        return sorted.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);

      case 'location':
        return sorted.sort((a, b) => a.lawyerAddress.localeCompare(b.lawyerAddress));
      default:
        return sorted;
    }
  }, [filteredLawyers, sortBy]);

  useEffect(() => {
    // Example API call placeholder
    // fetch('/api/lawyers')
    //   .then(response => response.json())
    //   .then(data => {
    //     setLawyers(data);
    //     setFilteredLawyers(data);
    //   })
    //   .catch(error => console.error('Error fetching lawyers:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar
        userName="John Smith"
        userProfileImage="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      />
      <MarketplaceHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search lawyers by name or expertise..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar onFilterChange={handleFilterChange} filters={filters} />

          <div className="flex-1">
            {/* Sorting Dropdown */}
            <div className="mb-6 flex justify-end">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort by...</option>
                <option value="experience">Sort by Experience</option>
                <option value="name">Sort by Name</option>
                <option value="location">Sort by Location</option>
              </select>
            </div>

            {/* Lawyer Grid */}
            <LawyerGrid lawyers={sortedFilteredLawyers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
