/** @type {import('next').NextConfig} */

const nextConfig = {
  // Enable image optimization
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Experimental features for performance
  experimental: {
    // Enable optimistic updates
    optimisticClientCache: true,
  },
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  nextConfig["experimental"] = {
    ...nextConfig.experimental,
    serverActions: true,
  };
}

module.exports = nextConfig;