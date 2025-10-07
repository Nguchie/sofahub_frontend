import { ProductCatalog } from "@/components/products/product-catalog"

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    tags?: string
    sort?: string
    page?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {query ? `Search Results for "${query}"` : "Search Products"}
        </h1>
        {query && <p className="text-lg text-muted-foreground">Showing results for your search query</p>}
      </div>

      <ProductCatalog searchParams={{ ...searchParams, search: query }} />
    </div>
  )
}
