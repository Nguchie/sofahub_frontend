import { HeroSection } from "@/components/home/hero-section"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { FeaturedProducts } from "@/components/home/featured-products"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import type { Metadata } from "next"

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts />
      <WhyChooseUs />
    </div>
  )
}

export const metadata: Metadata = {
  title: "SofaHub - Quality Furniture in Kenya",
  description: "Discover premium furniture for your home. Living room, bedroom, dining, and office furniture.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
}
