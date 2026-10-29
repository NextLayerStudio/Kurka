import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Set the root directory to avoid lockfile detection issues
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/avif', 'image/webp'], // Enable modern image formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon sizes
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache for 1 year
    dangerouslyAllowSVG: true, // Allow SVG optimization
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  // Production-only optimizations
  poweredByHeader: false, // Remove X-Powered-By header for security and performance
  // Enable static optimization
  reactStrictMode: true,
  // Ensure API routes work properly
  async headers() {
    const headers = [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/kalkulacky/:path*.html',
        headers: [{ key: 'Cache-Control', value: 'no-cache' }],
      },
    ];
    // In dev, immutable caching makes the browser keep stale client bundles
    if (process.env.NODE_ENV === 'production') {
      headers.push({
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      });
    }
    return headers;
  },
};

export default nextConfig;
