/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next.js Image Optimization for faster mobile loads
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Redirect www to non-www
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'www.sofahub.co.ke' },
        ],
        destination: 'https://sofahub.co.ke/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
