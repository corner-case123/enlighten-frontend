import React from 'react';
import { FaStar } from 'react-icons/fa';

const reviews = [
  {
    name: "Francesca",
    review:
      "I love this app. Speaking to people who also want to learn a language is the best thing ever! I've made great friends already and it hasn't even been 24 hours. I love this app!",
  },
  {
    name: "Luca",
    review:
      "There is always a friendly language partner ready to strike up a conversation, and the staff are professional and helpful! I would recommend Tandem to anyone trying to practice a new language!",
  },
  {
    name: "Sakiko",
    review:
      "If you're truly serious about learning a different language this is the app for you!!! You will not regret it! This app makes it safe and fun for everyone to communicate and learn! I love this app!",
  },
  {
    name: "Alfonso",
    review:
      "Lots of nice people and it's fun and easy to use. It will translate what you say and you can use the speak function to learn how to say it. It does almost everything you need and more! 6 stars!",
  },
  {
    name: "Niamh",
    review:
      "This app is seriously the best! It's so crazy to meet people from the other side of the world! It's great for improving languages because you are talking to real people. 11/10 would recommend.",
  },
  {
    name: "Mikhail",
    review:
      "I feel privileged to have met sensational people through the app. You not only learn and develop another language, you also learn about cultures, popular sayings, and get tips.",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-r from-[#074C77]/8 to-[#0a6ba8]/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10">
        <div className="text-center mb-12 sm:mb-16 px-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700/50 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-sm font-medium">Reviews</span>
          </div>
          
          <h2 className="section-heading mb-4 text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              People love 
            </span>
            <span className="bg-gradient-to-r from-[#074C77] via-[#0a6ba8] to-[#074C77] bg-clip-text text-transparent animate-shimmer">
              Enlighten
            </span>
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              !
            </span>
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <div className="flex">
              {Array(5).fill().map((_, i) => (
                <FaStar key={i} className="text-amber-400 text-xl sm:text-2xl animate-bounce-slow" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <span className="text-gray-300 font-semibold text-lg">Over 100,000 5-star reviews!</span>
          </div>
        </div>
        
        <div className="max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 mx-auto">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="card-elevated bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 p-6 sm:p-8 group hover:bg-gray-700/60 hover:border-amber-400/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-center mb-5">
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <FaStar 
                      key={i} 
                      className="text-amber-400 text-2xl sm:text-3xl mx-0.5 group-hover:scale-110 transition-transform duration-200" 
                      style={{ transitionDelay: `${i * 30}ms` }} 
                    />
                  ))}
              </div>
              
              <p className="text-gray-300 italic mb-6 leading-relaxed text-center group-hover:text-white transition-colors duration-200">
                "{review.review}"
              </p>
              
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#074C77] to-[#0a6ba8] flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {review.name[0]}
                </div>
                <p className="font-semibold bg-gradient-to-r from-[#074C77] to-[#0a6ba8] bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-200 transition-all duration-200">
                  {review.name}
                </p>
              </div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/0 to-orange-400/0 group-hover:from-amber-400/5 group-hover:to-orange-400/5 transition-all duration-200 pointer-events-none"></div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gray-800/40 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/30">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Ready to add your review?</h3>
              <p className="text-gray-400">Join our community and experience the difference</p>
            </div>
            <button className="btn-primary py-3 px-8 hover:scale-105 transition-all duration-200 group">
              <span className="flex items-center gap-2">
                Join Community
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
