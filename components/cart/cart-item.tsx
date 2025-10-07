"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, Heart } from "lucide-react"
import type { CartItem as CartItemType } from "@/lib/types"
import { formatPrice } from "@/lib/currency"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/hooks/use-toast"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    try {
      await updateQuantity(item.id, newQuantity)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    try {
      await removeFromCart(item.id)
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-4">
      {/* Product Image */}
      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
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

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">
              <Link href="#" className="hover:text-primary transition-colors">
                {item.variation.product_name}
              </Link>
            </h3>

            {/* Variation attributes */}
            {Object.entries(item.variation.attributes).length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {Object.entries(item.variation.attributes).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-primary">{formatPrice(item.unit_price)}</span>
              <span className="text-sm text-muted-foreground">each</span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1 || isUpdating}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-3 py-1 text-sm min-w-[40px] text-center">{isUpdating ? "..." : item.quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="text-right ml-4">
            <div className="font-bold text-lg">{formatPrice(item.total_price)}</div>
            {item.quantity > 1 && (
              <div className="text-xs text-muted-foreground">
                {item.quantity} × {formatPrice(item.unit_price)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
