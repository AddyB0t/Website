/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Allow cross-origin requests in development
  allowedDevOrigins: [
    'http://192.168.1.5:3000',
    'http://localhost:3000',
  ],
  // Performance optimizations
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true,
  },
  // Optimize output
  output: 'standalone',
}

export default nextConfig
