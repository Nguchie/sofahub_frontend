import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname
  const siteDisabled = process.env.SITE_DISABLED === 'true'

  if (siteDisabled) {
    const disabledResponse = new NextResponse(
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>403 | Temporarily Unavailable</title>
    <style>
      :root {
        color-scheme: light;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        font-family: Arial, sans-serif;
        background: #f5f1eb;
        color: #1f1a17;
      }
      main {
        width: 100%;
        max-width: 640px;
        background: #ffffff;
        border: 1px solid #e3d9cc;
        border-radius: 20px;
        padding: 40px 32px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(31, 26, 23, 0.08);
      }
      .code {
        display: inline-block;
        margin-bottom: 16px;
        padding: 8px 14px;
        border-radius: 999px;
        background: #efe3d3;
        color: #7a4b22;
        font-weight: 700;
        letter-spacing: 0.08em;
      }
      h1 {
        margin: 0 0 16px;
        font-size: clamp(2rem, 5vw, 3.5rem);
      }
      p {
        margin: 0 auto;
        max-width: 42ch;
        font-size: 1rem;
        line-height: 1.6;
        color: #5f5348;
      }
    </style>
  </head>
  <body>
    <main>
      <div class="code">403</div>
      <h1>Site temporarily unavailable</h1>
      <p>
        SofaHub is temporarily offline. Please check back later.
      </p>
    </main>
  </body>
</html>`,
      {
        status: 403,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store, no-cache, must-revalidate',
        },
      }
    )

    return disabledResponse
  }

  const hostname = request.headers.get('host') || ''
  
  // Remove port for comparison
  const hostnameWithoutPort = hostname.split(':')[0]
  const isLocalhost =
    hostnameWithoutPort === 'localhost' ||
    hostnameWithoutPort === '127.0.0.1' ||
    hostnameWithoutPort === '::1'
  const hasWww = hostnameWithoutPort.startsWith('www.')
  const isHttp = url.protocol === 'http:'
  
  // Check for trailing slash (except root path)
  const hasTrailingSlash = pathname !== '/' && pathname.endsWith('/')
  
  // Determine the correct hostname
  let correctHostname = hostnameWithoutPort
  if (hasWww) {
    correctHostname = hostnameWithoutPort.replace('www.', '')
  }
  
  // Preserve port if it exists
  const port = hostname.includes(':') ? hostname.split(':')[1] : ''
  const finalHostname = port ? `${correctHostname}:${port}` : correctHostname
  
  // Build the correct pathname (remove trailing slash if present, except for root)
  let correctPathname = pathname
  if (hasTrailingSlash) {
    correctPathname = pathname.slice(0, -1)
  }
  
  // Check if we need to redirect for www/http/trailing slash
  if (!isLocalhost && (hasWww || isHttp || hasTrailingSlash)) {
    // Build the correct URL with https, non-www, and no trailing slash
    const correctUrl = new URL(correctPathname + url.search, `https://${finalHostname}`)
    
    return NextResponse.redirect(correctUrl, 301) // Permanent redirect
  }

  // Check for backend redirects (only for product, category, and blog paths)
  // This helps preserve SEO when slugs change
  const pathPatterns = ['/product/', '/category/', '/blog/']
  const shouldCheckRedirect = pathPatterns.some(pattern => correctPathname.startsWith(pattern))
  
  if (shouldCheckRedirect && correctPathname !== '/') {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sofahubbackend-production.up.railway.app/api"
      const redirectResponse = await fetch(`${API_BASE_URL}/redirects${correctPathname}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        // Use a short timeout to avoid blocking requests
        signal: AbortSignal.timeout(1000),
      })
      
      if (redirectResponse.ok) {
        const redirectData = await redirectResponse.json()
        if (redirectData.new_path && redirectData.new_path !== correctPathname) {
          const redirectUrl = new URL(redirectData.new_path + url.search, `https://${finalHostname}`)
          return NextResponse.redirect(redirectUrl, 301) // Permanent redirect
        }
      }
    } catch (error) {
      // If redirect check fails, continue with normal request
      // Don't block the request if redirect API is unavailable
      console.error('Redirect check failed:', error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml, manifest.json, and common verification files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|googlec3f0f7f321c1e93b.html|apple-touch-icon.png).*)',
  ],
}


