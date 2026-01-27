"use client";
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      title: "1. Join the community",
      description:
        "Download the app and register – it’s free! We review each application individually to ensure the Enlighten’s community remains a safe and welcoming place for our users.",
      imgSrc: "/phone2.png",
    },
    {
      title: "2. Find your partner",
      description:
        "Immediately after registration, we will help you to find suitable interlocutors, partners. Use filters by language, location, interests and other parameters.",
      imgSrc: "/phone3.png",
    },
    {
      title: "3. Start communicating!",
      description:
        "Use message correction and translation functions right in the application.",
      imgSrc: "/phone4.png",
    },
  ];

  return (
    <div className="flex flex-col items-center py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full mt-16 sm:mt-20 md:mt-24 relative overflow-hidden">
      {/* Enhanced decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-[#074C77]/15 to-[#0a6ba8]/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-[#407023]/10 to-[#5a9e32]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-600/8 to-pink-600/8 rounded-full blur-2xl animate-bounce-slow"></div>
      
      <div className="text-center mb-12 sm:mb-16 relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700/50 mb-6">
          <div className="w-2 h-2 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] rounded-full animate-pulse"></div>
          <span className="text-gray-300 text-sm font-medium">Getting Started</span>
        </div>
        
        <h2 className="section-heading text-3xl sm:text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
            How does 
          </span>
          <span className="bg-gradient-to-r from-[#074C77] via-[#0a6ba8] to-[#074C77] bg-clip-text text-transparent animate-shimmer">
            Enlighten 
          </span>
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
            work?
          </span>
        </h2>
      </div>

      <div className="max-w-[1200px] mx-auto w-full relative z-10">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between w-full max-w-5xl mx-auto mb-16 sm:mb-20 md:mb-24 last:mb-0 px-4 sm:px-6 animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Phone Image */}
            <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-r from-[#074C77]/20 to-[#0a6ba8]/20 rounded-[40px] blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 pulse-glow"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-[#407023]/15 to-[#5a9e32]/15 rounded-[35px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img 
                  src={step.imgSrc} 
                  alt={`Step ${index + 1} - ${step.title.split('. ')[1]}`} 
                  className="max-w-[220px] sm:max-w-[260px] md:max-w-[300px] h-auto relative z-10 drop-shadow-2xl transition-all duration-300 group-hover:scale-105 filter brightness-90 group-hover:brightness-100" 
                  onError={(e) => {
                    console.log(`Step image not found: ${step.imgSrc}`)
                    e.target.src = '/default-phone.png' // fallback image
                  }}
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="md:px-6 lg:px-12 w-full md:w-1/2 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] text-white text-xl font-bold rounded-2xl mb-6 shadow-lg shadow-[#074C77]/30 hover:scale-110 transition-transform duration-200 animate-bounce-slow">
                {index + 1}
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {step.title.split('. ')[1]}
              </h3>
              
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
                {step.description}
              </p>
              
              {/* Progress indicator */}
              <div className="flex items-center gap-2">
                {steps.map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      i === index 
                        ? 'bg-gradient-to-r from-[#074C77] to-[#0a6ba8] w-8' 
                        : 'bg-gray-600'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Call to action */}
      <div className="text-center mt-16 relative z-10 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
        <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gray-800/40 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/30">
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-white mb-2">Ready to start your journey?</h3>
            <p className="text-gray-400">Join thousands of language learners worldwide</p>
          </div>
          <button className="btn-primary py-3 px-8 hover:scale-105 transition-all duration-200 group">
            <span className="flex items-center gap-2">
              Get Started
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
