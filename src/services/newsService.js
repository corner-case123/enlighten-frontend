import axios from "axios";

// API Keys
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const GUARDIAN_API_KEY = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY;
const MEDIASTACK_API_KEY = process.env.NEXT_PUBLIC_MEDIASTACK_API_KEY;
const NUTRITIONIX_APP_ID = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NEXT_PUBLIC_NUTRITIONIX_API_KEY;

// Base URLs for different news APIs
const NEWS_API_URL = "https://newsapi.org/v2";
const GUARDIAN_API_URL = "https://content.guardianapis.com";
// Changed MediaStack to HTTPS to avoid mixed content warnings
const MEDIASTACK_API_URL = "https://api.mediastack.com/v1";
const NUTRITIONIX_API_URL = "https://trackapi.nutritionix.com/v2";

// Health and wellness topics for Nutritionix
const HEALTH_TOPICS = [
  {
    query: "healthy breakfast ideas",
    title: "Healthy Breakfast Ideas for a Nutritious Start",
    category: "Meal Planning",
  },
  {
    query: "post workout nutrition",
    title: "Post-Workout Nutrition Guide",
    category: "Fitness Nutrition",
  },
  {
    query: "protein rich foods vegetarian",
    title: "Plant-Based Protein Sources",
    category: "Vegetarian Nutrition",
  },
  {
    query: "weight loss foods",
    title: "Nutritious Foods for Weight Management",
    category: "Weight Management",
  },
  {
    query: "energy boosting snacks",
    title: "Healthy Snacks for Energy",
    category: "Snack Ideas",
  },
  {
    query: "anti inflammatory foods",
    title: "Anti-Inflammatory Foods Guide",
    category: "Wellness",
  },
  {
    query: "meal prep healthy",
    title: "Healthy Meal Prep Guide",
    category: "Meal Planning",
  },
  {
    query: "superfoods list",
    title: "Essential Superfoods for Optimal Health",
    category: "Nutrition Basics",
  },
];

// Fetch nutrition and health content from Nutritionix
const fetchNutritionContent = async () => {
  try {
    // Fetch nutrition information for various health topics
    const nutritionArticles = await Promise.all(
      HEALTH_TOPICS.map(async (topic) => {
        try {
          const response = await axios.post(
            `${NUTRITIONIX_API_URL}/natural/nutrients`,
            {
              query: topic.query,
            },
            {
              headers: {
                "x-app-id": NUTRITIONIX_APP_ID,
                "x-app-key": NUTRITIONIX_API_KEY,
                "Content-Type": "application/json",
              },
            }
          );

          // Generate article content from nutrition data
          const foods = response.data.foods;
          let description = "Discover the nutritional benefits of ";
          description += foods.map((food) => food.food_name).join(", ") + ". ";
          description +=
            "Learn about calories, proteins, and essential nutrients for a healthier lifestyle.";

          // Create an article-like structure
          return {
            title: topic.title,
            description: description,
            image:
              foods[0]?.photo?.thumb ||
              "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
            url: "#",
            source: "Nutritionix Health Tips",
            category: "Healthy Living",
            publishedAt: new Date().toISOString(),
            nutritionInfo: foods.map((food) => ({
              name: food.food_name,
              calories: food.nf_calories,
              protein: food.nf_protein,
              carbs: food.nf_total_carbohydrate,
              fats: food.nf_total_fat,
            })),
          };
        } catch (error) {
          console.error(
            `Error fetching nutrition data for ${topic.query}:`,
            error
          );
          return null;
        }
      })
    );

    // Filter out any failed requests
    return nutritionArticles.filter((article) => article !== null);
  } catch (error) {
    console.error("Error fetching nutrition content:", error);
    return [];
  }
};

// Category-specific query parameters for each API
const CATEGORY_QUERIES = {
  "Environment Protection": {
    newsApi: "environment OR climate OR conservation",
    guardian: "environment/climate-change OR environment/conservation",
    mediastack: "environment,climate,conservation,wildlife",
    sections: "environment",
    keywords: [
      "environment",
      "climate",
      "conservation",
      "ecosystem",
      "wildlife",
    ],
  },
  "Green Initiatives": {
    newsApi: "renewable energy OR sustainable OR green technology",
    guardian: "environment/renewable-energy OR environment/green-living",
    mediastack: "renewable,sustainable,green-technology,eco-friendly",
    sections: "environment",
    keywords: ["renewable", "sustainable", "green", "eco-friendly"],
  },
  "Language and Culture": {
    newsApi: "language OR culture OR linguistics",
    guardian: "culture OR education/languages",
    mediastack: "language,culture,linguistics,heritage",
    sections: "culture",
    keywords: ["language", "culture", "linguistics", "heritage"],
  },
  "Healthy Living": {
    newsApi: "health OR wellness OR fitness",
    guardian: "lifeandstyle/health-and-wellbeing",
    mediastack: "health,wellness,fitness,nutrition",
    sections: "lifestyle",
    keywords: ["health", "wellness", "fitness", "nutrition"],
  },
  "Science & Technology": {
    newsApi: "technology OR science OR innovation",
    guardian: "technology OR science",
    mediastack: "technology,science,innovation,ai",
    sections: "technology",
    keywords: ["technology", "science", "innovation", "ai"],
  },
  "Community Stories": {
    newsApi: "community OR local news OR social impact",
    guardian: "society OR community",
    mediastack: "community,local,social-impact",
    sections: "society",
    keywords: ["community", "local", "social impact"],
  },
  "Global Awareness": {
    newsApi: "global issues OR climate change OR social justice",
    guardian: "world OR global-development",
    mediastack: "global-issues,climate-change,social-justice",
    sections: "world",
    keywords: ["global", "international", "world", "social justice"],
  },
};

// Fetch from MediaStack API using our server-side proxy to avoid CORS issues
const fetchFromMediaStack = async (category) => {
  try {
    // Use our server-side API endpoint instead of calling MediaStack API directly
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/mediastack`, {
      params: {
        category: CATEGORY_QUERIES[category]?.mediastack || category,
      },
      timeout: 8000, // Longer timeout since this is going through our server
    });

    if (response.data && response.data.success && response.data.articles) {
      return response.data.articles;
    } else {
      console.log("Using fallback content for MediaStack API due to empty response");
      return getFallbackArticles(category, "MediaStack");
    }
  } catch (error) {
    console.log("Using fallback content for MediaStack API due to error");
    return getFallbackArticles(category, "MediaStack");
  }
};

// Enhanced article categorization
const categorizeSingleArticle = (article, defaultCategory) => {
  const content = `${article.title} ${article.description}`.toLowerCase();

  for (const [category, queryData] of Object.entries(CATEGORY_QUERIES)) {
    if (
      queryData.keywords.some((keyword) =>
        content.includes(keyword.toLowerCase())
      )
    ) {
      return category;
    }
  }
  return defaultCategory;
};

// Fallback articles when APIs fail
const getFallbackArticles = (category, source = "Fallback") => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Create a set of fallback articles based on the category
  const fallbackArticles = [
    {
      title: `Latest Developments in ${category}`,
      description: `Explore the most recent advancements and trends in ${category.toLowerCase()}. This article provides insights into how these developments are shaping our world.`,
      image: `https://source.unsplash.com/random/800x600/?${category.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-')}`,
      url: "#",
      source: `${source} News`,
      category: category,
      publishedAt: now.toISOString(),
    },
    {
      title: `The Future of ${category}`,
      description: `What does the future hold for ${category.toLowerCase()}? Experts weigh in on upcoming trends and innovations that will transform this field in the coming years.`,
      image: `https://source.unsplash.com/random/800x600/?future-${category.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-')}`,
      url: "#",
      source: `${source} Insights`,
      category: category,
      publishedAt: yesterday.toISOString(),
    },
    {
      title: `How ${category} is Changing Our World`,
      description: `An in-depth look at the impact of ${category.toLowerCase()} on society, economy, and daily life. Discover how these changes are affecting you.`,
      image: `https://source.unsplash.com/random/800x600/?impact-${category.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-')}`,
      url: "#",
      source: `${source} Analysis`,
      category: category,
      publishedAt: yesterday.toISOString(),
    },
  ];
  
  return fallbackArticles;
};

// Fetch from News API using our server-side proxy to avoid CORS issues
const fetchFromNewsApi = async (category) => {
  try {
    // Use our server-side API endpoint instead of calling News API directly
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/newsapi`, {
      params: {
        category: CATEGORY_QUERIES[category]?.newsApi || category,
      },
      timeout: 8000, // Longer timeout since this is going through our server
    });

    if (response.data && response.data.success && response.data.articles) {
      return response.data.articles;
    } else {
      console.log("Using fallback content for News API due to empty response");
      return getFallbackArticles(category, "News API");
    }
  } catch (error) {
    console.log("Using fallback content for News API due to error");
    return getFallbackArticles(category, "News API");
  }
};

// Fetch from Guardian API using our server-side proxy to avoid CORS issues
const fetchFromGuardian = async (category) => {
  try {
    // Use our server-side API endpoint instead of calling Guardian API directly
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/guardian`, {
      params: {
        category: CATEGORY_QUERIES[category]?.guardian || category,
      },
      timeout: 8000, // Longer timeout since this is going through our server
    });

    if (response.data && response.data.success && response.data.articles) {
      return response.data.articles;
    } else {
      console.log("Using fallback content for Guardian API due to empty response");
      return getFallbackArticles(category, "Guardian");
    }
  } catch (error) {
    console.log("Using fallback content for Guardian API due to error");
    return getFallbackArticles(category, "Guardian");
  }
};

// Main function to fetch news from all sources
export const fetchNewsForCategory = async (category) => {
  try {
    // First try to fetch all news at once from our server-side API
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/all`, {
        params: { category },
        timeout: 10000, // Longer timeout for the combined endpoint
      });

      if (response.data && response.data.success && response.data.articles && response.data.articles.length > 0) {
        return response.data.articles;
      }
    } catch (serverError) {
      console.log("Server-side combined fetch failed, falling back to individual APIs", serverError.message);
    }

    // If server-side combined fetch fails, fall back to individual API calls
    let articles = [];

    // Fetch from different sources based on category
    if (category === "Healthy Living") {
      const nutritionArticles = await fetchNutritionContent();
      articles = [...articles, ...nutritionArticles];
    }

    const [newsApiArticles, guardianArticles, mediaStackArticles] =
      await Promise.all([
        fetchFromNewsApi(category),
        fetchFromGuardian(category),
        fetchFromMediaStack(category),
      ]);

    articles = [
      ...articles,
      ...newsApiArticles,
      ...guardianArticles,
      ...mediaStackArticles,
    ];

    // Remove duplicates based on title and URL
    const uniqueArticles = Array.from(
      new Map(articles.map((item) => [item.title + (item.url || ""), item])).values()
    );

    // Sort by date
    return uniqueArticles.sort(
      (a, b) => new Date(b.publishedAt || Date.now()) - new Date(a.publishedAt || Date.now())
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    // Return fallback articles for the category if everything fails
    return getFallbackArticles(category, "All Sources");
  }
};

// Fetch news for all categories
export const fetchAllNews = async () => {
  try {
    // First try to fetch all news at once from our server-side API
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/all`, {
        timeout: 10000, // Longer timeout for the combined endpoint
      });

      if (response.data && response.data.success && response.data.articles && response.data.articles.length > 0) {
        return response.data.articles;
      }
    } catch (serverError) {
      console.log("Server-side all news fetch failed, falling back to category-based fetch", serverError.message);
    }
    
    // If server-side fetch fails, fall back to fetching by category
    const allArticles = await Promise.all(
      Object.keys(CATEGORY_QUERIES).map((category) =>
        fetchNewsForCategory(category)
      )
    );

    return allArticles.flat();
  } catch (error) {
    console.error("Error fetching all news:", error);
    // Return fallback articles for a few categories if everything fails
    const fallbackCategories = ["Environment Protection", "Language and Culture", "Science & Technology"];
    const fallbackArticles = await Promise.all(
      fallbackCategories.map(category => getFallbackArticles(category, "All Sources"))
    );
    return fallbackArticles.flat();
  }
};
