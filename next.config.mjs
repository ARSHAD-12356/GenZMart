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
}

export default nextConfig
