import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  Clock, 
  Smartphone, 
  Truck, 
  Package,
  ArrowLeft,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/currency"
import { orderApi } from "@/lib/api"
import { OrderStatus } from "@/components/orders/order-status"

interface OrderConfirmationPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: OrderConfirmationPageProps): Promise<Metadata> {
  return {
    title: `Order Confirmation #${params.id} | Sofa Hub Kenya`,
    description: `Order confirmation and payment status for order #${params.id}`,
  }
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  let order
  try {
    order = await orderApi.getById(parseInt(params.id))
  } catch (error) {
    notFound()
  }

  if (!order) {
    notFound()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'payment_failed':
        return <Smartphone className="w-5 h-5 text-red-600" />
      case 'cancelled':
        return <Package className="w-5 h-5 text-gray-600" />
      default:
        return <Clock className="w-5 h-5 text-blue-600" />
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'confirmed':
        return "Payment confirmed! We'll contact you soon to arrange delivery."
      case 'pending':
        return "Waiting for payment confirmation. Please complete the M-Pesa payment on your phone."
      case 'payment_failed':
        return "Payment failed. Please try again or contact our support team."
      case 'cancelled':
        return "Order was cancelled. Please contact our support team if you need assistance."
      default:
        return "Processing your order..."
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {getStatusIcon(order.status)}
            <h1 className="text-3xl font-bold">Order Confirmation</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Order #{order.id} - {order.customer_name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge variant={order.status === 'confirmed' ? 'default' : 'secondary'}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Payment:</span>
                    <span className={order.payment_confirmed ? "text-green-600" : "text-yellow-600"}>
                      {order.payment_confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getStatusMessage(order.status)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatPrice(item.unit_price)}
                        </p>
                      </div>
                      <span className="font-medium">{formatPrice(item.total_price)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{order.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{order.customer_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{order.customer_phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium">{order.shipping_address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">City:</span>
                    <span className="font-medium">{order.shipping_city}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({order.total_items} items):</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Deposit (50%):</span>
                    <span className="font-medium">{formatPrice(order.deposit_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Balance (on delivery):</span>
                    <span className="font-medium">{formatPrice(order.remaining_amount)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Delivery Information</span>
                  </div>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>• Delivery fees are NOT included in online payment</div>
                    <div>• Free delivery for orders above KSh 50,000 in Nairobi</div>
                    <div>• Other locations: KSh 0-10,000 (paid on delivery)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            {order.status === 'pending' && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-900">Payment Instructions</CardTitle>
                </CardHeader>
                <CardContent className="text-yellow-800">
                  <div className="space-y-2 text-sm">
                    <p>1. Check your phone for an M-Pesa prompt</p>
                    <p>2. Enter your M-Pesa PIN to complete payment</p>
                    <p>3. You'll receive a confirmation message</p>
                    <p>4. We'll contact you to arrange delivery</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>Contact our support team:</p>
                  <p className="font-medium">Phone: 0717 160 845</p>
                  <p className="font-medium">Email: sofahub68@gmail.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
