"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

const profiles = [
  {
    name: "Philip",
    studies: "Spanish",
    knows: "English",
    studiesFlag: "/flag/pl.svg",
    knowsFlag: "/flag/zh.svg",
    image: "/person.jpeg",
  },
  {
    name: "Luis",
    studies: "Italian",
    knows: "Spanish",
    studiesFlag: "/flag/es.webp",
    knowsFlag: "/flag/en-uk.svg",
    image: "/person2.jpeg",
  },
  {
    name: "지원",
    studies: "German",
    knows: "Korean",
    studiesFlag: "/flag/zh.svg",
    knowsFlag: "/flag/pl.svg",
    image: "/person3.jpeg",
  },
  {
    name: "Jane",
    studies: "English",
    knows: "German",
    studiesFlag: "/flag/pl.svg",
    knowsFlag: "/flag/en-uk.svg",
    image: "/person4.jpeg",
  },
  {
    name: "John",
    studies: "Italian",
    knows: "English",
    studiesFlag: "/flag/pl.svg",
    knowsFlag: "/flag/pl.svg",
    image: "/person5.jpeg",
  },
  {
    name: "Sarah",
    studies: "English",
    knows: "Italian",
    studiesFlag: "/flag/pl.svg",
    knowsFlag: "/flag/en-uk.svg",
    image: "/person6.jpeg",
  },
];

const Testimonial = () => {
  return (
    <div className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto">
      <div className="mx-auto text-center">
        <span className="inline-block bg-gradient-to-r from-[#074C77]/10 to-[#0a6ba8]/10 text-[#074C77] text-sm font-semibold px-4 py-2 rounded-full mb-4">
          Our Community
        </span>
        <h1 className="section-heading mb-4">
          Millions of language partners
        </h1>
        <p className="section-subheading mb-12">Any language combinations you can imagine</p>

        <div className="relative overflow-hidden px-2 sm:px-12 md:px-16 lg:px-24">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 28,
              },
            }}
          >
            {profiles.map((profile, index) => (
              <SwiperSlide key={index}>
                <div className="card-elevated p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 h-full group">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover relative z-10 border-4 border-white"
                    />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="font-bold text-xl sm:text-2xl text-[#074C77] mb-2">
                      {profile.name}
                    </h2>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600">
                        <span className="font-medium">Wants to learn</span>
                        <img src={profile.studiesFlag} className="w-5 h-5 rounded-sm shadow-sm" alt="" />
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600">
                        <span className="font-medium">Can teach you</span>
                        <img src={profile.knowsFlag} className="w-5 h-5 rounded-sm shadow-sm" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Swiper navigation buttons */}
          <div className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#074C77] hover:bg-[#074C77] hover:text-white transition-all duration-300 cursor-pointer z-10">
            <FaChevronLeft className="text-lg" />
          </div>
          <div className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#074C77] hover:bg-[#074C77] hover:text-white transition-all duration-300 cursor-pointer z-10">
            <FaChevronRight className="text-lg" />
          </div>
        </div>

        <Link href="/learning">
          <button className="btn-accent text-sm sm:text-base py-3 px-10 mt-12">
            Start to learn languages
          </button>
        </Link>
      </div>

      <div
        className="mx-auto w-full text-center rounded-3xl min-h-[18rem] sm:min-h-[22rem] md:min-h-[28rem] my-16 sm:my-20 md:my-24 flex justify-center items-center relative overflow-hidden"
        style={{
          backgroundImage: `url('/flag/footerbg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        <div className="px-6 sm:px-8 md:px-12 relative z-10">
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Discover your <br /> 
            <span className="bg-gradient-to-r from-[#0a6ba8] to-[#34d399] bg-clip-text text-transparent">community</span>
          </h3>
          <p className="w-full max-w-[320px] sm:max-w-[450px] md:max-w-[550px] mx-auto text-base sm:text-lg md:text-xl text-gray-200 mt-5 sm:mt-6 leading-relaxed">
            Enlighten connects you with millions of individuals who are
            experiencing the delights and hurdles of mastering a new language.
            Come join our vibrant community!
          </p>
          <Link href="/community">
            <button className="btn-primary mt-8">
              Join the community
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
