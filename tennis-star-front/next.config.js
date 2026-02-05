/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack to avoid panic errors in Next.js 16.1.6
  experimental: {
    turbo: {
      // Disable Turbopack completely
      loaders: {},
    },
  },
  // Alternative: Use the legacy compiler
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ensure proper handling of middleware
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
