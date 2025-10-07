"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye } from "lucide-react"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/currency"

interface ProductGridProps {
  products: Product[]
  loading: boolean
}

export function ProductGrid({ products, loading }: ProductGridProps) {

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-muted rounded-lg mb-4" />
            <div className="h-4 bg-muted rounded mb-2" />
            <div className="h-4 bg-muted rounded w-2/3 mb-2" />
            <div className="h-6 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your search criteria or browse our categories</p>
        <Button asChild>
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                />
              </Link>

              {/* Sale badge */}
              {product.is_on_sale && (
                <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">Sale</Badge>
              )}

              {/* Quick actions */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0" asChild>
                  <Link href={`/product/${product.slug}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <Link href={`/product/${product.slug}`}>
                <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
              </Link>

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-lg text-primary">{formatPrice(product.current_price)}</span>
                {product.is_on_sale && product.base_price && (
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.base_price)}</span>
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
                      style={{
                        backgroundColor: tag.color_code + "20",
                        color: tag.color_code,
                        borderColor: tag.color_code + "40",
                      }}
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
  )
}
