"use client";
import React, { useState } from 'react';

const languages = [
  { icon: "/en.png", name: "English" },
  { icon: "/spain.png", name: "Spanish" },
  { icon: "/french.png", name: "French" },
  { icon: "/german.png", name: "German" },
  { icon: "/italian.png", name: "Italian" },
  { icon: "/portugal.png", name: "Portuguese" },
  { icon: "/russian.png", name: "Russian" },
  { icon: "/japan.png", name: "Japanese" },
  { icon: "/chinese.png", name: "Chinese" },
  { icon: "/korean.png", name: "Korean" },
  { icon: "/others.png", name: "Other" },
];

const LanguageGrid = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  return (
    <div className="text-center mt-16 sm:mt-20 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto bg-gradient-to-b from-gray-900 to-gray-800 py-16 relative">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-[#074C77]/15 to-[#0a6ba8]/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-16 w-24 h-24 bg-gradient-to-r from-[#407023]/10 to-[#5a9e32]/10 rounded-full blur-2xl animate-float"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700/50 mb-6">
          <div className="w-2 h-2 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] rounded-full animate-pulse"></div>
          <span className="text-gray-300 text-sm font-medium">Start Your Journey</span>
        </div>
        
        <h2 className="section-heading mb-3 text-3xl sm:text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
            I want to learn
          </span>
          <span className="bg-gradient-to-r from-[#074C77] via-[#0a6ba8] to-[#074C77] bg-clip-text text-transparent animate-shimmer">
            ...
          </span>
        </h2>
        
        <p className="section-subheading mb-10 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Choose from 10+ popular languages and start your journey today
        </p>
        
        <div className="flex justify-center flex-wrap gap-4 sm:gap-5 md:gap-6 mb-8">
          {languages.map((lang, index) => (
            <div
              key={index}
              onClick={() => setSelectedLanguage(lang.name)}
              className={`cursor-pointer p-4 sm:p-5 rounded-2xl transition-all duration-200 group animate-fade-in-up hover:scale-105
                ${selectedLanguage === lang.name 
                  ? 'bg-gradient-to-br from-[#074C77] to-[#0a6ba8] shadow-[0_0_30px_rgba(7,76,119,0.3)] scale-105 border border-[#074C77]/50' 
                  : 'bg-gray-800/60 backdrop-blur-sm hover:bg-gray-700/60 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-gray-700/50 hover:border-[#074C77]/30'
                }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img 
                src={lang.icon} 
                alt={lang.name}
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto transition-all duration-200 group-hover:scale-110 ${!selectedLanguage || selectedLanguage !== lang.name ? 'filter brightness-90 group-hover:brightness-110' : ''}`}
                onError={(e) => {
                  console.log(`Language icon not found: ${lang.icon}`)
                  e.target.src = '/others.png' // fallback image
                }}
              />
              <p className={`mt-2 sm:mt-3 text-sm sm:text-base font-medium transition-colors duration-200
                ${selectedLanguage === lang.name ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}
              >
                {lang.name}
              </p>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#074C77]/0 to-[#0a6ba8]/0 group-hover:from-[#074C77]/10 group-hover:to-[#0a6ba8]/10 transition-all duration-200 pointer-events-none"></div>
            </div>
          ))}
        </div>
        
        {selectedLanguage && (
          <div className="mt-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 py-4 px-8 rounded-full shadow-lg">
              <span className="w-2 h-2 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] rounded-full animate-pulse"></span>
              <p className="text-lg sm:text-xl text-white font-medium">
                Great choice! You selected <span className="bg-gradient-to-r from-[#074C77] to-[#0a6ba8] bg-clip-text text-transparent font-bold">{selectedLanguage}</span>
              </p>
              <svg className="w-5 h-5 text-[#5a9e32] animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageGrid;
