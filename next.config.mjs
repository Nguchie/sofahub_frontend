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
}

export default nextConfig

// Enforce non-www and HTTPS at the edge (best done at host). If self-hosting, configure at the proxy/server.
export async function redirects() {
  return [
    // If your hosting honors host-based redirects via Next.js
    {
      source: '/:path*',
      has: [
        { type: 'host', value: 'www.sofahub.co.ke' },
      ],
      destination: 'https://sofahub.co.ke/:path*',
      permanent: true,
    },
  ]
}
