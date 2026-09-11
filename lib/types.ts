export type ID = string

export interface Category {
  id: ID
  slug: string
  name: string
  description: string
  image: string
  productCount: number
  subcategories: string[]
}

export interface Brand {
  id: ID
  name: string
  slug: string
  productCount: number
}

export interface Review {
  id: ID
  productId: ID
  author: string
  avatar?: string
  rating: number
  title: string
  body: string
  date: string
  images?: string[]
  verified: boolean
}

export interface ProductVariant {
  label: string
  options: string[]
}

export interface Product {
  id: ID
  slug: string
  name: string
  shortDescription: string
  description: string
  category: string
  subcategory: string
  brand: string
  sellerId: ID
  sellerName: string
  sku: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviewCount: number
  stock: number
  images: string[]
  variants: ProductVariant[]
  specifications: Record<string, string>
  features: string[]
  tags: string[]
  status: 'active' | 'draft' | 'pending'
  createdAt: string
}

export interface CartLine {
  productId: ID
  slug: string
  name: string
  image: string
  price: number
  originalPrice: number
  quantity: number
  variant?: string
  stock: number
}

export interface Address {
  id: ID
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  type: 'shipping' | 'billing'
  isDefault: boolean
}

export interface OrderItem {
  productId: ID
  name: string
  image: string
  price: number
  quantity: number
  variant?: string
}

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'

export interface Order {
  id: ID
  orderNumber: string
  customer: string
  items: OrderItem[]
  seller: string
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed'
  orderStatus: OrderStatus
  address: string
  createdAt: string
}

export interface Coupon {
  id: ID
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder: number
  maxDiscount?: number
  expiry: string
  active: boolean
}

export interface AppNotification {
  id: ID
  type: 'order' | 'shipment' | 'delivery' | 'payment' | 'promo' | 'price-drop' | 'stock'
  title: string
  body: string
  date: string
  read: boolean
}

export interface Seller {
  id: ID
  name: string
  logo: string
  banner: string
  description: string
  rating: number
  productCount: number
  status: 'active' | 'pending' | 'suspended'
  joinedAt: string
}
