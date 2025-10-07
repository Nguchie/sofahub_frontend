"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckoutSteps } from "./checkout-steps"
import { CustomerInfoForm } from "./customer-info-form"
import { ShippingForm } from "./shipping-form"
import { PaymentForm } from "./payment-form"
import { OrderSummary } from "./order-summary"
import { useCart } from "@/lib/cart-context"
import type { CheckoutData } from "@/lib/types"
import { orderApi } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export function CheckoutPage() {
  const router = useRouter()
  const { cart, getSessionId, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutData, setCheckoutData] = useState<Partial<CheckoutData>>({
    payment_method: "mpesa",
  })

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      router.push("/cart")
    }
  }, [cart, router])

  if (!cart || cart.items.length === 0) {
    return null
  }

  const steps = [
    { number: 1, title: "Customer Info", description: "Your contact details" },
    { number: 2, title: "Shipping", description: "Delivery address" },
    { number: 3, title: "Payment", description: "M-Pesa payment" },
    { number: 4, title: "Review", description: "Confirm your order" },
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCustomerInfoSubmit = (data: CheckoutData["customer"]) => {
    setCheckoutData((prev) => ({ ...prev, customer: data }))
    handleNext()
  }

  const handleShippingSubmit = (data: CheckoutData["shipping_address"]) => {
    setCheckoutData((prev) => ({ ...prev, shipping_address: data }))
    handleNext()
  }

  const handlePaymentSubmit = (data: { mpesa_phone: string }) => {
    setCheckoutData((prev) => ({ ...prev, mpesa_phone: data.mpesa_phone }))
    handleNext()
  }

  const handlePlaceOrder = async () => {
    if (!checkoutData.customer || !checkoutData.shipping_address || !checkoutData.mpesa_phone) {
      toast({
        title: "Missing information",
        description: "Please complete all checkout steps before placing your order.",
        variant: "destructive",
      })
      return
    }

    // Validate phone number format
    const phoneRegex = /^(\+254|254|0)[17]\d{8}$/
    if (!phoneRegex.test(checkoutData.mpesa_phone.replace(/\s/g, ''))) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Kenyan phone number (e.g., +254 700 123 456 or 0700 123 456).",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const orderData: CheckoutData & { session_id: string } = {
        customer: checkoutData.customer,
        shipping_address: checkoutData.shipping_address,
        payment_method: "mpesa",
        mpesa_phone: checkoutData.mpesa_phone,
        session_id: getSessionId(),
      }

      const order = await orderApi.checkout(orderData)

      // Clear the cart after successful order placement
      await clearCart()

      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id} has been placed. Check your phone for M-Pesa prompt to complete deposit payment.`,
      })

      // Redirect to order confirmation
      router.push(`/order-confirmation/${order.id}`)
    } catch (error: any) {
      console.error("Checkout error:", error)
      
      let errorMessage = "There was an error processing your order. Please try again."
      
      if (error?.message) {
        if (error.message.includes("phone")) {
          errorMessage = "Please check your phone number and try again."
        } else if (error.message.includes("cart")) {
          errorMessage = "Your cart appears to be empty. Please add items and try again."
        } else if (error.message.includes("payment")) {
          errorMessage = "Payment initiation failed. Please check your phone number and try again."
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "Order failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase in a few simple steps</p>
      </div>

      {/* Steps */}
      <CheckoutSteps steps={steps} currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <CustomerInfoForm initialData={checkoutData.customer} onSubmit={handleCustomerInfoSubmit} />
              )}

              {currentStep === 2 && (
                <ShippingForm
                  initialData={checkoutData.shipping_address}
                  onSubmit={handleShippingSubmit}
                  onBack={handlePrevious}
                />
              )}

              {currentStep === 3 && (
                <PaymentForm
                  initialData={{ mpesa_phone: checkoutData.mpesa_phone || "" }}
                  onSubmit={handlePaymentSubmit}
                  onBack={handlePrevious}
                />
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Order Review</h3>

                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">CUSTOMER INFORMATION</h4>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="font-medium">{checkoutData.customer?.name}</p>
                          <p className="text-sm text-muted-foreground">{checkoutData.customer?.email}</p>
                          <p className="text-sm text-muted-foreground">{checkoutData.customer?.phone}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">SHIPPING ADDRESS</h4>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p>{checkoutData.shipping_address?.street}</p>
                          <p>
                            {checkoutData.shipping_address?.city}, {checkoutData.shipping_address?.county}
                          </p>
                          {checkoutData.shipping_address?.postal_code && (
                            <p>{checkoutData.shipping_address.postal_code}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">PAYMENT METHOD</h4>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">M-PESA</div>
                            <span>{checkoutData.mpesa_phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handlePrevious}>
                      Back
                    </Button>
                    <Button onClick={handlePlaceOrder} disabled={isProcessing} className="flex-1">
                      {isProcessing ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
