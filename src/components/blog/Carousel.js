"use client";

// Import Swiper React components and styles
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import Swiper styles
import 'swiper/swiper-bundle.css';

// Import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Custom styles
const slideStyle = {
  height: '600px', // Increased the height from 400px to 600px
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
};

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)', // 30% opacity
  zIndex: 1,
};

const contentStyle = {
  position: 'relative',
  zIndex: 2, // Ensures the content appears above the overlay
  color: 'white', // Example: text color
};

const buttonStyle = {
  width: '30px', // Smaller width
  height: '30px', // Smaller height
  fontSize: '12px', // Smaller text inside button
};

const slides = [
  {
    id: 1,
    backgroundImage: 'url("https://res.cloudinary.com/dh20zdtys/image/upload/v1724361462/1_k1ffwn.webp")',
  },
  {
    id: 2,
    backgroundImage: 'url("https://res.cloudinary.com/dh20zdtys/image/upload/v1724361461/4_lm1tal.webp")',
  },
  {
    id: 3,
    backgroundImage: 'url("https://res.cloudinary.com/dh20zdtys/image/upload/v1724361461/3_vujcna.jpg")',
  },
];

const Carousel = () => {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#074C77]/5 to-[#407023]/5"></div>
      
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        style={{ height: '450px' }}
        className="glass-carousel"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} style={{ ...slideStyle, backgroundImage: slide.backgroundImage }}>
            {/* Enhanced Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-gray-900/60 z-10"></div>
            
            {/* Content */}
            <div style={contentStyle} className="flex items-center justify-center h-full">
              <div className="text-center px-8">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 gradient-text-light">
                  Discover Stories
                </h2>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                  Explore insightful articles about language, culture, and global awareness
                </p>
                <div className="flex items-center justify-center gap-2 text-[#5a9e32] font-medium">
                  <span className="w-3 h-3 bg-[#5a9e32] rounded-full animate-pulse"></span>
                  Empowering communities through knowledge
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <style jsx global>{`
          .glass-carousel .swiper-button-next, 
          .glass-carousel .swiper-button-prev {
            width: 50px;
            height: 50px;
            background: rgba(7, 76, 119, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(7, 76, 119, 0.3);
            border-radius: 50%;
            color: #074C77;
            transition: all 0.3s ease;
          }

          .glass-carousel .swiper-button-next:hover,
          .glass-carousel .swiper-button-prev:hover {
            background: rgba(7, 76, 119, 0.4);
            transform: scale(1.1);
            box-shadow: 0 10px 25px rgba(7, 76, 119, 0.3);
          }

          .glass-carousel .swiper-button-next::after, 
          .glass-carousel .swiper-button-prev::after {
            font-size: 18px;
            font-weight: bold;
          }

          .glass-carousel .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.4);
            width: 12px;
            height: 12px;
            transition: all 0.3s ease;
          }

          .glass-carousel .swiper-pagination-bullet-active {
            background: #074C77;
            transform: scale(1.2);
            box-shadow: 0 4px 15px rgba(7, 76, 119, 0.4);
          }
        `}</style>
      </Swiper>
    </div>
  );
};

export default Carousel;
