import { HeroSection } from "@/components/home/hero-section"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { FeaturedProducts } from "@/components/home/featured-products"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { StructuredData } from "@/components/seo/structured-data"
import type { Metadata } from "next"

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <div className="space-y-16">
        <HeroSection />
        <CategoryShowcase />
        <FeaturedProducts />
        <WhyChooseUs />
      </div>
    </>
  )
}

export const metadata: Metadata = {
  title: "SofaHub - Quality Furniture in Kenya | Living Room, Bedroom, Dining & Office Furniture",
  description: "Your trusted destination for premium furniture in Kenya. Discover quality furniture for every room in your home - Living Room, Dining Room, Bedroom, Office, and Fabrics & Accessories. Secure M-Pesa payments and free Nairobi delivery.",
  alternates: { canonical: "https://sofahub.co.ke/" },
  robots: { 
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "SofaHub - Quality Furniture in Kenya",
    description: "Your trusted destination for premium furniture in Kenya. Discover quality furniture for every room in your home.",
    url: "https://sofahub.co.ke/",
    siteName: "SofaHub",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "SofaHub - Quality Furniture in Kenya",
    description: "Your trusted destination for premium furniture in Kenya.",
  },
}
