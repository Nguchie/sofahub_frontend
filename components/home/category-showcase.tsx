import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    name: "Living Room",
    slug: "living-room",
    description: "Sofas, coffee tables, and entertainment units",
    image: "/images/categories/living-room.jpg",
    itemCount: "200+ items",
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    description: "Beds, wardrobes, and nightstands",
    image: "/images/categories/bedroom.jpg",
    itemCount: "150+ items",
  },
  {
    name: "Dining Room",
    slug: "dining-room",
    description: "Dining tables, chairs, and storage",
    image: "/images/categories/dining-room.jpg",
    itemCount: "100+ items",
  },
  {
    name: "Office",
    slug: "office",
    description: "Desks, chairs, and storage solutions",
    image: "/images/categories/office.jpg",
    itemCount: "80+ items",
  },
  {
    name: "Fabrics & Accessories",
    slug: "fabrics-accessories",
    description: "Cushions, rugs, and decorative items",
    image: "/images/categories/accessories.jpg",
    itemCount: "300+ items",
  },
]

export function CategoryShowcase() {
  return (
    <section className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find the perfect furniture for every room in your home. From modern living rooms to cozy bedrooms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Featured category - spans 2 columns on lg screens */}
        <Link href={`/category/${categories[0].slug}`} className="lg:col-span-2">
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
            <CardContent className="p-0 relative">
              <div className="aspect-[2/1] lg:aspect-[2/1] bg-muted">
                <img
                  src={categories[0].image || "/placeholder.svg"}
                  alt={categories[0].name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{categories[0].name}</h3>
                <p className="text-white/90 mb-2">{categories[0].description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span>{categories[0].itemCount}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Other categories */}
        {categories.slice(1).map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`}>
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
              <CardContent className="p-0 relative">
                <div className="aspect-square bg-muted">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                  <p className="text-white/90 text-sm mb-1">{category.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span>{category.itemCount}</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
