import { CheckoutPage } from "@/components/checkout/checkout-page"
import type { Metadata } from "next"

export default function Checkout() {
  // In a real app, you'd check if cart has items server-side
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutPage />
    </div>
  )
}

export const metadata: Metadata = {
  title: "Checkout - Sofahub",
  description: "Complete your furniture purchase with secure M-Pesa payment",
  alternates: { canonical: "https://sofahub.co.ke/checkout" },
  robots: { 
    index: false, 
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    url: "https://sofahub.co.ke/checkout",
    type: "website",
  },
}
