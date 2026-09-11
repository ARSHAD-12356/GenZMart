'use client'

import Link from 'next/link'
import {
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Clock,
  Star,
  ChevronRight,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatDate } from '@/lib/format'
import { sellerService, reviewService, orderService, productService } from '@/lib/services'
import { StarRating } from '@/components/product/star-rating'

const SELLER_ID = 's1'

const STATUS_COLOR: Record<string, string> = {
  Placed: 'bg-blue-500/20 text-blue-400',
  Confirmed: 'bg-primary/20 text-primary',
  Packed: 'bg-warning/20 text-warning',
  Shipped: 'bg-blue-500/20 text-blue-400',
  'Out for Delivery': 'bg-accent/20 text-accent',
  Delivered: 'bg-success/20 text-success',
  Cancelled: 'bg-destructive/20 text-destructive',
}

export default function SellerDashboard() {
  const seller = sellerService.getById(SELLER_ID)
  const products = sellerService.getProducts(SELLER_ID)
  const orders = orderService.getAll()
  const reviews = products.flatMap((p) => reviewService.getForProduct(p.id))

  const revenue = orders.reduce((n, o) => n + o.total, 0)
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 20)
  const outOfStock = products.filter((p) => p.stock === 0)
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  const stats = [
    { label: 'Total revenue', value: formatPrice(revenue), icon: DollarSign, color: 'text-success' },
    { label: 'Total orders', value: orders.length, icon: ShoppingBag, color: 'text-primary' },
    { label: 'Active products', value: products.filter((p) => p.status === 'active').length, icon: Package, color: 'text-accent' },
    { label: 'Avg. rating', value: avgRating.toFixed(1) + ' ★', icon: Star, color: 'text-warning' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {seller?.name}</p>
        </div>
        <Button render={<Link href="/seller/products/new" />}>
          <Plus className="size-4" /> Add product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
            <Icon className={`size-5 ${color}`} />
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="flex flex-col gap-2">
          {outOfStock.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
              <AlertTriangle className="size-4 text-destructive shrink-0" />
              <span><span className="font-semibold">{outOfStock.length}</span> products are out of stock.</span>
              <Button size="xs" variant="outline" className="ml-auto shrink-0" render={<Link href="/seller/inventory" />}>View</Button>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
              <AlertTriangle className="size-4 text-warning shrink-0" />
              <span><span className="font-semibold">{lowStock.length}</span> products are running low on stock.</span>
              <Button size="xs" variant="outline" className="ml-auto shrink-0" render={<Link href="/seller/inventory" />}>View</Button>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold flex items-center gap-2"><Clock className="size-4 text-primary" /> Recent orders</h2>
            <Button variant="ghost" size="xs" render={<Link href="/seller/orders" />}>All <ChevronRight className="size-3" /></Button>
          </div>
          <div className="divide-y divide-border">
            {orders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-medium">{o.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                </div>
                <span className="font-semibold text-sm">{formatPrice(o.total)}</span>
                <Badge className={`text-xs ${STATUS_COLOR[o.orderStatus]}`}>{o.orderStatus}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reviews */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold flex items-center gap-2"><Star className="size-4 text-primary" /> Recent reviews</h2>
            <Button variant="ghost" size="xs" render={<Link href="/seller/reviews" />}>All <ChevronRight className="size-3" /></Button>
          </div>
          <div className="divide-y divide-border">
            {reviews.slice(0, 4).map((r) => (
              <div key={r.id} className="flex flex-col gap-1 px-5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{r.author}</p>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
