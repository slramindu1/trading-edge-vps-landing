/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'utfs.io',
      'img.clerk.com',
      'subdomain',
      'localhost',
      '127.0.0.1',
      'placehold.co',
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
