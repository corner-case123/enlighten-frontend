"use client";
import React from "react";

// Function to calculate reading time based on word count
const calculateReadTime = (description) => {
  const wordsPerMinute = 200; // Average words per minute reading speed
  const words = description.split(" ").length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes}-min read`;
};

const BlogCard = ({ category, title, description, image, readTime }) => {
  const [imageError, setImageError] = React.useState(false);
  
  // Generate a fallback image URL based on the category
  const fallbackImage = React.useMemo(() => {
    const cleanCategory = category?.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-') || 'blog';
    return `https://source.unsplash.com/featured/800x600/?${cleanCategory}`;
  }, [category]);
  
  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#074C77]/20 group">
      <div className="relative h-48 bg-gray-800/30 overflow-hidden">
        <img
          src={imageError ? fallbackImage : (image || fallbackImage)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#074C77] bg-[#074C77]/10 px-3 py-1 rounded-full border border-[#074C77]/20">
            {category}
          </span>
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {calculateReadTime(description)}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-white group-hover:text-[#074C77] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
          {description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center text-[#074C77] text-sm font-medium group-hover:text-[#0a6ba8] transition-colors duration-300">
            Read more
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
