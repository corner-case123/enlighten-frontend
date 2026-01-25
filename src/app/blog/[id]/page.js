"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

const BlogDetailPage = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        setLoading(true);
        
        // Check if the ID is a valid URL
        let articleId = id;
        if (isValidUrl(decodeURIComponent(id))) {
          articleId = decodeURIComponent(id);
        }

        // Try to fetch from our server API first
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/article/${encodeURIComponent(articleId)}`);
          if (response.data && response.data.success && response.data.article) {
            setArticle(response.data.article);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log("Server API fetch failed, trying to generate content");
        }

        // If server API fails, generate a detailed article based on the ID
        const generatedArticle = generateArticleFromId(articleId);
        setArticle(generatedArticle);
      } catch (error) {
        console.error("Error fetching article details:", error);
        toast.error("Failed to load article details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleDetails();
    }
  }, [id]);

  // Helper function to check if a string is a valid URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Generate a detailed article based on the ID
  const generateArticleFromId = (id) => {
    // Extract category and title from the ID
    const parts = id.split('/');
    const lastPart = parts[parts.length - 1];
    const title = lastPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Determine category from URL or use default
    let category = "General";
    if (id.includes("environment") || id.includes("climate")) {
      category = "Environment Protection";
    } else if (id.includes("green") || id.includes("sustainable")) {
      category = "Green Initiatives";
    } else if (id.includes("language") || id.includes("culture")) {
      category = "Language and Culture";
    } else if (id.includes("health") || id.includes("wellness")) {
      category = "Healthy Living";
    } else if (id.includes("tech") || id.includes("science")) {
      category = "Science & Technology";
    } else if (id.includes("community") || id.includes("local")) {
      category = "Community Stories";
    } else if (id.includes("global") || id.includes("world")) {
      category = "Global Awareness";
    }
    
    return {
      id,
      title,
      category,
      description: `This is a detailed article about ${title.toLowerCase()}. The content explores various aspects and provides valuable insights on this topic.`,
      content: generateDetailedContent(title, category),
      image: `https://source.unsplash.com/featured/1200x600/?${category.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-')}`,
      author: "Language Exchange Team",
      publishedAt: new Date().toISOString(),
      source: "Language Exchange Blog",
    };
  };

  // Generate detailed content for the article
  const generateDetailedContent = (title, category) => {
    const paragraphs = [
      `<p>Welcome to our in-depth exploration of ${title}. This article aims to provide comprehensive information and insights on this important topic within the ${category} domain.</p>`,
      `<p>In today's rapidly changing world, understanding ${title.toLowerCase()} has become increasingly important. Experts in the field have conducted numerous studies and research to better comprehend its implications and applications.</p>`,
      `<p>One of the key aspects of ${title.toLowerCase()} is its impact on our daily lives. From personal development to global implications, this topic touches various facets of human existence and societal structures.</p>`,
      `<p>Research has shown that engaging with ${title.toLowerCase()} can lead to improved outcomes in related areas. The interconnected nature of knowledge means that insights from this field can be applied to solve problems in adjacent domains.</p>`,
      `<p>As we continue to advance our understanding, new methodologies and approaches are being developed to address the challenges and opportunities presented by ${title.toLowerCase()}. Innovation in this space is driving progress at an unprecedented rate.</p>`,
      `<p>Looking ahead, the future of ${title.toLowerCase()} appears promising. With continued investment in research and development, we can expect to see significant breakthroughs that will further enhance our capabilities and understanding.</p>`,
      `<p>In conclusion, ${title.toLowerCase()} represents an exciting area of study and application. By staying informed and engaged with developments in this field, we can all contribute to and benefit from the advancements being made.</p>`,
    ];
    
    return paragraphs.join('\n');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-gray-700/50 rounded-2xl w-3/4 mb-8"></div>
            <div className="h-64 bg-gray-700/50 rounded-3xl mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700/50 rounded-xl w-full"></div>
              <div className="h-4 bg-gray-700/50 rounded-xl w-full"></div>
              <div className="h-4 bg-gray-700/50 rounded-xl w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center glass-card rounded-3xl p-12 max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#074C77]/20 to-[#0a6ba8]/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[#074C77]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-white">Article Not Found</h1>
            <p className="text-gray-300 text-lg">
              Sorry, we couldn't find the article you're looking for.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-gradient-to-r from-[#074C77]/20 to-[#0a6ba8]/20 text-[#074C77] border border-[#074C77]/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">{article.title}</h1>
            <div className="flex items-center text-gray-300 text-sm mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{(article.author || "Language Exchange Team").charAt(0)}</span>
                </div>
                <span>{article.author || "Language Exchange Team"}</span>
              </div>
              <span className="text-gray-500">•</span>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              {article.source && (
                <>
                  <span className="text-gray-500">•</span>
                  <span>Source: {article.source}</span>
                </>
              )}
            </div>
          </div>

        <div className="mb-10">
          <div className="glass-card rounded-3xl overflow-hidden">
            <img
              src={article.image || `https://source.unsplash.com/featured/1200x600/?${article.category.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-')}`}
              alt={article.title}
              className="w-full h-auto object-cover"
              style={{ maxHeight: "500px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://source.unsplash.com/featured/1200x600/?${article.category.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-')}`;
              }}
            />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 prose prose-lg prose-invert max-w-none">
          {article.content ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} className="text-gray-200" />
          ) : (
            <>
              <p className="text-xl mb-6 text-gray-200 leading-relaxed">{article.description}</p>
              <p className="mb-6 text-gray-300 leading-relaxed">
                This article provides valuable insights into {article.title.toLowerCase()}.
                It explores various aspects and implications of this topic within the
                context of {article.category}.
              </p>
              <p className="mb-6 text-gray-300 leading-relaxed">
                For more detailed information, you can visit the original source
                by clicking{" "}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#074C77] hover:text-[#0a6ba8] transition-colors duration-300 font-semibold underline"
                >
                  here
                </a>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
