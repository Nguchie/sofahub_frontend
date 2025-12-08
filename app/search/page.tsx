import { ProductCatalog } from "@/components/products/product-catalog"
import type { Metadata } from "next"

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

export const metadata: Metadata = {
  title: "Search Products - Sofahub",
  description: "Search for furniture products at Sofahub Kenya",
  alternates: { canonical: "https://sofahub.co.ke/search" },
  robots: { 
    index: false, 
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    url: "https://sofahub.co.ke/search",
    type: "website",
  },
}
