import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'altudo-marketing-prod-367860-single.azurewebsites.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
