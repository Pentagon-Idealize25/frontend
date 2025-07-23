import React from 'react';

const MarketplaceHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side - Animated Lawyer */}
          <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
            <div className="relative">
              {/* Animated Lawyer SVG */}
              <div className="animate-bounce">
                <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-lg">
                  {/* Lawyer figure */}
                  <g className="animate-pulse">
                    {/* Body */}
                    <ellipse cx="150" cy="220" rx="40" ry="60" fill="#374151" className="animate-pulse" />
                    
                    {/* Head */}
                    <circle cx="150" cy="120" r="35" fill="#fbbf24" />
                    
                    {/* Hair */}
                    <path d="M115 100 Q150 85 185 100 Q185 90 150 85 Q115 90 115 100" fill="#1f2937" />
                    
                    {/* Eyes */}
                    <circle cx="140" cy="115" r="3" fill="#1f2937" />
                    <circle cx="160" cy="115" r="3" fill="#1f2937" />
                    
                    {/* Smile */}
                    <path d="M140 130 Q150 140 160 130" stroke="#1f2937" strokeWidth="2" fill="none" />
                    
                    {/* Arms */}
                    <ellipse cx="120" cy="180" rx="15" ry="35" fill="#fbbf24" transform="rotate(-20 120 180)" />
                    <ellipse cx="180" cy="180" rx="15" ry="35" fill="#fbbf24" transform="rotate(20 180 180)" />
                    
                    {/* Briefcase in right hand */}
                    <rect x="185" y="190" width="25" height="18" fill="#1f2937" rx="2" transform="rotate(20 197 199)" />
                    <rect x="187" y="188" width="21" height="3" fill="#6b7280" transform="rotate(20 197 189)" />
                    
                    {/* Legal documents in left hand */}
                    <rect x="95" y="185" width="15" height="20" fill="white" rx="1" transform="rotate(-20 102 195)" />
                    <line x1="97" y1="188" x2="110" y2="188" stroke="#1f2937" strokeWidth="1" transform="rotate(-20 102 195)" />
                    <line x1="97" y1="192" x2="110" y2="192" stroke="#1f2937" strokeWidth="1" transform="rotate(-20 102 195)" />
                    <line x1="97" y1="196" x2="110" y2="196" stroke="#1f2937" strokeWidth="1" transform="rotate(-20 102 195)" />
                    
                    {/* Legs */}
                    <ellipse cx="135" cy="270" rx="12" ry="25" fill="#1f2937" />
                    <ellipse cx="165" cy="270" rx="12" ry="25" fill="#1f2937" />
                    
                    {/* Shoes */}
                    <ellipse cx="135" cy="290" rx="18" ry="8" fill="#000000" />
                    <ellipse cx="165" cy="290" rx="18" ry="8" fill="#000000" />
                  </g>
                  
                  {/* Justice scales floating animation */}
                  <g className="animate-pulse" style={{animationDelay: '0.5s'}}>
                    <circle cx="80" cy="80" r="3" fill="#fbbf24" opacity="0.8">
                      <animate attributeName="cy" values="80;70;80" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="220" cy="80" r="3" fill="#fbbf24" opacity="0.8">
                      <animate attributeName="cy" values="80;70;80" dur="2s" repeatCount="indefinite" begin="1s" />
                    </circle>
                    <text x="75" y="85" fontSize="8" fill="white">⚖️</text>
                    <text x="215" y="85" fontSize="8" fill="white">📋</text>
                  </g>
                  
                  {/* Animated background circles */}
                  <circle cx="50" cy="150" r="20" fill="white" opacity="0.1" className="animate-ping" style={{animationDelay: '1s'}} />
                  <circle cx="250" cy="200" r="15" fill="white" opacity="0.1" className="animate-ping" style={{animationDelay: '2s'}} />
                </svg>
              </div>
              
              {/* Floating legal icons */}
              <div className="absolute top-10 left-10 animate-float" style={{animationDelay: '0.5s'}}>
                <div className="text-2xl animate-spin" style={{animationDuration: '3s'}}>⚖️</div>
              </div>
              <div className="absolute top-20 right-10 animate-float" style={{animationDelay: '1.5s'}}>
                <div className="text-xl animate-bounce">📚</div>
              </div>
              <div className="absolute bottom-10 left-20 animate-float" style={{animationDelay: '1s'}}>
                <div className="text-lg animate-pulse">🏛️</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
           <h1 className="text-5xl md:text-5xl font-bold mb-4 font-serif tracking-tight leading-tight whitespace-nowrap">
  <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent drop-shadow-lg">
    We Make Legal Help Simple
  </span>
</h1>

           
            <p className="text-lg mb-6 text-gray-100 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              Browse, Connect, and Book Lawyers Who Match Your Needs in Just a Few Clicks.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                Find a Lawyer
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MarketplaceHeader;