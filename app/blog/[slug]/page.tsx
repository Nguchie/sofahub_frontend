import { BlogPostPage } from "@/components/blog/blog-post-page"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPost({ params }: BlogPostPageProps) {
  return <BlogPostPage slug={params.slug} />
}
