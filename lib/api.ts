import type { 
  Category, 
  Product, 
  ProductVariation, 
  Cart, 
  CartItem, 
  Order, 
  CheckoutData,
  BlogPost,
  Tag
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sofahubbackend-production.up.railway.app/api"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`)
  }

  return response.json()
}

// Product API functions
// Types are imported from ./types

export const productApi = {
  getAll: async (params?: { 
    category?: string; 
    search?: string; 
    tags?: string; 
    product_type?: string;
    min_price?: number;
    max_price?: number;
    on_sale?: boolean;
    ordering?: string;
  }) => {
    const searchParams = new URLSearchParams()
    // Backend expects `room` (slug) for room filter
    if (params?.category) searchParams.set("room", params.category)
    if (params?.search) searchParams.set("search", params.search)
    if (params?.tags) searchParams.set("tags", params.tags)
    if (params?.product_type) searchParams.set("product_type", params.product_type)
    if (params?.min_price) searchParams.set("min_price", params.min_price.toString())
    if (params?.max_price) searchParams.set("max_price", params.max_price.toString())
    if (params?.on_sale) searchParams.set("on_sale", "true")
    if (params?.ordering) searchParams.set("ordering", params.ordering)

    const query = searchParams.toString()
    const raw = await apiRequest<any[]>(`/products/${query ? `?${query}` : ""}`)
    return raw.map(transformProduct)
  },

  getBySlug: async (slug: string) => {
    const raw = await apiRequest<any>(`/products/${slug}/`)
    return transformProduct(raw)
  },
}

// Category API functions
export const categoryApi = {
  // Backend exposes room categories at /api/products/room-categories/
  getAll: () => apiRequest<Category[]>("/products/room-categories/"),
}

export const blogApi = {
  // Get all published blog posts
  getAll: (params?: { search?: string; featured?: boolean; tags?: string }) => {
    const queryParams = params ? new URLSearchParams(params as any).toString() : ""
    const url = queryParams ? `/blog/posts/?${queryParams}` : "/blog/posts/"
    return apiRequest<BlogPost[]>(url)
  },
  
  // Get a single blog post by slug
  getBySlug: (slug: string) => 
    apiRequest<BlogPost>(`/blog/posts/${slug}/`),
  
  // Get all blog tags
  getTags: () => 
    apiRequest<Tag[]>("/blog/tags/"),
}

// Product Type API functions
export const productTypeApi = {
  getAll: () => apiRequest<any[]>("/products/product-types/"),
}

// Tag API functions
export const tagApi = {
  getAll: () => apiRequest<any[]>("/products/tags/"),
}

// Cart API functions
export const cartApi = {
  get: (sessionId?: string) => {
    const params = sessionId ? `?session_id=${sessionId}` : ""
    return apiRequest<Cart>(`/cart/${params}`)
  },

  addItem: (data: { variation_id: number; quantity: number; session_id?: string }) =>
    apiRequest<CartItem>("/cart/add/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateItem: (itemId: number, data: { quantity: number }, sessionId?: string) => {
    const params = sessionId ? `?session_id=${sessionId}` : ""
    return apiRequest<CartItem>(`/cart/items/${itemId}/${params}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  removeItem: (itemId: number, sessionId?: string) => {
    const params = sessionId ? `?session_id=${sessionId}` : ""
    return apiRequest<void>(`/cart/items/${itemId}/delete/${params}`, {
      method: "DELETE",
    })
  },
}

// Order API functions
export const orderApi = {
  checkout: (data: CheckoutData & { session_id: string }) => {
    // Transform frontend data to match backend expectations
    const backendData = {
      customer_name: (data as any).customer.name,
      customer_email: (data as any).customer.email,
      customer_phone: (data as any).customer.phone,
      mpesa_phone: (data as any).mpesa_phone,
      shipping_address: (data as any).shipping_address.street,
      shipping_city: (data as any).shipping_address.city,
      shipping_zip_code: (data as any).shipping_address.postal_code || "",
      session_id: (data as any).session_id,
    }
    
    return apiRequest<Order>("/orders/checkout/", {
      method: "POST",
      body: JSON.stringify(backendData),
    })
  },

  getById: (id: number) =>
    apiRequest<Order>(`/orders/${id}/`),
}

export const contactApi = {
  async submitContactForm(data: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
  }) {
    return apiRequest<{ message: string; success: boolean }>("/contact/submit/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

export { ApiError }

// Map backend fields to frontend Product shape
function transformProduct(p: any): Product {
  const categories = p.categories ?? p.room_categories ?? []
  return {
    ...p,
    categories,
  }
}
