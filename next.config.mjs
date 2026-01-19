/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Next.js font system completely
  optimizeFonts: false,
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Disable SWC to avoid conflicts with Babel
  swcMinify: false,
  // Configuration for experimental features
  experimental: {
    // Increase memory limit for build
    memoryBasedWorkersCount: true,
  },
  // Handle environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080',
  },
  // Configure webpack
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `document` or `window` objects
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
