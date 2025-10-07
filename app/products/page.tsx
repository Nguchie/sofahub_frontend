import { ProductCatalog } from "@/components/products/product-catalog"

interface ProductsPageProps {
  searchParams: {
    search?: string
    category?: string
    tags?: string
    sort?: string
    page?: string
  }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">All Products</h1>
        <p className="text-lg text-muted-foreground">Browse our complete collection of quality furniture</p>
      </div>

      <ProductCatalog searchParams={searchParams} />
    </div>
  )
}
