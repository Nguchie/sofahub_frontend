import { ProductDetail } from "@/components/products/product-detail"
import { RelatedProducts } from "@/components/products/related-products"
import { productApi } from "@/lib/api"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await productApi.getBySlug(params.slug)

    return (
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
        <div className="mt-16">
          <RelatedProducts currentProductId={product.id} categories={product.categories} />
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await productApi.getBySlug(params.slug)

    return {
      title: `${product.name} - FurniStore`,
      description:
        product.description || `Buy ${product.name} at FurniStore. Quality furniture with M-Pesa payment options.`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [product.primary_image.image],
      },
    }
  } catch (error) {
    return {
      title: "Product Not Found - FurniStore",
    }
  }
}
