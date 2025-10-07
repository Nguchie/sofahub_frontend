import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "SofaHub - Quality Furniture in Kenya",
  description:
    "Discover premium furniture for your home. Living room, bedroom, dining, and office furniture with M-Pesa payment options.",
  generator: "v0.app",
  keywords: "furniture, Kenya, Nairobi, M-Pesa, home decor, living room, bedroom, dining room, office furniture",
  authors: [{ name: "SofaHub" }],
  openGraph: {
    title: "SofaHub - Quality Furniture in Kenya",
    description: "Discover premium furniture for your home with secure M-Pesa payments and free delivery.",
    type: "website",
    locale: "en_KE",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ErrorBoundary>
          <CartProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </Suspense>
            <Toaster />
          </CartProvider>
        </ErrorBoundary>
        <Analytics />
        
        {/* Tawk.to Chatbot Script */}
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/68e4cf8ca72e351952184f5b/1j6uslfvg';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
