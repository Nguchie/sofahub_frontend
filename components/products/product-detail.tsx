"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Copy, ChevronRight, Star, CheckCircle, Package, Ruler } from "lucide-react"
import { ProductImageGallery } from "./product-image-gallery"
import { ProductVariations } from "./product-variations"
import type { Product, ProductVariation } from "@/lib/types"
import { formatPrice } from "@/lib/currency"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/hooks/use-toast"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(product.variations?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()

  const currentPrice = selectedVariation?.price || product.current_price
  const isInStock = selectedVariation ? selectedVariation.stock_quantity > 0 : true

  const handleAddToCart = async () => {
    if (!selectedVariation && product.variations && product.variations.length > 0) {
      toast({
        title: "Please select options",
        description: "Choose your preferred color, size, or material before adding to cart.",
        variant: "destructive",
      })
      return
    }

    if (!selectedVariation) {
      toast({
        title: "No variation selected",
        description: "Please select a product variation before adding to cart.",
        variant: "destructive",
      })
      return
    }

    setIsAddingToCart(true)
    try {
      await addToCart(selectedVariation.id, quantity)
      toast({
        title: "Added to cart!",
        description: `${product.name} (${selectedVariation.sku}) has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Product link has been copied to clipboard.",
        })
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Product link has been copied to clipboard.",
      })
    }
  }

  const handleCopySku = async () => {
    if (!selectedVariation?.sku) return
    await navigator.clipboard.writeText(selectedVariation.sku)
    toast({ title: "SKU copied", description: selectedVariation.sku })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <div className="mb-4 text-sm text-muted-foreground flex items-center gap-1">
          <a href="/products" className="hover:text-primary transition-colors">Products</a>
          <ChevronRight className="h-4 w-4" />
          <span>{product.categories?.[0]?.name || "All"}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <ProductImageGallery 
              images={product.images || (product.primary_image ? [product.primary_image] : [])} 
              productName={product.name} 
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold text-balance leading-tight">{product.name}</h1>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Categories & Tags */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {product.categories.map((category) => (
                    <Badge key={category.id} variant="secondary" className="text-xs">
                      {category.name}
                    </Badge>
                  ))}
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="text-xs"
                        style={{
                          backgroundColor: tag.color_code + "10",
                          color: tag.color_code,
                          borderColor: tag.color_code + "30",
                        }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
                {product.is_on_sale && product.base_price && (
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.base_price)}</span>
                )}
                {product.is_on_sale && (
                  <Badge className="bg-destructive text-destructive-foreground text-xs">
                    Save{" "}
                    {Math.round(
                      ((Number.parseFloat(product.base_price || "0") - Number.parseFloat(currentPrice)) /
                        Number.parseFloat(product.base_price || "1")) *
                        100,
                    )}
                    %
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Price includes VAT. Free delivery within Nairobi for orders above KSh 50,000.
              </p>
            </div>

            {/* Variations */}
            {product.variations && product.variations.length > 0 && (
              <ProductVariations
                variations={product.variations}
                selectedVariation={selectedVariation}
                onVariationChange={setSelectedVariation}
              />
            )}

            {/* Stock Status & SKU */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isInStock ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm font-medium">
                  {isInStock ? "In Stock" : "Out of Stock"}
                  {selectedVariation && isInStock && (
                    <span className="text-muted-foreground ml-1">({selectedVariation.stock_quantity} available)</span>
                  )}
                </span>
              </div>
              {selectedVariation && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">SKU:</span>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{selectedVariation.sku}</span>
                  <Button variant="ghost" size="icon" onClick={handleCopySku} aria-label="Copy SKU" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-3 py-1 text-center min-w-[60px] text-sm">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={selectedVariation ? quantity >= selectedVariation.stock_quantity : false}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  className="flex-1" 
                  onClick={handleAddToCart} 
                  disabled={!isInStock || isAddingToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleAddToCart} 
                  disabled={!isInStock || isAddingToCart}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
              <div className="text-center">
                <Truck className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-xs font-medium">Free Delivery</div>
                <div className="text-xs text-muted-foreground">Orders above KSh 50,000</div>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-xs font-medium">2 Year Warranty</div>
                <div className="text-xs text-muted-foreground">Quality guarantee</div>
              </div>
              <div className="text-center">
                <RotateCcw className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-xs font-medium">Easy Returns</div>
                <div className="text-xs text-muted-foreground">30-day return policy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || "No description available for this product."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-4">
              <div className="space-y-3">
                {selectedVariation && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">SKU:</span>
                      <span className="font-mono bg-muted px-2 py-1 rounded text-sm">{selectedVariation.sku}</span>
                    </div>
                    {Object.entries(selectedVariation.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium capitalize">{key}:</span>
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </>
                )}
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Categories:</span>
                  <span className="text-muted-foreground">{product.categories.map((cat) => cat.name).join(", ")}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-4">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    Delivery Information
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Free delivery within Nairobi for orders above KSh 50,000
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Standard delivery: 3-5 business days
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Express delivery: 1-2 business days (additional charges apply)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Assembly service available upon request
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    Return Policy
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      30-day return policy for unused items
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Items must be in original packaging
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Return shipping costs may apply
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Refunds processed within 5-7 business days
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


