/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
      },
      {
        protocol: 'https',
        hostname: 'st3.depositphotos.com',
      },
      {
        protocol: 'https',
        hostname: 't4.ftcdn.net',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'https://genzemart.byethost24.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;