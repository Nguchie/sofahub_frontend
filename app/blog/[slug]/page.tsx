import { BlogPostPage } from "@/components/blog/blog-post-page"
import type { Metadata } from "next"
import { blogApi } from "@/lib/api"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPost({ params }: BlogPostPageProps) {
  return <BlogPostPage slug={params.slug} />
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await blogApi.getBySlug(params.slug)
    return {
      title: `${post.title} - Sofahub Blog`,
      description: post.excerpt,
      alternates: { canonical: `/blog/${params.slug}` },
      robots: { index: true, follow: true },
      openGraph: { url: `/blog/${params.slug}` },
    }
  } catch {
    return {
      title: "Blog - Sofahub",
      alternates: { canonical: `/blog/${params.slug}` },
      robots: { index: true, follow: true },
    }
  }
}
