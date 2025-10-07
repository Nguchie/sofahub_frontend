"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"
import type { Product } from "@/lib/types"
import { productApi } from "@/lib/api"
import { formatPrice } from "@/lib/currency"
import { useCart } from "@/lib/cart-context"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // In a real app, you'd have a featured products endpoint
        const allProducts = await productApi.getAll()
        setProducts(allProducts.slice(0, 8)) // Show first 8 products
      } catch (error) {
        console.error("Failed to fetch featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = async (product: Product) => {
    // For demo purposes, use the first variation or create a default one
    const variationId = product.variations?.[0]?.id || 1
    await addToCart(variationId, 1)
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
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

  return (
    <section className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our most popular furniture pieces, loved by customers across Kenya.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="relative aspect-square bg-muted">
                <Link href={`/product/${product.slug}`}>
                  <img
                    src={product.primary_image?.image || "/placeholder.svg"}
                    alt={product.primary_image?.alt_text || product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </Link>

                {/* Sale badge */}
                {product.is_on_sale && (
                  <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">Sale</Badge>
                )}

                {/* Quick actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick add to cart */}
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" className="w-full" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-primary">{formatPrice(product.current_price)}</span>
                  {product.is_on_sale && product.base_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.base_price)}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs"
                        style={{ backgroundColor: tag.color_code + "20", color: tag.color_code }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button size="lg" variant="outline" asChild>
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </section>
  )
}
