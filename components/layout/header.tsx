"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useEffect, useState } from "react"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { productTypeApi } from "@/lib/api"

const staticNavigation = [
  { name: "Blog", href: "/blog" },
  { name: "Delivery Info", href: "/delivery" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
]

const fallbackCategories = [
  { name: "Living Room", slug: "living-room", subcategories: [] as { name: string; slug: string }[] },
  { name: "Dining Room", slug: "dining-room", subcategories: [] as { name: string; slug: string }[] },
  { name: "Bedroom", slug: "bedroom", subcategories: [] as { name: string; slug: string }[] },
  { name: "Office", slug: "office", subcategories: [] as { name: string; slug: string }[] },
  { name: "Fabrics & Accessories", slug: "fabrics-accessories", subcategories: [] as { name: string; slug: string }[] },
]

export function Header() {
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)
  const [categoryNavigation, setCategoryNavigation] = useState(fallbackCategories)

  useEffect(() => {
    const loadCategoryNavigation = async () => {
      try {
        const navData = await Promise.all(
          fallbackCategories.map(async (category) => {
            const types = await productTypeApi.getAll({ room_category: category.slug }).catch(() => [])
            return {
              name: category.name,
              slug: category.slug,
              subcategories: Array.isArray(types)
                ? types.map((type) => ({ name: type.name, slug: type.slug }))
                : [],
            }
          }),
        )
        if (navData.length > 0) {
          setCategoryNavigation(navData)
        }
      } catch (error) {
        console.error("Failed to load navbar categories:", error)
      }
    }

    loadCategoryNavigation()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/sofahub-logo.png"
              alt="Sofa Hub Kenya"
              width={160}
              height={60}
              className="h-12 w-auto"
            />
          </Link>

          {/* Search bar - hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Cart and mobile menu */}
          <div className="flex items-center gap-4">
            {/* Updated cart link with CartDrawer component */}
            <CartDrawer />

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden bg-transparent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Navigation */}
        <nav className={`${isMenuOpen ? "block" : "hidden"} md:block border-t border-border md:border-t-0`}>
          <ul className="flex flex-col md:flex-row md:items-center md:justify-center gap-0 md:gap-5 py-4 md:py-3">
            {categoryNavigation.map((item) => (
              <li
                key={item.slug}
                className="relative"
                onMouseEnter={() => {
                  if (window.innerWidth >= 768 && item.subcategories.length > 0) {
                    setOpenDesktopDropdown(item.slug)
                  }
                }}
                onMouseLeave={() => {
                  if (window.innerWidth >= 768) setOpenDesktopDropdown(null)
                }}
              >
                <div className="flex items-center md:gap-1">
                  <Link
                    href={`/category/${item.slug}`}
                    className="block py-2 md:py-0 text-foreground hover:text-primary transition-colors font-medium whitespace-nowrap"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.subcategories.length > 0 && (
                    <button
                      type="button"
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => {
                        if (window.innerWidth >= 768) {
                          setOpenDesktopDropdown(item.slug)
                        } else {
                          setOpenMobileDropdown(openMobileDropdown === item.slug ? null : item.slug)
                        }
                      }}
                      aria-label={`Toggle ${item.name} subcategories`}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${openDesktopDropdown === item.slug || openMobileDropdown === item.slug ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>

                {item.subcategories.length > 0 && openDesktopDropdown === item.slug && (
                  <div className="hidden md:block absolute top-full left-0 mt-0 min-w-[240px] rounded-md border bg-background shadow-lg p-2 z-50">
                    {item.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/category/${item.slug}/${sub.slug}`}
                        className="block px-3 py-2 rounded hover:bg-muted text-sm"
                        onClick={() => {
                          setOpenDesktopDropdown(null)
                          setIsMenuOpen(false)
                        }}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}

                {item.subcategories.length > 0 && openMobileDropdown === item.slug && (
                  <div className="md:hidden pl-4 pb-2">
                    {item.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/category/${item.slug}/${sub.slug}`}
                        className="block py-1 text-sm text-muted-foreground hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}

            {staticNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="block py-2 md:py-0 text-foreground hover:text-primary transition-colors font-medium whitespace-nowrap"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
