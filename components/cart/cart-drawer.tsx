"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, X, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/currency"

export function CartDrawer() {
  const { cart, updateQuantity, removeFromCart, isLoading } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  console.log("[v0] Cart state:", { cart, isLoading })

  const subtotal = cart ? Number.parseFloat(cart.subtotal) : 0
  const deliveryFee = subtotal >= 50000 ? 0 : 2000
  // Delivery fees are handled in person upon delivery - not included in online payment
  const total = subtotal
  const itemCount = cart?.total_items || 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            Shopping Cart
            <span className="text-sm font-normal text-muted-foreground">{itemCount} items</span>
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading cart...</p>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Add some furniture to get started!</p>
            <Button onClick={() => setIsOpen(false)} asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items - Scrollable Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.variation.product_image || "/placeholder.svg"}
                        alt={item.variation.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{item.variation.product_name}</h4>

                      {Object.entries(item.variation.attributes).length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Object.entries(item.variation.attributes).map(([key, value]) => {
                            // Parse value if it's a string that might be JSON
                            let displayValue = value
                            if (typeof value === 'string') {
                              try {
                                const parsed = JSON.parse(value)
                                displayValue = parsed
                              } catch {
                                displayValue = value
                              }
                            }
                            return (
                            <Badge key={key} variant="secondary" className="text-xs">
                                {key.charAt(0).toUpperCase() + key.slice(1)}: {String(displayValue).charAt(0).toUpperCase() + String(displayValue).slice(1)}
                            </Badge>
                            )
                          })}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm px-2 min-w-[2rem] text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{formatPrice(item.total_price)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Cart Summary at Bottom */}
            <div className="border-t bg-background px-6 py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span className="text-muted-foreground text-xs">
                    {deliveryFee === 0 ? "FREE (Nairobi)" : "Paid on delivery"}
                  </span>
                </div>
                
                {/* Delivery Info */}
                <div className="text-xs text-muted-foreground bg-amber-50 p-2 rounded">
                  <div>• Above KSh 50,000 in Nairobi: FREE</div>
                  <div>• Other locations: KSh 0-10,000 (paid on delivery)</div>
                  <div className="font-medium text-blue-600 mt-1">Not included in online payment</div>
                </div>
                
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="lg" onClick={() => setIsOpen(false)} asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)} asChild>
                  <Link href="/cart">View Full Cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
