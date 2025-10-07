import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { Cart } from "@/lib/types"
import { formatPrice } from "@/lib/currency"

interface OrderSummaryProps {
  cart: Cart
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  const subtotal = Number.parseFloat(cart.subtotal)
  const deliveryFee = subtotal >= 50000 ? 0 : 2000
  // Delivery fees are handled in person upon delivery - not included in online payment
  const total = subtotal

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
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
                {Object.entries(item.variation.attributes)
                  .filter(([key]) => key.toLowerCase() !== 'sku' && key.toLowerCase() !== 'modifier')
                  .length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {Object.entries(item.variation.attributes)
                      .filter(([key]) => key.toLowerCase() !== 'sku' && key.toLowerCase() !== 'modifier')
                      .map(([key, value]) => {
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
                  <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                  <span className="font-medium text-sm">{formatPrice(item.total_price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({cart.total_items} items)</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            <span className="text-muted-foreground text-xs">
              {deliveryFee === 0 ? "FREE (Nairobi)" : "Paid on delivery"}
            </span>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-sm font-medium text-amber-900">Delivery Information</span>
          </div>
          <div className="text-xs text-amber-700 space-y-1">
            <div>• Orders above KSh 50,000 within Nairobi: <span className="font-medium text-green-600">FREE delivery</span></div>
            <div>• Other locations: KSh 0 - 10,000 (paid on delivery)</div>
            <div>• Delivery fee depends on location and product size</div>
            <div className="font-medium text-blue-600 mt-2">Delivery fees are NOT included in online payment</div>
          </div>
        </div>

        <Separator />

        {/* Downpayment Information */}
        <div className="space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-900">Downpayment Plan</span>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <div className="flex justify-between">
                <span>Deposit (50% of items):</span>
                <span className="font-medium">{formatPrice(Number.parseFloat(cart.subtotal) / 2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Balance + Delivery (on delivery):</span>
                <span className="font-medium">{formatPrice(Number.parseFloat(cart.subtotal) / 2)} + Delivery Fee</span>
              </div>
              <div className="text-xs text-amber-600 mt-2 pt-2 border-t border-blue-200">
                Note: Delivery fees are charged separately upon delivery
              </div>
            </div>
          </div>
          
          <div className="flex justify-between text-lg font-bold">
            <span>Pay Now (Deposit)</span>
            <span className="text-primary">{formatPrice(Number.parseFloat(cart.subtotal) / 2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground mb-2">Payment Method:</div>
          <div className="flex items-center gap-2">
            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">M-PESA</div>
            <span className="text-sm">Mobile Money Payment</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
