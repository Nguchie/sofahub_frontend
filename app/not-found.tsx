"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bold text-primary/20">404</div>
          <h1 className="text-3xl md:text-4xl font-bold">Page Not Found</h1>
          <p className="text-lg text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the
            wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Link>
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Popular Links */}
        <div className="pt-8 border-t border-border">
          <h2 className="text-lg font-semibold mb-4">Popular Pages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/category/living-room" className="text-primary hover:underline">
              Living Room
            </Link>
            <Link href="/category/bedroom" className="text-primary hover:underline">
              Bedroom
            </Link>
            <Link href="/category/dining-room" className="text-primary hover:underline">
              Dining Room
            </Link>
            <Link href="/category/office" className="text-primary hover:underline">
              Office
            </Link>
            <Link href="/about" className="text-primary hover:underline">
              About Us
            </Link>
            <Link href="/contact" className="text-primary hover:underline">
              Contact
            </Link>
            <Link href="/cart" className="text-primary hover:underline">
              Shopping Cart
            </Link>
            <Link href="/products" className="text-primary hover:underline">
              All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
