'use client'

import { authService } from '@/lib/services'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import type { CartLine, Product } from '@/lib/types'

export interface User {
  name: string
  email: string
  role: 'customer' | 'seller' | 'admin'
}

interface StoreState {
  // auth
  user: User | null
  login: (email: string, password: string, role?: User['role']) => Promise<User>
  signup: (name: string, email: string, password: string, role?: User['role']) => Promise<User>
  logout: () => void
  // cart
  cart: CartLine[]
  addToCart: (product: Product, quantity?: number, variant?: string) => void
  removeFromCart: (productId: string, variant?: string) => void
  updateQuantity: (productId: string, quantity: number, variant?: string) => void
  clearCart: () => void
  cartCount: number
  cartSubtotal: number
  // wishlist
  wishlist: string[]
  toggleWishlist: (product: Product) => void
  isWishlisted: (id: string) => boolean
  // compare
  compare: string[]
  toggleCompare: (product: Product) => void
  isCompared: (id: string) => boolean
  clearCompare: () => void
  // recently viewed
  recentlyViewed: string[]
  addRecentlyViewed: (id: string) => void
  ready: boolean
}

const StoreContext = createContext<StoreState | null>(null)

function useLocal<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initial)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setValue(JSON.parse(raw))
    } catch {}
    setReady(true)
  }, [key])
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {}
    }
  }, [key, value, ready])
  return [value, setValue, ready]
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gz_user')
      if (raw) setUserState(JSON.parse(raw))
    } catch {}
  }, [])
  const [authReady, setAuthReady] = useState(false)
  const [cart, setCart] = useLocal<CartLine[]>('gz_cart', [])
  const [wishlist, setWishlist] = useLocal<string[]>('gz_wishlist', [])
  const [compare, setCompare] = useLocal<string[]>('gz_compare', [])
  const [recentlyViewed, setRecentlyViewed] = useLocal<string[]>('gz_recent', [])

  const setUser = useCallback((u: User | null) => {
    setUserState(u)
    try {
      if (u) {
        localStorage.setItem('gz_user', JSON.stringify(u))
      } else {
        localStorage.removeItem('gz_user')
      }
    } catch {}
  }, [])

  useEffect(() => {
    authService.me().then((u) => {
      if (u) {
        setUser({ name: u.name, email: u.email, role: u.role })
      } else {
        setUser(null)
      }
      setAuthReady(true)
    }).catch(() => {
      setUser(null)
      setAuthReady(true)
    })
  }, [setUser])

  const login: StoreState['login'] = async (email, password, role = 'customer') => {
    const res = await authService.login(email, password)
    const u: User = { name: res.user.name, email: res.user.email, role: res.user.role }
    setUser(u)
    return u
  }

  const signup: StoreState['signup'] = async (name, email, password, role = 'customer') => {
    const res = await authService.signup(name, email, password, role)
    const u: User = { name: res.user.name, email: res.user.email, role: res.user.role }
    setUser(u)
    return u
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    toast('Signed out', { description: 'Come back soon.' })
  }

  const lineKey = (id: string, variant?: string) => `${id}::${variant ?? ''}`

  const addToCart: StoreState['addToCart'] = (product, quantity = 1, variant) => {
    setCart((prev) => {
      const idx = prev.findIndex((l) => lineKey(l.productId, l.variant) === lineKey(product.id, variant))
      if (idx > -1) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: Math.min(next[idx].quantity + quantity, product.stock || 99) }
        return next
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          price: product.price,
          originalPrice: product.originalPrice,
          quantity,
          variant,
          stock: product.stock,
        },
      ]
    })
    toast('Added to cart', { description: product.name })
  }

  const removeFromCart: StoreState['removeFromCart'] = (productId, variant) => {
    setCart((prev) => prev.filter((l) => lineKey(l.productId, l.variant) !== lineKey(productId, variant)))
  }

  const updateQuantity: StoreState['updateQuantity'] = (productId, quantity, variant) => {
    setCart((prev) =>
      prev
        .map((l) =>
          lineKey(l.productId, l.variant) === lineKey(productId, variant)
            ? { ...l, quantity: Math.max(1, quantity) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    )
  }

  const clearCart = () => setCart([])

  const toggleWishlist: StoreState['toggleWishlist'] = (product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        toast('Removed from wishlist', { description: product.name })
        return prev.filter((id) => id !== product.id)
      }
      toast('Saved to wishlist', { description: product.name })
      return [...prev, product.id]
    })
  }

  const toggleCompare: StoreState['toggleCompare'] = (product) => {
    setCompare((prev) => {
      if (prev.includes(product.id)) return prev.filter((id) => id !== product.id)
      if (prev.length >= 4) {
        toast('Compare is full', { description: 'You can compare up to 4 products.' })
        return prev
      }
      toast('Added to compare', { description: product.name })
      return [...prev, product.id]
    })
  }

  const addRecentlyViewed: StoreState['addRecentlyViewed'] = useCallback((id) => {
    setRecentlyViewed((prev) => {
      if (prev[0] === id) return prev
      return [id, ...prev.filter((x) => x !== id)].slice(0, 8)
    })
  }, [])

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.quantity, 0), [cart])
  const cartSubtotal = useMemo(() => cart.reduce((n, l) => n + l.price * l.quantity, 0), [cart])

  const value: StoreState = {
    user,
    login,
    signup,
    logout,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    wishlist,
    toggleWishlist,
    isWishlisted: (id) => wishlist.includes(id),
    compare,
    toggleCompare,
    isCompared: (id) => compare.includes(id),
    clearCompare: () => setCompare([]),
    recentlyViewed,
    addRecentlyViewed,
    ready: authReady,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
