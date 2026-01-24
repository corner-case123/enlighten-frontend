"use client";
import React, { useState } from "react";
import SpeechRecognition from "@/components/learning/SpeechRecognition";
import AIChatbot from "@/components/learning/AIChatbot";
import GrammarCorrection from "@/components/learning/GrammarCorrection";
import WeirdLearning from "@/components/learning/WeirdLearning";

const LearningPage = () => {
  const [activeTab, setActiveTab] = useState("pronunciation");

  const tabs = [
    {
      id: "pronunciation",
      label: "Talk To Enlighten",
      description: "Have real conversations with AI tutors.",
      icon: "🗣️"
    },
    {
      id: "conversation",
      label: "Translate Your Thoughts",
      description: "Translate your thoughts into different languages.",
      icon: "🌐"
    },
    {
      id: "grammar",
      label: "Grammar Correction",
      description: "Correct your grammar mistakes.",
      icon: "✏️"
    },
    {
      id: "weird-learning",
      label: "Weird Learning",
      description: "Multiple choice translation quiz - find the correct answer!",
      icon: "🎯"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-[#074C77]/15 to-[#0a6ba8]/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-r from-[#407023]/10 to-[#5a9e32]/10 rounded-full blur-2xl animate-float"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700/50 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-sm font-medium">Learning Hub</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Learning 
            </span>
            <span className="bg-gradient-to-r from-[#074C77] via-[#0a6ba8] to-[#074C77] bg-clip-text text-transparent animate-shimmer">
              Resources
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Master languages with our AI-powered tools and interactive learning experiences
          </p>
        </div>

        {/* Tabs */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`card-elevated p-6 text-left transition-all duration-200 group animate-fade-in-up ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#074C77] to-[#0a6ba8] border-[#074C77]/50 shadow-[0_0_30px_rgba(7,76,119,0.3)] scale-105"
                  : "bg-gray-800/60 hover:bg-gray-700/60 border-gray-700/50 hover:border-[#074C77]/30 hover:scale-105"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`text-2xl p-2 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "bg-white/20" 
                    : "bg-gray-700/50 group-hover:bg-gray-600/50"
                }`}>
                  {tab.icon}
                </div>
                <h3 className={`font-bold text-lg transition-colors duration-200 ${
                  activeTab === tab.id ? "text-white" : "text-gray-200 group-hover:text-white"
                }`}>
                  {tab.label}
                </h3>
              </div>
              <p className={`text-sm transition-colors duration-200 ${
                activeTab === tab.id ? "text-gray-100" : "text-gray-400 group-hover:text-gray-300"
              }`}>
                {tab.description}
              </p>
              
              {/* Active indicator */}
              <div className={`mt-4 h-1 bg-gradient-to-r from-white to-gray-200 rounded-full transition-all duration-200 ${
                activeTab === tab.id ? "opacity-100" : "opacity-0"
              }`}></div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {activeTab === "pronunciation" && <SpeechRecognition />}
          {activeTab === "conversation" && <AIChatbot />}
          {activeTab === "grammar" && <GrammarCorrection />}
          {activeTab === "weird-learning" && <WeirdLearning />}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
