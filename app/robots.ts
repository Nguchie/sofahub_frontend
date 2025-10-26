import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sofahub.co.ke'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/cart/', '/order-confirmation/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

