"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import type { Product, Category } from "@/lib/types"
import { productApi } from "@/lib/api"
import { formatPrice } from "@/lib/currency"
import { useCart } from "@/lib/cart-context"

interface RelatedProductsProps {
  currentProductId: number
  categories: Category[]
}

export function RelatedProducts({ currentProductId, categories }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Fetch products from the same categories
        const categorySlug = categories[0]?.slug
        if (categorySlug) {
          const products = await productApi.getAll({ category: categorySlug })
          const filtered = products.filter((product) => product.id !== currentProductId).slice(0, 8)
          setRelatedProducts(filtered)
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId, categories])

  const handleAddToCart = async (product: Product) => {
    const variationId = product.variations?.[0]?.id || 1
    await addToCart(variationId, 1)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, relatedProducts.length - 3))
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + Math.max(1, relatedProducts.length - 3)) % Math.max(1, relatedProducts.length - 3),
    )
  }

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4" />
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        {relatedProducts.length > 4 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextSlide}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 25}%)` }}
        >
          {relatedProducts.map((product) => (
            <div key={product.id} className="w-1/4 flex-shrink-0 px-3">
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-muted">
                    <Link href={`/product/${product.slug}`}>
                      <img
                        src={product.primary_image.image || "/placeholder.svg"}
                        alt={product.primary_image.alt_text}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {product.is_on_sale && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">Sale</Badge>
                    )}

                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="w-full" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{formatPrice(product.current_price)}</span>
                      {product.is_on_sale && product.base_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.base_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
