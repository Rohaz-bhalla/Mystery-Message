/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint warnings
  }
}

module.exports = nextConfig