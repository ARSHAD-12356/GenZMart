'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package,
  Heart,
  ShoppingCart,
  Bell,
  ChevronRight,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate } from '@/lib/format'
import { orderService, notificationService } from '@/lib/services'
import { useStore } from '@/components/providers/store-provider'
import type { Order } from '@/lib/types'

const STATUS_COLOR: Record<string, string> = {
  Placed: 'bg-blue-500/20 text-blue-400',
  Confirmed: 'bg-primary/20 text-primary',
  Packed: 'bg-warning/20 text-warning',
  Shipped: 'bg-blue-500/20 text-blue-400',
  'Out for Delivery': 'bg-accent/20 text-accent',
  Delivered: 'bg-success/20 text-success',
  Cancelled: 'bg-destructive/20 text-destructive',
}

export default function AccountDashboard() {
  const { user, cartCount, wishlist } = useStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const reloadData = () => {
    setOrders(orderService.getAll())
    setUnreadCount(notificationService.getAll().filter((n) => !n.read).length)
  }

  useEffect(() => {
    reloadData()
    window.addEventListener('genz_orders_updated', reloadData)
    window.addEventListener('genz_notifications_updated', reloadData)
    return () => {
      window.removeEventListener('genz_orders_updated', reloadData)
      window.removeEventListener('genz_notifications_updated', reloadData)
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-2xl font-bold">
          Welcome back, <span className="text-gradient capitalize">{user?.name?.split(' ')[0]}</span>! 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your account.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        {[
          { label: 'Total orders', value: orders.length, icon: Package, href: '/account/orders' },
          { label: 'Wishlist', value: wishlist.length, icon: Heart, href: '/account/wishlist' },
          { label: 'Cart items', value: cartCount, icon: ShoppingCart, href: '/cart' },
          { label: 'Unread', value: unreadCount, icon: Bell, href: '/account/notifications' },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3.5 sm:p-4 transition hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Icon className="size-5 text-primary" />
            <p className="font-display text-xl sm:text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 sm:px-5 py-3.5 sm:py-4">
          <h2 className="font-semibold text-sm sm:text-base flex items-center gap-2">
            <Clock className="size-4 text-primary" /> Recent orders
          </h2>
          <Button variant="ghost" size="xs" render={<Link href="/account/orders" />}>
            View all <ChevronRight className="size-3" />
          </Button>
        </div>
        <div className="divide-y divide-border">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Package className="size-10 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-medium text-foreground">No orders placed yet</p>
              <p className="text-xs text-muted-foreground mt-0.5 mb-4">When you place an order, it will appear here in real time.</p>
              <Button size="sm" render={<Link href="/products" />}>Start shopping</Button>
            </div>
          ) : (
            orders.slice(0, 3).map((order) => {
              const mainItem = order.items?.[0]
              const extraCount = (order.items?.length || 1) - 1

              return (
                <div key={order.id} className="flex flex-wrap items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-muted/20 transition-colors">
                  {/* Image Thumbnail */}
                  {mainItem?.image ? (
                    <div className="relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                      <Image
                        src={mainItem.image}
                        alt={mainItem.name || 'Product'}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <Package className="size-5" />
                    </div>
                  )}

                  {/* Product Title & Order Number */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-1 text-foreground">
                      {mainItem?.name || 'Ordered Product'}
                      {extraCount > 0 && (
                        <span className="ml-1.5 inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          +{extraCount} more
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="font-mono text-muted-foreground/90 font-medium">{order.orderNumber}</span>
                      <span>·</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Price & Status */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-bold text-sm text-foreground">{formatPrice(order.total)}</span>
                    <Badge className={`text-xs ${STATUS_COLOR[order.orderStatus] ?? 'bg-muted text-muted-foreground'}`}>
                      {order.orderStatus}
                    </Badge>
                  </div>

                  {/* Details Link */}
                  <Button size="xs" variant="outline" className="shrink-0" render={<Link href={`/account/orders/${order.id}`} />}>
                    Details
                  </Button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" /> Quick actions
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { label: 'Browse products', href: '/products' },
            { label: 'View wishlist', href: '/account/wishlist' },
            { label: 'Manage addresses', href: '/account/addresses' },
            { label: 'Write a review', href: '/account/reviews' },
          ].map(({ label, href }) => (
            <Button key={label} variant="outline" className="justify-start" render={<Link href={href} />}>
              <ChevronRight className="size-4 text-primary" />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
