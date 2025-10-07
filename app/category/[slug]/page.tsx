import { ProductCatalog } from "@/components/products/product-catalog"
import { categoryApi } from "@/lib/api"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    search?: string
    tags?: string
    sort?: string
    page?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  try {
    const categories = await categoryApi.getAll()
    const category = categories.find((cat) => cat.slug === params.slug)

    if (!category) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground">
            Discover our collection of {category.name.toLowerCase()} furniture
          </p>
        </div>

        <ProductCatalog category={params.slug} searchParams={searchParams} />
      </div>
    )
  } catch (error) {
    console.error('Error in CategoryPage:', error)
    // For known category slugs, show the page even if API fails
    const knownCategories = {
      'living-room': 'Living Room',
      'bedroom': 'Bedroom',
      'dining-room': 'Dining Room',
      'office': 'Office',
      'fabrics-accessories': 'Fabrics & Accessories',
    }
    
    const categoryName = knownCategories[params.slug as keyof typeof knownCategories]
    
    if (categoryName) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{categoryName}</h1>
            <p className="text-lg text-muted-foreground">
              Discover our collection of {categoryName.toLowerCase()} furniture
            </p>
          </div>

          <ProductCatalog category={params.slug} searchParams={searchParams} />
        </div>
      )
    }
    
    notFound()
  }
}

export async function generateStaticParams() {
  try {
    const categories = await categoryApi.getAll()
    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    // Return fallback static params for known categories
    return [
      { slug: 'living-room' },
      { slug: 'bedroom' },
      { slug: 'dining-room' },
      { slug: 'office' },
      { slug: 'fabrics-accessories' },
    ]
  }
}
