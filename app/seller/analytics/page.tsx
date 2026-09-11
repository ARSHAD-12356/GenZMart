'use client'

import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Users,
} from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { orderService, sellerService, reviewService } from '@/lib/services'
import { StarRating } from '@/components/product/star-rating'

const SELLER_ID = 's1'

// Simple bar chart using CSS
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex h-40 items-end gap-2">
      {data.map(({ label, value }) => (
        <div key={label} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md bg-primary/60 hover:bg-primary transition-all"
            style={{ height: `${(value / max) * 100}%`, minHeight: '4px' }}
          />
          <span className="text-[10px] text-muted-foreground truncate w-full text-center">{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function SellerAnalyticsPage() {
  const products = sellerService.getProducts(SELLER_ID)
  const orders = orderService.getAll()
  const reviews = products.flatMap((p) => reviewService.getForProduct(p.id))

  const revenue = orders.reduce((n, o) => n + o.total, 0)
  const avgOrder = orders.length > 0 ? revenue / orders.length : 0
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  // Monthly revenue mock
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  const monthlyRevenue = months.map((label, i) => ({
    label,
    value: Math.round(200 + Math.random() * 800 + i * 40),
  }))

  // Category breakdown
  const byCat = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Your performance at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total revenue', value: formatPrice(revenue), icon: DollarSign, color: 'text-success' },
          { label: 'Total orders', value: orders.length, icon: ShoppingBag, color: 'text-primary' },
          { label: 'Avg order value', value: formatPrice(avgOrder), icon: TrendingUp, color: 'text-accent' },
          { label: 'Avg rating', value: `${avgRating.toFixed(1)} ★`, icon: Users, color: 'text-warning' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
            <Icon className={`size-5 ${color}`} />
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Monthly revenue (mock)</h2>
        <BarChart data={monthlyRevenue} />
      </div>

      {/* Best sellers */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Best selling products</h2>
        <div className="flex flex-col gap-3">
          {products.slice(0, 5).map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="w-5 text-right text-sm text-muted-foreground font-mono">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                <div className="flex items-center gap-1">
                  <StarRating rating={p.rating} />
                  <span className="text-xs text-muted-foreground">({p.reviewCount})</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(p.price)}</p>
                <p className="text-xs text-muted-foreground">{p.reviewCount} sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Products by category</h2>
        <div className="flex flex-col gap-2">
          {Object.entries(byCat).map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-3">
              <span className="w-20 text-sm capitalize text-muted-foreground">{cat}</span>
              <div className="flex-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(count / products.length) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-sm font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
