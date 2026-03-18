"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Copy,
  ChevronRight,
  CheckCircle,
} from "lucide-react"
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
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(
    product.variations?.[0] || null
  )
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
    } catch {
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
        return
      } catch {
        // Fall back to clipboard below.
      }
    }

    await navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Product link has been copied to clipboard.",
    })
  }

  const handleCopySku = async () => {
    if (!selectedVariation?.sku) return
    await navigator.clipboard.writeText(selectedVariation.sku)
    toast({ title: "SKU copied", description: selectedVariation.sku })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="mb-4 flex gap-1 overflow-x-auto pb-1 whitespace-nowrap text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link
            href={`/category/${product.categories?.[0]?.slug || ""}`}
            className="transition-colors hover:text-primary"
          >
            {product.categories?.[0]?.name || "Category"}
          </Link>
          {product.product_types?.[0]?.slug && (
            <>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <Link
                href={`/category/${product.categories?.[0]?.slug}/${product.product_types[0].slug}`}
                className="transition-colors hover:text-primary"
              >
                {product.product_types[0].name}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="font-medium text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductImageGallery
              images={product.images || (product.primary_image ? [product.primary_image] : [])}
              productName={product.name}
            />
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="text-2xl font-bold leading-tight text-balance sm:text-3xl">
                  {product.name}
                </h1>
                <div className="flex gap-2 self-start">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="h-9 w-9 p-0"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

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
                          backgroundColor: `${tag.color_code}10`,
                          color: tag.color_code,
                          borderColor: `${tag.color_code}30`,
                        }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-2xl font-bold text-primary sm:text-3xl">
                  {formatPrice(currentPrice)}
                </span>
                {product.is_on_sale && product.base_price && (
                  <span className="text-base text-muted-foreground line-through sm:text-lg">
                    {formatPrice(product.base_price)}
                  </span>
                )}
                {product.is_on_sale && (
                  <Badge className="bg-destructive text-xs text-destructive-foreground">
                    Save{" "}
                    {Math.round(
                      ((Number.parseFloat(product.base_price || "0") - Number.parseFloat(currentPrice)) /
                        Number.parseFloat(product.base_price || "1")) *
                        100
                    )}
                    %
                  </Badge>
                )}
              </div>
              <p className="flex items-start gap-1 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                Free delivery within Nairobi for orders above KSh 50,000.
              </p>
            </div>

            {product.variations && product.variations.length > 0 && (
              <ProductVariations
                variations={product.variations}
                selectedVariation={selectedVariation}
                onVariationChange={setSelectedVariation}
              />
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isInStock ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm font-medium">
                  {isInStock ? "In Stock" : "Out of Stock"}
                  {selectedVariation && isInStock && (
                    <span className="ml-1 text-muted-foreground">
                      ({selectedVariation.stock_quantity} available)
                    </span>
                  )}
                </span>
              </div>
              {selectedVariation && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">SKU:</span>
                  <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
                    {selectedVariation.sku}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopySku}
                    aria-label="Copy SKU"
                    className="h-6 w-6"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex w-fit items-center rounded-md border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-9 w-9 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="min-w-[56px] px-3 py-1 text-center text-sm">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={selectedVariation ? quantity >= selectedVariation.stock_quantity : false}
                    className="h-9 w-9 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="w-full flex-1"
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAddingToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAddingToCart}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 border-y py-4 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-lg bg-muted/40 p-3 text-center sm:bg-transparent sm:p-0">
                <Truck className="mx-auto mb-1 h-5 w-5 text-primary" />
                <div className="text-xs font-medium">Free Delivery</div>
                <div className="text-xs text-muted-foreground">Orders above KSh 50,000</div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-center sm:bg-transparent sm:p-0">
                <Shield className="mx-auto mb-1 h-5 w-5 text-primary" />
                <div className="text-xs font-medium">2 Year Warranty</div>
                <div className="text-xs text-muted-foreground">Quality guarantee</div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-center sm:bg-transparent sm:p-0">
                <RotateCcw className="mx-auto mb-1 h-5 w-5 text-primary" />
                <div className="text-xs font-medium">Easy Returns</div>
                <div className="text-xs text-muted-foreground">30-day return policy</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-1 gap-1 rounded-xl bg-muted p-1 sm:grid-cols-3">
              <TabsTrigger value="description" className="w-full">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="w-full">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="shipping" className="w-full">
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <div className="prose prose-sm max-w-none">
                <p className="leading-relaxed text-muted-foreground">
                  {product.description || "No description available for this product."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-4">
              <div className="space-y-3">
                {selectedVariation && (
                  <>
                    <div className="flex flex-col gap-1 border-b py-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-medium">SKU:</span>
                      <span className="rounded bg-muted px-2 py-1 font-mono text-sm">
                        {selectedVariation.sku}
                      </span>
                    </div>
                    {Object.entries(selectedVariation.attributes).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col gap-1 border-b py-2 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-medium capitalize">{key}:</span>
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </>
                )}
                <div className="flex flex-col gap-1 border-b py-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium">Categories:</span>
                  <span className="text-muted-foreground">
                    {product.categories.map((cat) => cat.name).join(", ")}
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-4">
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold">
                    <Truck className="h-4 w-4 text-primary" />
                    Delivery Information
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                      Free delivery within Nairobi for orders above KSh 50,000
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                      Standard delivery: 1-5 business days
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                      Express delivery: 1-2 business days (additional charges apply)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                      Assembly service available upon request
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    Return Policy
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                      30-day return policy for unused items
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                      Items must be in original packaging
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                      Return shipping costs may apply
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                      Refunds processed within 5-7 business days
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {product.faqs && product.faqs.length > 0 && (
          <section className="mt-10 sm:mt-12">
            <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {product.faqs.map((faq) => (
                <details key={faq.id} className="group rounded-lg border p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">
                    <span>{faq.question}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
