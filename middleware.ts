import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
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
  const pathname = url.pathname
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}


