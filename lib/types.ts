export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  current_price: string
  base_price?: string
  is_on_sale: boolean
  primary_image: {
    id: number
    image: string
    alt_text: string
    is_primary: boolean
    order: number
  } | null
  categories: Category[]
  tags: Tag[]
  images?: ProductImage[]
  variations?: ProductVariation[]
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  color_code: string
}

export interface ProductImage {
  id: number
  image: string
  alt_text: string
  is_primary: boolean
}

export interface ProductVariation {
  id: number
  sku: string
  attributes: Record<string, string>
  price: string
  stock_quantity: number
}

export interface CartItem {
  id: number
  variation: {
    id: number
    product_name: string
    attributes: Record<string, string>
  }
  quantity: number
  unit_price: string
  total_price: string
}

export interface Cart {
  session_id: string
  items: CartItem[]
  total_items: number
  subtotal: string
  created_at?: string
  updated_at?: string
}

export interface CheckoutData {
  customer: {
    name: string
    email: string
    phone: string
  }
  shipping_address: {
    street: string
    city: string
    county: string
    postal_code?: string
  }
  payment_method: "mpesa"
  mpesa_phone?: string
}

export interface Order {
  id: number
  order_number: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  total: string
  created_at: string
  customer: CheckoutData["customer"]
  shipping_address: CheckoutData["shipping_address"]
  items: CartItem[]
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  content_type?: 'html' | 'text'
  featured_image?: {
    image: string
    alt_text: string
  }
  author: {
    name: string
    avatar?: string
  }
  published_at: string
  updated_at: string
  tags: Tag[]
  is_featured: boolean
}

export interface BlogListResponse {
  results: BlogPost[]
  count: number
  next?: string
  previous?: string
}
