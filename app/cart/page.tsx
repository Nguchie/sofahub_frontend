import { CartPage } from "@/components/cart/cart-page"

export default function Cart() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CartPage />
    </div>
  )
}

export const metadata = {
  title: "Shopping Cart - FurniStore",
  description: "Review your selected furniture items before checkout",
}
