"use client";
import Image from "next/image";
import React from "react";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const Banner = () => {
  const { t } = useLanguage();
  return (
    <div
      className="min-h-[500px] sm:min-h-[600px] md:min-h-[700px] max-w-[1440px] mx-auto flex items-center relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12"
      style={{ 
        background: 'linear-gradient(135deg, rgba(7, 76, 119, 0.1) 0%, rgba(64, 112, 35, 0.05) 100%)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-[#074C77]/20 to-[#0a6ba8]/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-r from-[#407023]/15 to-[#5a9e32]/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-[#074C77]/10 to-[#0a6ba8]/10 rounded-full blur-3xl animate-bounce-slow"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-[#074C77]/30 to-[#0a6ba8]/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center w-full mx-auto py-12 md:py-0 relative z-10">
        {/* Banner image - hidden on small screens, visible from medium screens */}
        <div className="hidden md:flex md:w-1/2 lg:w-5/12 justify-center items-center mb-8 md:mb-0">
          <div className="relative animate-slide-in-left">
            <div className="absolute -inset-6 bg-gradient-to-r from-[#074C77]/30 to-[#0a6ba8]/30 rounded-full blur-3xl pulse-glow opacity-60"></div>
            <div className="absolute -inset-4 bg-gradient-to-r from-[#407023]/20 to-[#5a9e32]/20 rounded-full blur-2xl animate-pulse"></div>
            <Image
              src="/banner.png"
              width={450}
              height={350}
              alt="Language learning illustration"
              className="w-full max-w-[350px] lg:max-w-[450px] h-auto relative z-10 drop-shadow-2xl animate-float"
              priority
              style={{ filter: 'drop-shadow(0 20px 40px rgba(7, 76, 119, 0.3))' }}
              onError={() => console.log('Banner image failed to load')}
            />
          </div>
        </div>

        {/* Banner content */}
        <div className="w-full md:w-1/2 lg:w-7/12 text-center md:text-left space-y-8 animate-slide-in-right">
          <div className="space-y-4">
            <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-tight md:leading-[1.1] font-bold">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Practice Languages with
              </span>
              <br className="hidden sm:inline" /> 
              <span className="bg-gradient-to-r from-[#074C77] via-[#0a6ba8] to-[#074C77] bg-clip-text text-transparent animate-shimmer">
                Native Speakers
              </span>
            </h3>
            
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
              <span className="inline-flex items-center gap-3 mb-2">
                <span className="w-3 h-3 bg-gradient-to-r from-[#407023] to-[#5a9e32] rounded-full animate-pulse"></span>
                <span className="text-[#5a9e32]">Join our mission to save nature!</span>
              </span>
              <br />
              We're dedicating <span className="text-[#074C77] font-bold text-2xl animate-pulse">10%</span> of our income to <span className="text-[#5a9e32] font-semibold">green initiatives</span>
            </p>
          </div>
          
          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mt-12 items-center sm:items-start justify-center md:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="order-2 sm:order-1">
              <LanguageSelector />
            </div>
            <Link href={"/learning"} className="w-full sm:w-auto order-1 sm:order-2">
              <button className="w-full sm:w-auto btn-primary text-base sm:text-lg py-4 px-10 group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Start Learning Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
          
          {/* Stats or features */}
          <div className="grid grid-cols-2 gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#074C77] to-[#0a6ba8] bg-clip-text text-transparent">10+</div>
              <div className="text-gray-400 text-sm">Languages</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#407023] to-[#5a9e32] bg-clip-text text-transparent">1000+</div>
              <div className="text-gray-400 text-sm">Native Speakers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
