import type { Metadata } from "next"
import { blogApi } from "@/lib/api"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/json-ld"
import { formatPrice } from "@/lib/currency"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const post = await blogApi.getBySlug(params.slug).catch(() => null)
  if (!post) {
    notFound()
  }

  const relatedPosts = await blogApi
    .getAll({ tags: post.tags.map((tag) => tag.slug).join(",") })
    .then((allPosts) => allPosts.filter((item) => item.id !== post.id).slice(0, 3))
    .catch(() => [])

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "https://sofahub.co.ke/" },
    { name: "Blog", url: "https://sofahub.co.ke/blog" },
    { name: post.title, url: `https://sofahub.co.ke/blog/${params.slug}` },
  ])

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    image: post.featured_image?.image ? [post.featured_image.image] : [],
    mainEntityOfPage: `https://sofahub.co.ke/blog/${params.slug}`,
    publisher: {
      "@type": "Organization",
      name: "SofaHub",
      logo: {
        "@type": "ImageObject",
        url: "https://sofahub.co.ke/sofahub-logo.png",
      },
    },
  }

  const readingMinutes = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <article className="mb-12">
          {post.featured_image && (
            <div className="relative aspect-video overflow-hidden rounded-xl mb-8 shadow-lg">
              <img
                src={post.featured_image.image}
                alt={post.featured_image.alt_text || post.title}
                className="object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            {post.is_featured && <Badge className="mb-4">Featured Post</Badge>}

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingMinutes} min read</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </header>

          {post.content_type === "html" ? (
            <div
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{post.content}</div>
            </div>
          )}
        </article>

        {post.related_products && post.related_products.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Products Mentioned In This Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {post.related_products.slice(0, 6).map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <Card className="group hover:shadow-lg transition-shadow h-full">
                    {product.primary_image?.image && (
                      <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={product.primary_image.image}
                          alt={product.primary_image.alt_text || product.name}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-primary font-semibold">{formatPrice(product.current_price)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="border rounded-lg p-4 hover:border-primary">
                  <h3 className="font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await blogApi.getBySlug(params.slug)
    return {
      title: `${post.title} - Sofahub Blog`,
      description: post.excerpt,
      alternates: { canonical: `https://sofahub.co.ke/blog/${params.slug}` },
      robots: { 
        index: true, 
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
      openGraph: { 
        url: `https://sofahub.co.ke/blog/${params.slug}`,
        type: "article",
      },
    }
  } catch {
    return {
      title: "Blog - Sofahub",
      alternates: { canonical: `https://sofahub.co.ke/blog/${params.slug}` },
      robots: { 
        index: true, 
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    }
  }
}
