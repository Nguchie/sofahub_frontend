export function StructuredData() {
  const baseUrl = "https://sofahub.co.ke"
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SofaHub",
    "url": baseUrl,
    "logo": `${baseUrl}/sofahub-logo.png`,
    "description": "Your trusted destination for premium furniture in Kenya",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "areaServed": "KE",
      "availableLanguage": ["en"]
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SofaHub",
    "url": baseUrl,
    "description": "Quality furniture for every room in your home - Living Room, Dining Room, Bedroom, Office, and Fabrics & Accessories",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Main Navigation",
    "url": baseUrl,
    "hasPart": [
      {
        "@type": "SiteNavigationElement",
        "name": "Living Room",
        "url": `${baseUrl}/category/living-room`,
        "description": "Sofas, coffee tables, and entertainment units"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Dining Room",
        "url": `${baseUrl}/category/dining-room`,
        "description": "Dining tables, chairs, and storage"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Bedroom",
        "url": `${baseUrl}/category/bedroom`,
        "description": "Beds, wardrobes, and nightstands"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Office",
        "url": `${baseUrl}/category/office`,
        "description": "Desks, chairs, and storage solutions"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Fabrics & Accessories",
        "url": `${baseUrl}/category/fabrics-accessories`,
        "description": "Cushions, rugs, and decorative items"
      }
    ]
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Living Room",
        "url": `${baseUrl}/category/living-room`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Dining Room",
        "url": `${baseUrl}/category/dining-room`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Bedroom",
        "url": `${baseUrl}/category/bedroom`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Office",
        "url": `${baseUrl}/category/office`
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Fabrics & Accessories",
        "url": `${baseUrl}/category/fabrics-accessories`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  )
}

