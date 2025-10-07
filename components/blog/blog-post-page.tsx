"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import type { BlogPost } from "@/lib/types"
import { blogApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface BlogPostPageProps {
  slug: string
}

export function BlogPostPage({ slug }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await blogApi.getBySlug(slug)
        setPost(fetchedPost)
        
        // Fetch related posts (posts with similar tags)
        if (fetchedPost.tags.length > 0) {
          const tagSlugs = fetchedPost.tags.map(tag => tag.slug).join(',')
          const related = await blogApi.getAll({ tags: tagSlugs })
          // Filter out current post and limit to 3
          const filtered = related.filter(p => p.id !== fetchedPost.id).slice(0, 3)
          setRelatedPosts(filtered)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blog post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-6"></div>
            <div className="aspect-video bg-muted rounded-lg mb-8"></div>
            <div className="h-12 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Blog Post Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <Link href="/blog">
            <Button size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderContent = () => {
    if (post.content_type === 'html') {
      return (
        <div 
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      )
    } else {
      return (
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {post.content}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link href="/blog" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <article className="mb-12">
          {/* Featured image */}
          {post.featured_image && (
            <div className="aspect-video overflow-hidden rounded-xl mb-8 shadow-lg">
              <img
                src={post.featured_image.image}
                alt={post.featured_image.alt_text}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post header */}
          <header className="mb-8">
            {/* Featured badge */}
            {post.is_featured && (
              <Badge variant="default" className="mb-4">
                Featured Post
              </Badge>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatReadingTime(post.content)}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="secondary" 
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>

            <Separator className="mb-8" />
          </header>

          {/* Post content */}
          <div className="mb-12">
            {renderContent()}
          </div>

        </article>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <Card className="group hover:shadow-lg transition-shadow">
                    {relatedPost.featured_image && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={relatedPost.featured_image.image}
                          alt={relatedPost.featured_image.alt_text}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{relatedPost.author.name}</span>
                        <span>•</span>
                        <span>{formatDate(relatedPost.published_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to blog */}
        <div className="text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}