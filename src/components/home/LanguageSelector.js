"use client";
import React, { useState, useRef, useEffect } from "react";

const languages = [
  { icon: "/eng.svg", show: "English", value: "en" },
  { icon: "/italy.svg", show: "Italian", value: "it" },
  { icon: "/spain.svg", show: "Spanish", value: "es" },
  { icon: "/france.svg", show: "French", value: "fr" },
  { icon: "/germany.svg", show: "German", value: "de" },
  { icon: "/china.svg", show: "Chinese", value: "zh" },
  { icon: "/japan.svg", show: "Japanese", value: "ja" },
  { icon: "/portugal.svg", show: "Portuguese", value: "pt" },
  { icon: "/russia.svg", show: "Russian", value: "ru" },
  { icon: "/bangladesh.svg", show: "Bengali", value: "bn" },
  { icon: "/india.svg", show: "Hindi", value: "in" },
];

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[2]); // Default set to Spanish
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown when the button is clicked
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Function to handle language change
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setIsOpen(false);
    console.log(`Language changed to: ${lang.show} (${lang.value})`); // Logs to console
  };

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full sm:w-44 md:w-52 px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm bg-white hover:border-[#074C77] hover:shadow-md text-sm sm:text-base transition-all duration-200 group"
      >
        <img 
          src={selectedLanguage.icon} 
          alt="" 
          className="w-5 h-5 sm:w-6 sm:h-6 mr-2 rounded-sm" 
        />
        <span className="flex-grow text-left font-medium text-gray-700">{selectedLanguage.show}</span>
        <svg
          className={`w-4 h-4 ml-2 flex-shrink-0 text-gray-400 group-hover:text-[#074C77] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl w-full sm:w-52 max-h-72 overflow-y-auto animate-fade-in-up">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => handleLanguageChange(lang)}
              className={`flex items-center w-full px-4 py-3 hover:bg-gradient-to-r hover:from-[#074C77]/5 hover:to-[#0a6ba8]/5 text-sm sm:text-base transition-colors duration-150 ${
                selectedLanguage.value === lang.value ? 'bg-[#074C77]/5 border-l-2 border-[#074C77]' : ''
              }`}
            >
              <img 
                src={lang.icon} 
                alt={lang.show} 
                className="w-5 h-5 sm:w-6 sm:h-6 mr-3 rounded-sm" 
              />
              <span className={`text-left font-medium ${selectedLanguage.value === lang.value ? 'text-[#074C77]' : 'text-gray-700'}`}>{lang.show}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
