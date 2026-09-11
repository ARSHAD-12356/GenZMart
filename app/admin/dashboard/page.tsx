'use client'

import Link from 'next/link'
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Clock,
  TrendingUp,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate } from '@/lib/format'
import { adminService, orderService } from '@/lib/services'

const STATUS_COLOR: Record<string, string> = {
  Placed: 'bg-blue-500/20 text-blue-400',
  Confirmed: 'bg-primary/20 text-primary',
  Packed: 'bg-warning/20 text-warning',
  Shipped: 'bg-blue-500/20 text-blue-400',
  'Out for Delivery': 'bg-accent/20 text-accent',
  Delivered: 'bg-success/20 text-success',
  Cancelled: 'bg-destructive/20 text-destructive',
}

export default function AdminDashboard() {
  const users = adminService.getUsers()
  const sellers = adminService.getSellers()
  const products = adminService.getProducts()
  const orders = adminService.getOrders()

  const revenue = orders.reduce((n, o) => n + o.total, 0)
  const pendingSellers = sellers.filter((s) => s.status === 'pending')
  const pendingProducts = products.filter((p) => p.status === 'pending')
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 20)
  const outOfStock = products.filter((p) => p.stock === 0)

  const stats = [
    { label: 'Total users', value: users.length, icon: Users, href: '/admin/users', color: 'text-primary' },
    { label: 'Active sellers', value: sellers.filter((s) => s.status === 'active').length, icon: Store, href: '/admin/sellers', color: 'text-accent' },
    { label: 'Total products', value: products.length, icon: Package, href: '/admin/products', color: 'text-warning' },
    { label: 'Total orders', value: orders.length, icon: ShoppingBag, href: '/admin/orders', color: 'text-success' },
    { label: 'Revenue', value: formatPrice(revenue), icon: DollarSign, href: '/admin/reports', color: 'text-success' },
    { label: 'Low stock', value: lowStock.length, icon: AlertTriangle, href: '/admin/products', color: 'text-warning' },
    { label: 'Out of stock', value: outOfStock.length, icon: AlertTriangle, href: '/admin/products', color: 'text-destructive' },
    { label: 'Pending sellers', value: pendingSellers.length, icon: Clock, href: '/admin/sellers', color: 'text-accent' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:-translate-y-0.5"
          >
            <Icon className={`size-4 ${color}`} />
            <p className="font-display text-xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      {/* Pending approvals */}
      {(pendingSellers.length > 0 || pendingProducts.length > 0) && (
        <div className="flex flex-col gap-2">
          {pendingSellers.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
              <AlertTriangle className="size-4 text-warning shrink-0" />
              <span><span className="font-semibold">{pendingSellers.length}</span> seller{pendingSellers.length > 1 ? 's' : ''} pending approval</span>
              <Button size="xs" variant="outline" className="ml-auto shrink-0" render={<Link href="/admin/sellers" />}>Review</Button>
            </div>
          )}
          {pendingProducts.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm">
              <Clock className="size-4 text-primary shrink-0" />
              <span><span className="font-semibold">{pendingProducts.length}</span> product{pendingProducts.length > 1 ? 's' : ''} pending approval</span>
              <Button size="xs" variant="outline" className="ml-auto shrink-0" render={<Link href="/admin/products" />}>Review</Button>
            </div>
          )}
        </div>
      )}

      {/* Recent orders */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">Recent orders</h2>
          <Button variant="ghost" size="xs" render={<Link href="/admin/orders" />}>All <ChevronRight className="size-3" /></Button>
        </div>
        <div className="divide-y divide-border">
          {orders.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm font-medium">{o.orderNumber}</p>
                <p className="text-xs text-muted-foreground">{o.customer} · {formatDate(o.createdAt)}</p>
              </div>
              <span className="font-semibold">{formatPrice(o.total)}</span>
              <Badge className={STATUS_COLOR[o.orderStatus]}>{o.orderStatus}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Pending sellers */}
      {pendingSellers.length > 0 && (
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Pending sellers</h2>
          </div>
          <div className="divide-y divide-border">
            {pendingSellers.map((s) => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">Applied {formatDate(s.joinedAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="xs" className="bg-success/20 text-success hover:bg-success/30">
                    <CheckCircle className="size-3" /> Approve
                  </Button>
                  <Button size="xs" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    <XCircle className="size-3" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
