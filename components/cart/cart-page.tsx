"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, ArrowLeft, Truck, Shield } from "lucide-react"
import { CartItem } from "./cart-item"
import { CartSummary } from "./cart-summary"
import { useCart } from "@/lib/cart-context"

export function CartPage() {
  const { cart, isLoading } = useCart()

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4" />
          <div className="h-4 bg-muted rounded w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded" />
              </div>
            ))}
          </div>
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like you haven't added any furniture to your cart yet. Start shopping to fill it up!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/category/living-room">Browse Living Room</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cart.total_items} {cart.total_items === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item, index) => (
                <div key={item.id}>
                  <CartItem item={item} />
                  {index < cart.items.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Truck className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Delivery Information</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Free delivery within Nairobi for orders above KSh 50,000
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Standard delivery: 3-5 business days • Express delivery: 1-2 business days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Summary */}
        <div className="space-y-6">
          <CartSummary cart={cart} />

          {/* Security Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Secure Checkout</div>
                  <div className="text-xs text-muted-foreground">SSL encrypted & M-Pesa secure</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
