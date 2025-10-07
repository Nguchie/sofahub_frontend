# Backend API Endpoints Reference

## Products API (`/api/products/`)

### Product List & Detail
- `GET /api/products/` - List products with filters
  - Query params: `room`, `product_type`, `tags`, `min_price`, `max_price`, `on_sale`, `search`, `ordering`
  - Returns: `ProductListSerializer` (id, name, slug, current_price, is_on_sale, discount_percentage, primary_image, room_categories, product_types, categories)

- `GET /api/products/<slug>/` - Product detail
  - Returns: `ProductSerializer` (full product with variations, images, tags, etc.)

### Taxonomy Endpoints
- `GET /api/products/room-categories/` - Room categories (Living Room, Bedroom, etc.)
- `GET /api/products/product-types/` - Product types (Sofas, Chairs, etc.)
- `GET /api/products/product-types/room/<room_slug>/` - Product types for specific room
- `GET /api/products/tags/` - Available tags (On Sale, Bestseller, etc.)

## Cart API (`/api/cart/`)

- `GET /api/cart/` - Get cart (with session_id param)
- `POST /api/cart/add/` - Add item to cart
  - Body: `{ variation_id: int, quantity: int, session_id: string }`
- `PATCH /api/cart/items/<item_id>/` - Update cart item quantity
- `DELETE /api/cart/items/<item_id>/delete/` - Remove cart item

## Orders API (`/api/orders/`)

- `POST /api/orders/checkout/` - Create order and initiate M-Pesa payment
  - Body: `{ customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_zip_code, session_id }`
- `GET /api/orders/<id>/` - Get order details

## Frontend Implementation Status

✅ **Implemented & Aligned:**
- Product list with all backend filters
- Product detail with variations
- Cart operations (add, update, remove)
- Checkout flow with M-Pesa
- Room categories and product types
- Tags filtering

⚠️ **Needs Verification:**
- Product images (backend has ProductImage model)
- Stock validation in cart
- Order confirmation page
- Error handling for all endpoints

🔍 **Missing Frontend Features:**
- Related products (no backend endpoint)
- Product reviews (no backend model)
- Wishlist/favorites (no backend model)
- Product search suggestions (backend has search but no suggestions)
- Order tracking (backend has order detail but no tracking status)
