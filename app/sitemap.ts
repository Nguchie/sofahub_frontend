import { MetadataRoute } from 'next'
import { productApi, categoryApi, blogApi } from '@/lib/api'

// Force dynamic rendering to fetch fresh data on each request
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sofahub.co.ke'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/delivery`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  try {
    // Fetch all products from the database
    const products = await productApi.getAll()
    console.log(`Found ${products.length} products to add to sitemap`)
    
    const productPages = products.map(product => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: (product as any).updated_at ? new Date((product as any).updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Fetch all categories from the database
    const categories = await categoryApi.getAll()
    console.log(`Found ${categories.length} categories to add to sitemap`)
    
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Fetch all blog posts
    const blogPosts = await blogApi.getAll()
    console.log(`Found ${blogPosts.length} blog posts to add to sitemap`)
    
    const blogPages = blogPosts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // Combine all pages
    return [
      ...staticPages,
      ...productPages,
      ...categoryPages,
      ...blogPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static pages on error
    return staticPages
  }
}

