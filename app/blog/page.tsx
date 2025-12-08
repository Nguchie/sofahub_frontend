import { BlogListPage } from "@/components/blog/blog-list-page"
import type { Metadata } from "next"

export default function BlogPage() {
  return <BlogListPage />
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
