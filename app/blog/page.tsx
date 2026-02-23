import Link from "next/link"
import type { Metadata } from "next"
import { blogApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/json-ld"

export default async function BlogPage() {
  const posts = await blogApi.getAll().catch(() => [])
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "https://sofahub.co.ke/" },
    { name: "Blog", url: "https://sofahub.co.ke/blog" },
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={breadcrumbSchema} />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Our Blog</h1>
        <p className="text-lg text-muted-foreground">
          Discover furniture buying guides, care tips, and home styling ideas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-shadow">
            <Link href={`/blog/${post.slug}`}>
              {post.featured_image ? (
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={post.featured_image.image}
                    alt={post.featured_image.alt_text || post.title}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center">
                  <div className="text-primary/40 text-4xl font-bold">{post.title.charAt(0)}</div>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{post.author.name}</span>
                    <span>•</span>
                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                  </div>
                  {post.is_featured && (
                    <Badge variant="default" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: "Blog - Sofahub",
  description: "Latest tips and updates from Sofahub Kenya.",
  alternates: { canonical: "https://sofahub.co.ke/blog" },
  robots: { 
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: { 
    url: "https://sofahub.co.ke/blog",
    type: "website",
  },
}
