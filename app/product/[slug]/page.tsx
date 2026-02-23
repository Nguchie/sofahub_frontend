import { ProductDetail } from "@/components/products/product-detail"
import { RelatedProducts } from "@/components/products/related-products"
import { blogApi, productApi } from "@/lib/api"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/json-ld"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await productApi.getBySlug(params.slug)
    const blogPosts = await blogApi.getAll({ product: params.slug }).catch(() => [])
    const canonicalUrl = `https://sofahub.co.ke/product/${params.slug}`

    const variationPrices =
      product.variations?.map((variation) => Number.parseFloat(variation.price)).filter((value) => !Number.isNaN(value)) || []
    const lowPrice =
      variationPrices.length > 0 ? Math.min(...variationPrices) : Number.parseFloat(product.current_price || "0")
    const highPrice =
      variationPrices.length > 0 ? Math.max(...variationPrices) : Number.parseFloat(product.current_price || "0")
    const inStock =
      product.variations?.some((variation) => variation.stock_quantity > 0) ?? true

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description || "",
      sku: product.variations?.[0]?.sku || `product-${product.id}`,
      image: product.primary_image?.image ? [product.primary_image.image] : [],
      category: product.categories?.[0]?.name || "Furniture",
      brand: {
        "@type": "Brand",
        name: "SofaHub",
      },
      offers:
        variationPrices.length > 1
          ? {
              "@type": "AggregateOffer",
              url: canonicalUrl,
              priceCurrency: "KES",
              lowPrice: lowPrice.toFixed(2),
              highPrice: highPrice.toFixed(2),
              offerCount: variationPrices.length,
              availability: inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            }
          : {
              "@type": "Offer",
              url: canonicalUrl,
              priceCurrency: "KES",
              price: lowPrice.toFixed(2),
              availability: inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
            },
    }

    const breadcrumbItems = [
      { name: "Home", url: "https://sofahub.co.ke/" },
      {
        name: product.categories?.[0]?.name || "Furniture",
        url: `https://sofahub.co.ke/category/${product.categories?.[0]?.slug || ""}`,
      },
    ]
    if (product.product_types?.[0]?.slug && product.categories?.[0]?.slug) {
      breadcrumbItems.push({
        name: product.product_types[0].name,
        url: `https://sofahub.co.ke/category/${product.categories[0].slug}/${product.product_types[0].slug}`,
      })
    }
    breadcrumbItems.push({ name: product.name, url: canonicalUrl })
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems)

    const faqSchema =
      product.faqs && product.faqs.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: product.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }
        : null

    return (
      <div className="container mx-auto px-4 py-8">
        <JsonLd data={productSchema} />
        <JsonLd data={breadcrumbSchema} />
        {faqSchema && <JsonLd data={faqSchema} />}
        <ProductDetail product={product} />
        {blogPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Buying Guides For This Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogPosts.slice(0, 4).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="border rounded-lg p-4 hover:border-primary hover:bg-muted/40 transition-colors"
                >
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
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
      title: `${product.name} - Sofahub`,
      description:
        product.description || `Buy ${product.name} at Sofahub. Quality furniture with M-Pesa payment options.`,
      alternates: {
        canonical: `https://sofahub.co.ke/product/${params.slug}`,
      },
      openGraph: {
        title: product.name,
        description: product.description,
        url: `https://sofahub.co.ke/product/${params.slug}`,
        images: product.primary_image?.image ? [product.primary_image.image] : [],
      },
      robots: { 
        index: true, 
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    }
  } catch (error) {
    return {
      title: "Product Not Found - Sofahub",
      robots: { index: false, follow: false },
    }
  }
}
