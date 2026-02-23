import { MetadataRoute } from 'next'
import { productApi, categoryApi, blogApi, productTypeApi } from '@/lib/api'

// Force dynamic rendering to fetch fresh data on each request
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sofahub.co.ke'

  // Static pages - Main category pages prioritized for sitelinks
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    // Main category pages - high priority for Google sitelinks
    {
      url: `${baseUrl}/category/living-room`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/category/dining-room`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/category/bedroom`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/category/office`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/category/fabrics-accessories`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
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
    // Filter out main categories that are already in staticPages to avoid duplicates
    const mainCategorySlugs = ['living-room', 'dining-room', 'bedroom', 'office', 'fabrics-accessories']
    const categories = await categoryApi.getAll()
    console.log(`Found ${categories.length} categories to add to sitemap`)
    
    const categoryPages = categories
      .filter(category => !mainCategorySlugs.includes(category.slug))
      .map(category => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))

    // Sub-category pages based on room category + product type
    const subCategoryPages = []
    for (const category of categories) {
      try {
        const productTypes = await productTypeApi.getAll({ room_category: category.slug })
        for (const type of productTypes) {
          subCategoryPages.push({
            url: `${baseUrl}/category/${category.slug}/${type.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.75,
          })
        }
      } catch (error) {
        console.error(`Error loading product types for ${category.slug}:`, error)
      }
    }

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
      ...subCategoryPages,
      ...blogPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static pages on error
    return staticPages
  }
}

