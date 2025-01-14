import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.reservoir.tools',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wrpcd.net',
        pathname: '/cdn-cgi/**',
      },
      {
        protocol: 'https',
        hostname: 'xonin.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xonin-frame-v2.vercel.app',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
