import { CheckoutPage } from "@/components/checkout/checkout-page"

export default function Checkout() {
  // In a real app, you'd check if cart has items server-side
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutPage />
    </div>
  )
}

export const metadata = {
  title: "Checkout - FurniStore",
  description: "Complete your furniture purchase with secure M-Pesa payment",
}
