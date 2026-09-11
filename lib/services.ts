import {
  products as mockProducts,
  categories as mockCategories,
  brands as mockBrands,
  reviews as mockReviews,
  orders as initialOrders,
  coupons as mockCoupons,
  notifications as initialNotifications,
  sellers as mockSellers,
} from './mock-data'
import type { Product, Order, AppNotification } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/GenZMart-API/api"

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("gz_auth_token")
}

export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return
  if (token) {
    localStorage.setItem("gz_auth_token", token)
  } else {
    localStorage.removeItem("gz_auth_token")
  }
}

export interface AuthUser {
  id: number
  name: string
  first_name?: string
  last_name?: string
  email: string
  role: "customer" | "seller" | "admin"
  avatar?: string | null
  status?: string
}

export interface ProductQuery {
  search?: string
  category?: string
  subcategory?: string
  brand?: string[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  onlyDiscount?: boolean
  inStock?: boolean
  sort?: string
  tags?: string[]
  page?: number
  perPage?: number
}

export const productService = {
  getAll: (): Product[] => mockProducts,

  getFeatured: (): Product[] => mockProducts.filter((p) => p.tags.includes('featured')).slice(0, 8),
  getNewArrivals: (): Product[] => mockProducts.filter((p) => p.tags.includes('new')).slice(0, 8),
  getBestSellers: (): Product[] => mockProducts.filter((p) => p.tags.includes('bestseller')).slice(0, 8),
  getTrending: (): Product[] => mockProducts.filter((p) => p.tags.includes('trending')).slice(0, 8),
  getDeals: (): Product[] => [...mockProducts].sort((a, b) => b.discount - a.discount).slice(0, 8),

  getBySlug: (slug: string): Product | undefined => mockProducts.find((p) => p.slug === slug),
  getById: (id: string): Product | undefined => mockProducts.find((p) => p.id === id),
  getByIds: (ids: string[]): Product[] => ids.map((id) => mockProducts.find((p) => p.id === id)).filter(Boolean) as Product[],
  getRelated: (product: Product): Product[] => mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4),

  query: (q: ProductQuery): { items: Product[]; total: number } => {
    let items = [...mockProducts]
    if (q.search) {
      const s = q.search.toLowerCase()
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s) ||
          p.tags.some((t) => t.includes(s)),
      )
    }
    if (q.category) items = items.filter((p) => p.category === q.category)
    if (q.subcategory) items = items.filter((p) => p.subcategory === q.subcategory)
    if (q.brand?.length) items = items.filter((p) => q.brand!.includes(p.brand))
    if (q.minPrice != null) items = items.filter((p) => p.price >= q.minPrice!)
    if (q.maxPrice != null) items = items.filter((p) => p.price <= q.maxPrice!)
    if (q.minRating != null) items = items.filter((p) => p.rating >= q.minRating!)
    if (q.onlyDiscount) items = items.filter((p) => p.discount > 0)
    if (q.inStock) items = items.filter((p) => p.stock > 0)
    if (q.tags?.length) items = items.filter((p) => q.tags!.some((t) => p.tags.includes(t)))

    switch (q.sort) {
      case 'newest': items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); break
      case 'price-asc': items.sort((a, b) => a.price - b.price); break
      case 'price-desc': items.sort((a, b) => b.price - a.price); break
      case 'rating': items.sort((a, b) => b.rating - a.rating); break
      case 'popular': items.sort((a, b) => b.reviewCount - a.reviewCount); break
      default: items.sort((a, b) => (b.tags.includes('featured') ? 1 : 0) - (a.tags.includes('featured') ? 1 : 0))
    }

    const total = items.length
    const page = q.page ?? 1
    const perPage = q.perPage ?? 12
    items = items.slice((page - 1) * perPage, page * perPage)
    return { items, total }
  },

  getPriceBounds: (): [number, number] => {
    const prices = mockProducts.map((p) => p.price)
    return [Math.min(...prices), Math.max(...prices)]
  },
}

export const categoryService = {
  getAll: () => mockCategories,
  getBySlug: (slug: string) => mockCategories.find((c) => c.slug === slug),
}

export const brandService = {
  getAll: () => mockBrands,
}

let cachedOrders: Order[] | null = null
function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return initialOrders
  if (cachedOrders !== null) return cachedOrders
  try {
    const raw = localStorage.getItem('genz_orders')
    if (raw) {
      cachedOrders = JSON.parse(raw)
      return cachedOrders || []
    }
  } catch (e) {
    console.error('Failed to parse orders from localStorage', e)
  }
  cachedOrders = initialOrders
  return cachedOrders
}

function saveOrders(ordersList: Order[]): void {
  cachedOrders = ordersList
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('genz_orders', JSON.stringify(ordersList))
      window.dispatchEvent(new Event('genz_orders_updated'))
    } catch (e) {
      console.error('Failed to save orders to localStorage', e)
    }
  }
}

let cachedNotifications: AppNotification[] | null = null
function getStoredNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return initialNotifications
  if (cachedNotifications !== null) return cachedNotifications
  try {
    const raw = localStorage.getItem('genz_notifications')
    if (raw) {
      cachedNotifications = JSON.parse(raw)
      return cachedNotifications || []
    }
  } catch (e) {
    console.error('Failed to parse notifications from localStorage', e)
  }
  cachedNotifications = initialNotifications
  return cachedNotifications
}

function saveNotifications(notifsList: AppNotification[]): void {
  cachedNotifications = notifsList
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('genz_notifications', JSON.stringify(notifsList))
      window.dispatchEvent(new Event('genz_notifications_updated'))
    } catch (e) {
      console.error('Failed to save notifications to localStorage', e)
    }
  }
}

export const reviewService = {
  getForProduct: (productId: string) => mockReviews.filter((r) => r.productId === productId),
}

export const notificationService = {
  getAll: (): AppNotification[] => getStoredNotifications(),
  addNotification: (title: string, body: string, type: AppNotification['type'] = 'order') => {
    const list = getStoredNotifications()
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      body,
      date: new Date().toISOString(),
      read: false,
    }
    saveNotifications([newNotif, ...list])
    return newNotif
  },
  markAsRead: (id: string) => {
    const list = getStoredNotifications().map((n) => (n.id === id ? { ...n, read: true } : n))
    saveNotifications(list)
  },
}

function mapDbStatusToFrontend(status: string): Order['orderStatus'] {
  const s = (status || '').toLowerCase()
  if (s === 'pending') return 'Placed'
  if (s === 'processing' || s === 'confirmed') return 'Confirmed'
  if (s === 'packed') return 'Packed'
  if (s === 'shipped') return 'Shipped'
  if (s === 'out_for_delivery') return 'Out for Delivery'
  if (s === 'delivered') return 'Delivered'
  if (s === 'cancelled') return 'Cancelled'
  return 'Placed'
}

let isFetchingOrders = false

export const orderService = {
  getAll: (): Order[] => {
    const token = getAuthToken()
    if (token && typeof window !== 'undefined' && !isFetchingOrders) {
      isFetchingOrders = true
      fetch(`${API_BASE_URL}/orders/index.php`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && Array.isArray(data.data?.orders)) {
            const apiOrders: Order[] = data.data.orders.map((o: any) => ({
              id: String(o.id),
              orderNumber: o.order_number,
              customer: o.recipient || 'Customer',
              seller: 'GenZMart Direct',
              items: (o.items || []).map((i: any) => ({
                productId: String(i.product_id),
                name: i.product_name,
                image: i.image || 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp',
                price: Number(i.price || 0),
                quantity: Number(i.quantity || 1),
                variant: i.variant_name || undefined
              })),
              subtotal: Number(o.subtotal || 0),
              discount: Number(o.discount_amount || 0),
              shipping: Number(o.shipping_fee || 0),
              tax: Number(o.tax_amount || 0),
              total: Number(o.total_amount || 0),
              paymentMethod: o.payment_method === 'cod' ? 'Cash on Delivery' : (o.payment_method || 'Cash on Delivery'),
              paymentStatus: (o.payment_status || 'pending').toLowerCase() === 'paid' ? 'Paid' : 'Pending',
              orderStatus: mapDbStatusToFrontend(o.order_status),
              address: o.address_summary || 'Shipping Address',
              createdAt: o.created_at || new Date().toISOString()
            }))
            const storedOrders = getStoredOrders()
            const locallyCancelled = new Set(
              storedOrders
                .filter((order) => order.orderStatus === 'Cancelled')
                .map((order) => `${order.id}:${order.orderNumber}`),
            )
            const mergedOrders = apiOrders.map((order) =>
              locallyCancelled.has(`${order.id}:${order.orderNumber}`)
                ? { ...order, orderStatus: 'Cancelled' as const }
                : order,
            )
            saveOrders(mergedOrders)
          }
        })
        .catch((e) => console.error('Failed to sync orders from backend API:', e))
        .finally(() => {
          isFetchingOrders = false
        })
    }
    return getStoredOrders()
  },

  getById: (id: string): Order | undefined => {
    const list = getStoredOrders()
    return list.find((o) => o.id === id || o.orderNumber === id)
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const token = getAuthToken()
    let newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    if (token) {
      try {
        const payload = {
          order_number: orderData.orderNumber,
          payment_method: orderData.paymentMethod.toLowerCase().includes('cash') || orderData.paymentMethod.toLowerCase() === 'cod' ? 'cod' : orderData.paymentMethod,
          shipping_address: {
            recipient_name: orderData.customer,
            phone: '9999999999',
            address_line1: orderData.address || 'Default Address',
            city: 'Mumbai',
            state: 'Maharashtra',
            postal_code: '400001',
            country: 'India'
          },
          subtotal: orderData.subtotal,
          discount: orderData.discount,
          shipping: orderData.shipping,
          tax: orderData.tax,
          total: orderData.total,
          items: orderData.items.map((i) => ({
            product_id: parseInt(i.productId, 10) || 1,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            variant: i.variant
          }))
        }

        const res = await fetch(`${API_BASE_URL}/orders/index.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (res.ok && data.success && data.data) {
          if (data.data.order_id) newOrder.id = String(data.data.order_id)
          if (data.data.order_number) newOrder.orderNumber = data.data.order_number
        }
      } catch (e) {
        console.error('Failed to post order to backend API', e)
      }
    }

    const list = getStoredOrders()
    const updated = [newOrder, ...list]
    saveOrders(updated)
    notificationService.addNotification(
      'Order Confirmed!',
      `Order ${newOrder.orderNumber} placed successfully. We are processing it now!`,
      'order'
    )
    return newOrder
  },

    updateStatus: async (id: string, status: Order['orderStatus']): Promise<Order | undefined> => {
    const token = getAuthToken()
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/orders/index.php`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            order_id: isNaN(Number(id)) ? undefined : Number(id),
            order_number: id,
            status: status
          })
        })
      } catch (e) {
        console.error('Failed to update order status via API', e)
      }
    }

    const list = getStoredOrders()
    let target: Order | undefined
    const updated = list.map((o) => {
      if (o.id === id || o.orderNumber === id) {
        target = { ...o, orderStatus: status }
        return target
      }
      return o
    })
    if (target) {
      saveOrders(updated)
      notificationService.addNotification(
        `Order Update ${target.orderNumber}`,
        `Your order status has changed to "${status}".`,
        'shipment'
      )
    }
    return target
  },
}

export const couponService = {
  validate: (code: string, subtotal: number) => {
    const c = mockCoupons.find((cp) => cp.code.toLowerCase() === code.toLowerCase() && cp.active)
    if (!c) return { ok: false as const, message: 'Invalid or expired coupon code.' }
    if (subtotal < c.minOrder) return { ok: false as const, message: `Minimum order of ${c.minOrder} required.` }
    let discount = c.type === 'percentage' ? (subtotal * c.value) / 100 : c.value
    if (c.maxDiscount) discount = Math.min(discount, c.maxDiscount)
    return { ok: true as const, discount: Math.round(discount), coupon: c }
  },
}

export const sellerService = {
  getAll: () => mockSellers,
  getById: (id: string) => mockSellers.find((s) => s.id === id),
  getProducts: (sellerId: string) => mockProducts.filter((p) => p.sellerId === sellerId),
}

export const adminService = {
  getUsers: () => [
    { id: 'u1', name: 'Aria Kapoor', email: 'aria@genz.mart', status: 'active', orders: 12, joined: '2024-03-01' },
    { id: 'u2', name: 'Devon Miles', email: 'devon@genz.mart', status: 'active', orders: 5, joined: '2024-07-14' },
    { id: 'u3', name: 'Sky Patel', email: 'sky@genz.mart', status: 'suspended', orders: 2, joined: '2025-01-22' },
    { id: 'u4', name: 'Rio Lee', email: 'rio@genz.mart', status: 'active', orders: 27, joined: '2023-11-09' },
    { id: 'u5', name: 'Jules Tan', email: 'jules@genz.mart', status: 'inactive', orders: 0, joined: '2026-02-18' },
  ],
  getSellers: () => mockSellers,
  getProducts: () => mockProducts,
  getOrders: () => orderService.getAll(),
}

export const authService = {
  login: async (email: string, password: string): Promise<{ user: AuthUser; token: string }> => {
    const res = await fetch(`${API_BASE_URL}/auth/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      const msg = data.errors ? Object.values(data.errors).join(" ") : (data.message || "Login failed")
      throw new Error(msg)
    }
    setAuthToken(data.data.token)
    return { user: data.data.user, token: data.data.token }
  },

  signup: async (name: string, email: string, password: string, role: string = "customer"): Promise<{ user: AuthUser; token: string }> => {
    const res = await fetch(`${API_BASE_URL}/auth/register.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirm_password: password, role }),
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      const msg = data.errors ? Object.values(data.errors).join(" ") : (data.message || "Registration failed")
      throw new Error(msg)
    }
    setAuthToken(data.data.token)
    return { user: data.data.user, token: data.data.token }
  },

  me: async (): Promise<AuthUser | null> => {
    const token = getAuthToken()
    if (!token) return null
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me.php`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      const data = await res.json()
      if (!res.ok || !data.success || !data.data?.user) {
        setAuthToken(null)
        return null
      }
      return data.data.user
    } catch {
      return null
    }
  },

  logout: async (): Promise<void> => {
    const token = getAuthToken()
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        })
      } catch {}
    }
    setAuthToken(null)
  }
}
