"use client"

import { useState, useEffect } from "react"
import { ProductGrid } from "./product-grid"
import { ProductFilters } from "./product-filters"
import { ProductSort } from "./product-sort"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import type { Product } from "@/lib/types"
import { productApi } from "@/lib/api"

interface ProductCatalogProps {
  category?: string
  searchParams?: {
    search?: string
    tags?: string
    sort?: string
    page?: string
  }
}

export function ProductCatalog({ category, searchParams = {} }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null)
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null)

  const { search, tags, sort = "name", page = "1" } = searchParams

  // Initialize filters from URL params
  useEffect(() => {
    if (tags) setSelectedTags(tags.split(","))
  }, [tags])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params: any = {}
        if (category) params.category = category  // This will be mapped to 'room' in the API
        if (search) params.search = search
        if (selectedTags.length > 0) {
          params.tags = selectedTags.join(",")
          // Check if "on-sale" tag is selected and add on_sale parameter
          if (selectedTags.includes("on-sale")) {
            params.on_sale = "true"
          }
        }
        if (selectedProductType) params.product_type = selectedProductType  // Backend expects single product_type
        if (selectedPriceRange) {
          params.min_price = selectedPriceRange.min
          params.max_price = selectedPriceRange.max
        }

        // Map frontend sort to backend ordering
        const sortMapping: Record<string, string> = {
          "price-low": "base_price",
          "price-high": "-base_price", 
          "name": "name",
          "newest": "-created_at"
        }
        params.ordering = sortMapping[sort] || "-created_at"

        const fetchedProducts = await productApi.getAll(params)
        setProducts(fetchedProducts)
        setTotalProducts(fetchedProducts.length)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setProducts([])
        setTotalProducts(0)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, search, selectedTags, selectedProductType, selectedPriceRange, sort, page])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar - Desktop */}
      <div className="hidden lg:block">
        <ProductFilters
          category={category}
          selectedTags={selectedTags}
          selectedProductType={selectedProductType}
          selectedPriceRange={selectedPriceRange}
          onTagsChange={setSelectedTags}
          onProductTypeChange={setSelectedProductType}
          onPriceRangeChange={setSelectedPriceRange}
        />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Mobile Filter Toggle & Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden bg-transparent"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <span className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${totalProducts} products found`}
            </span>
          </div>

          <ProductSort
            currentSort={sort}
            onSortChange={(newSort) => {
              const url = new URL(window.location.href)
              url.searchParams.set("sort", newSort)
              window.history.pushState({}, "", url.toString())
              window.location.reload()
            }}
          />
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden mb-6 p-4 border border-border rounded-lg">
            <ProductFilters
              category={category}
              selectedTags={selectedTags}
              selectedProductType={selectedProductType}
              selectedPriceRange={selectedPriceRange}
              onTagsChange={setSelectedTags}
              onProductTypeChange={setSelectedProductType}
              onPriceRangeChange={setSelectedPriceRange}
            />
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} />

        {/* Pagination would go here */}
        {totalProducts > 12 && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
