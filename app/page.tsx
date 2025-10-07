import { HeroSection } from "@/components/home/hero-section"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { FeaturedProducts } from "@/components/home/featured-products"
import { WhyChooseUs } from "@/components/home/why-choose-us"

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
