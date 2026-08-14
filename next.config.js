// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client')
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      { hostname: 'utfs.io' },
      { hostname: 'img.clerk.com' },
      { hostname: 'subdomain' },
      { hostname: 'localhost' },
      { hostname: '127.0.0.1' },
      { hostname: 'placehold.co' },
    ],
  },
  // Reduce JS bundle size  
  poweredByHeader: false,
}

module.exports = nextConfig