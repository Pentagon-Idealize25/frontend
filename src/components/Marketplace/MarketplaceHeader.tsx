import React from 'react';
import Lottie from 'lottie-react';
import justiceBalanceAnimation from '../../../public/Justice balance law.json'; // Adjust the path as needed

const MarketplaceHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* Left side - Lottie Animation */}
          <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
            <Lottie
              animationData={justiceBalanceAnimation}
              loop
              className="w-80 h-auto drop-shadow-lg"
            />
          </div>

          {/* Right side - Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif tracking-tight leading-tight">
              <span className="text-white bg-gradient-to-r from-white to-gray-100 bg-clip-text drop-shadow-lg">
                We Make Legal Help Simple
              </span>
            </h1>
            <p className="text-lg mb-6 text-gray-100 font-light italic">
              Browse, Connect, and Book Lawyers Who Match Your Needs in Just a Few Clicks.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <button className="bg-white text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 font-medium">
                Find a Lawyer
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:scale-105 font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHeader;
