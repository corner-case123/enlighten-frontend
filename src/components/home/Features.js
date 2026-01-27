"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FiMessageSquare, FiVideo, FiCheck, FiGlobe } from "react-icons/fi";
import { BsChatTextFill } from "react-icons/bs";
import VideoInFrame from "./VideoFrame";

const Features = () => {
  const [imgSrc, setImgSrc] = useState("/phone1.png");
  const [activeTab, setActiveTab] = useState("Chat");

  const tabs = [
    { name: "Chat", icon: <BsChatTextFill /> },
    { name: "Video", icon: <FiVideo /> },
    { name: "Correction", icon: <FiCheck /> },
    { name: "Translate", icon: <FiGlobe /> },
  ];

  return (
    <div className="text-white px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-900 to-gray-800 relative">
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-r from-[#074C77]/8 to-[#0a6ba8]/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 left-16 w-32 h-32 bg-gradient-to-r from-[#407023]/6 to-[#5a9e32]/6 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700/50 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-sm font-medium">Features</span>
          </div>
          
          <h2 className="section-heading max-w-2xl mx-auto text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Irma and Jane met on the 
            </span>
            <span className="bg-gradient-to-r from-[#074C77] via-[#0a6ba8] to-[#074C77] bg-clip-text text-transparent animate-shimmer">
              {" "}app Enlighten
            </span>
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              ...
            </span>
          </h2>
        </div>
        
        {/* Mobile tabs - visible only on small screens */}
        <div className="md:hidden mt-6 mb-8">
          <div className="flex justify-between overflow-x-auto py-2 px-2 gap-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-lg p-4">
            {tabs.map((tab, index) => (
              <div
                key={tab.name}
                className={`flex flex-col justify-between items-center cursor-pointer pb-1 min-w-[70px] transition-all duration-200 animate-fade-in-up ${
                  activeTab === tab.name ? "text-white" : "text-gray-400"
                }`}
                onClick={() => setActiveTab(tab.name)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`p-3 rounded-xl text-xl transition-all duration-200 ${
                    activeTab === tab.name
                      ? "bg-gradient-to-r from-[#074C77] to-[#0a6ba8] text-white shadow-lg shadow-[#074C77]/30"
                      : "bg-gray-700/60 text-gray-400 hover:bg-gray-600/60"
                  }`}
                >
                  {tab.icon}
                </div>
                <span
                  className={`mt-2 text-xs font-medium transition-colors duration-200 ${
                    activeTab === tab.name
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                >
                  {tab.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main content - flex column on mobile, row on desktop */}
        <div className="flex flex-col md:flex-row items-center mx-auto justify-center my-4 sm:my-6 md:my-10 gap-8 lg:gap-16">
          {/* Phone/Video display */}
          <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0 animate-slide-in-left">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-[#074C77]/20 to-[#0a6ba8]/20 rounded-[40px] blur-3xl pulse-glow"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-[#407023]/15 to-[#5a9e32]/15 rounded-[35px] blur-2xl animate-pulse"></div>
              {activeTab === "Chat" && 
                <Image 
                  src={imgSrc} 
                  width={456} 
                  height={700} 
                  alt="phone interface showing chat feature" 
                  className="max-w-[260px] sm:max-w-[300px] md:max-w-[350px] h-auto relative z-10 drop-shadow-2xl transition-all duration-300 hover:scale-105" 
                  priority
                  onError={() => {
                    console.log('Phone image failed to load:', imgSrc)
                    setImgSrc('/default-phone.png') // fallback image
                  }}
                />
              }
              {activeTab === "Video" && <VideoInFrame video={"/video.mp4"}/>}
              {activeTab === "Correction" && <VideoInFrame video={"/correction.mp4"}/>}
              {activeTab === "Translate" && <VideoInFrame video={"/translate.mp4"}/>}
            </div>
          </div>
          
          {/* Right side content */}
          <div className="w-full md:w-1/2 h-full px-0 sm:px-4 md:px-6 lg:px-10 animate-slide-in-right">
            {/* Desktop tabs - hidden on mobile */}
            <div className="hidden md:flex justify-center py-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl p-6 gap-4">
              {tabs.map((tab, index) => (
                <div
                  key={tab.name}
                  className={`flex flex-col justify-between items-center cursor-pointer pb-2 px-4 lg:px-6 rounded-xl transition-all duration-200 animate-fade-in-up ${
                    activeTab === tab.name ? "bg-gray-700/60" : "hover:bg-gray-700/40"
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`p-4 lg:p-5 rounded-2xl text-2xl lg:text-3xl font-extrabold transition-all duration-200 ${
                      activeTab === tab.name
                        ? "bg-gradient-to-r from-[#074C77] to-[#0a6ba8] text-white shadow-lg shadow-[#074C77]/30 scale-110"
                        : "bg-gray-700/60 text-gray-400 hover:bg-gray-600/60 hover:text-gray-300"
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <span
                    className={`mt-3 font-medium transition-colors duration-200 ${
                      activeTab === tab.name
                        ? "text-white font-bold"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {tab.name}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Description text */}
            <div className="mt-8 md:mt-12 lg:mt-16">
              <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-medium leading-relaxed sm:leading-relaxed md:leading-[1.6] tracking-tight text-center md:text-left text-gray-200">
                ...and use Enlighten's <span className="bg-gradient-to-r from-[#074C77] to-[#0a6ba8] bg-clip-text text-transparent font-semibold">intuitive interface</span> and support features to help you learn a language together! 
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6 items-center sm:items-start justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-gray-800/40 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/30">
                  <span className="w-2 h-2 bg-gradient-to-r from-[#407023] to-[#5a9e32] rounded-full animate-pulse"></span>
                  <span className="text-sm text-gray-300">Irma helps Jane with German</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/40 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/30">
                  <span className="w-2 h-2 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] rounded-full animate-pulse"></span>
                  <span className="text-sm text-gray-300">Jane helps Irma with English</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
