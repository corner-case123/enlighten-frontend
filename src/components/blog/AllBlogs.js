"use client";
import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { fetchNewsForCategory, fetchAllNews } from "@/services/newsService";

const CATEGORIES = [
  "All",
  "Environment Protection",
  "Green Initiatives",
  "Language and Culture",
  "Healthy Living",
  "Science & Technology",
  "Community Stories",
  "Global Awareness",
];

// Enhanced keywords mapping for better article classification
const CATEGORY_KEYWORDS = {
  "Environment Protection": [
    "environment",
    "climate",
    "pollution",
    "conservation",
    "ecosystem",
    "biodiversity",
    "wildlife",
    "environmental policy",
    "clean air",
    "clean water",
  ],
  "Green Initiatives": [
    "renewable",
    "sustainable",
    "green",
    "eco-friendly",
    "recycling",
    "solar power",
    "wind energy",
    "zero waste",
  ],
  "Language and Culture": [
    "language",
    "culture",
    "linguistics",
    "heritage",
    "traditions",
    "diversity",
    "cultural exchange",
    "multilingual",
  ],
  "Healthy Living": [
    "health",
    "wellness",
    "fitness",
    "nutrition",
    "mental health",
    "exercise",
    "diet",
    "lifestyle",
  ],
  "Science & Technology": [
    "technology",
    "science",
    "innovation",
    "research",
    "digital",
    "AI",
    "robotics",
    "space",
  ],
  "Community Stories": [
    "community",
    "local",
    "neighborhood",
    "social impact",
    "grassroots",
    "volunteering",
    "civic",
  ],
  "Global Awareness": [
    "global",
    "international",
    "world issues",
    "cross-cultural",
    "global citizenship",
    "cultural awareness",
  ],
};

const BlogSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchArticles(1);
  }, [selectedCategory]);

  const fetchArticles = async (page = 1) => {
    try {
      setLoading(true);
      let fetchedArticles;

      if (selectedCategory === "All") {
        fetchedArticles = await fetchAllNews();
      } else {
        fetchedArticles = await fetchNewsForCategory(selectedCategory);
      }

      // Process and set articles
      const processedArticles = combineContent(fetchedArticles);

      if (page === 1) {
        setArticles(processedArticles);
      } else {
        setArticles((prev) => [...prev, ...processedArticles]);
      }

      setHasMore(processedArticles.length > 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  const combineContent = (apiArticles) => {
    return apiArticles.map((article) => ({
      ...article,
      category: article.category || "Uncategorized",
    }));
  };

  const handleSeeMore = () => {
    const nextPage = currentPage + 1;
    fetchArticles(nextPage);
  };

  const handleArticleClick = (article) => {
    router.push(`${article.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-900">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 mb-10">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-2xl transition-all duration-300 font-medium ${
              selectedCategory === category
                ? "bg-gradient-to-r from-[#074C77] to-[#0a6ba8] text-white shadow-lg shadow-[#074C77]/30 hover:scale-105"
                : "glass-card text-gray-300 hover:text-white hover:bg-gray-700/50 hover:scale-105"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading && articles.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#074C77] mx-auto mb-4 shadow-lg shadow-[#074C77]/30"></div>
          <p className="text-gray-300 text-lg">Loading articles...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div
                key={index}
                onClick={() => handleArticleClick(article)}
                className="cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <BlogCard
                  category={article.category}
                  title={article.title}
                  description={article.description}
                  image={article.image}
                />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={handleSeeMore}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  "Load More Articles"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogSection;
