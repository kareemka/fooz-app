import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
              "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com data:",
              "img-src 'self' data: blob: http://localhost:3000 https://api.fooz-gaming.com https://images.unsplash.com",
              "connect-src 'self' http://localhost:3000 https://api.fooz-gaming.com",
              "media-src 'self' blob: http://localhost:3000 https://api.fooz-gaming.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'api.fooz-gaming.com',
      },
    ],
  },
  output: 'standalone',
  outputFileTracingRoot: '../../',
};

export default nextConfig;
