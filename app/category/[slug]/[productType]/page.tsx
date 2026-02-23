import { ProductCatalog } from "@/components/products/product-catalog"
import { categoryApi, productTypeApi } from "@/lib/api"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/json-ld"

interface SubcategoryPageProps {
  params: {
    slug: string
    productType: string
  }
  searchParams: {
    search?: string
    tags?: string
    sort?: string
    page?: string
  }
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const categories = await categoryApi.getAll().catch(() => [])
  const room = categories.find((cat) => cat.slug === params.slug)
  if (!room) {
    notFound()
  }

  const productTypes = await productTypeApi.getAll({ room_category: params.slug }).catch(() => [])
  const currentType = productTypes.find((type: any) => type.slug === params.productType)
  if (!currentType) {
    notFound()
  }

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "https://sofahub.co.ke/" },
    { name: room.name, url: `https://sofahub.co.ke/category/${params.slug}` },
    { name: currentType.name, url: `https://sofahub.co.ke/category/${params.slug}/${params.productType}` },
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={breadcrumbSchema} />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {currentType.name} in {room.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          Shop our curated {currentType.name.toLowerCase()} collection with delivery across Nairobi and Kenya.
        </p>
      </div>

      <ProductCatalog category={params.slug} productType={params.productType} searchParams={searchParams} />
    </div>
  )
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const categories = await categoryApi.getAll().catch(() => [])
  const room = Array.isArray(categories) ? categories.find((cat) => cat.slug === params.slug) : undefined
  const productTypes = await productTypeApi.getAll({ room_category: params.slug }).catch(() => [])
  const productType = Array.isArray(productTypes) ? productTypes.find((type: any) => type.slug === params.productType) : undefined

  const roomName = room?.name || params.slug.replace(/-/g, " ")
  const typeName = productType?.name || params.productType.replace(/-/g, " ")
  const canonical = `https://sofahub.co.ke/category/${params.slug}/${params.productType}`

  return {
    title: `${typeName} - ${roomName} Furniture | SofaHub Kenya`,
    description: `Browse ${typeName.toLowerCase()} in our ${roomName.toLowerCase()} collection. Quality furniture with M-Pesa payments and delivery options across Kenya.`,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: `${typeName} - ${roomName} Furniture | SofaHub`,
      description: `Shop ${typeName.toLowerCase()} in ${roomName.toLowerCase()} from SofaHub Kenya.`,
      url: canonical,
      type: "website",
    },
  }
}
