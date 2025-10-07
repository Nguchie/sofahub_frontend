"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Tag } from "lucide-react"
import type { Cart } from "@/lib/types"
import { formatPrice } from "@/lib/currency"
import { useState } from "react"

interface CartSummaryProps {
  cart: Cart
}

export function CartSummary({ cart }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const subtotal = Number.parseFloat(cart.subtotal)
  const deliveryFee = subtotal >= 50000 ? 0 : 2000 // Free delivery above KSh 50,000
  // Delivery fees are handled in person upon delivery - not included in online payment
  const total = subtotal

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    setIsApplyingPromo(true)
    // Simulate API call
    setTimeout(() => {
      setIsApplyingPromo(false)
      // For demo purposes, show error
      alert("Promo code not found")
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span>Subtotal ({cart.total_items} items)</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>

        {/* Delivery */}
        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="text-muted-foreground text-xs">
            {deliveryFee === 0 ? "FREE (Nairobi)" : "Paid on delivery"}
          </span>
        </div>

        {/* Delivery Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-sm font-medium text-amber-900">Delivery Policy</span>
          </div>
          <div className="text-xs text-amber-700 space-y-1">
            <div>• Orders above KSh 50,000 within Nairobi: <span className="font-medium text-green-600">FREE</span></div>
            <div>• Other locations: KSh 0 - 10,000 (paid on delivery)</div>
            <div>• Fee depends on location and product size</div>
            <div className="font-medium text-blue-600 mt-2">Delivery fees are NOT included in online payment</div>
          </div>
        </div>

        <Separator />

        {/* Promo Code */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={handleApplyPromo} disabled={!promoCode.trim() || isApplyingPromo}>
              <Tag className="h-4 w-4 mr-2" />
              {isApplyingPromo ? "..." : "Apply"}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>

        {/* Checkout Button */}
        <Button size="lg" className="w-full" asChild>
          <Link href="/checkout">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Proceed to Checkout
          </Link>
        </Button>

        {/* Continue Shopping */}
        <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>

        {/* Payment Methods */}
        <div className="pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground mb-2">We accept:</div>
          <div className="flex items-center gap-2">
            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">M-PESA</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
