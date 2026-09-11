'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, Package, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { formatPrice, formatDate } from '@/lib/format'
import { orderService } from '@/lib/services'
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

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)

  const reloadOrders = () => {
    setAllOrders(orderService.getAll())
  }

  useEffect(() => {
    reloadOrders()
    window.addEventListener('genz_orders_updated', reloadOrders)
    return () => {
      window.removeEventListener('genz_orders_updated', reloadOrders)
    }
  }, [])

  const orders = allOrders.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">My Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} orders total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order # or product"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="size-4 text-muted-foreground" />
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              {['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><Package /></EmptyMedia>
            <EmptyTitle>No orders found</EmptyTitle>
            <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
          </EmptyHeader>
          <Link href="/products">
            <Button variant="outline">Browse products</Button>
          </Link>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium">{order.orderNumber}</span>
                  <Badge className={STATUS_COLOR[order.orderStatus] ?? 'bg-muted'}>
                    {order.orderStatus}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatDate(order.createdAt)}</span>
                  <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-border">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                      {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold">{formatPrice(item.price)}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
                <span className="text-xs text-muted-foreground">via {order.paymentMethod}</span>
                <div className="flex gap-2">
                  {['Placed', 'Confirmed'].includes(order.orderStatus) && (
                    <Button
                      size="xs"
                      variant="outline"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                      onClick={() => setOrderToCancel(order)}
                    >
                      Cancel Order
                    </Button>
                  )}
                  <Link href={`/account/orders/${order.id}/tracking`}>
                    <Button size="xs" variant="outline">Track</Button>
                  </Link>
                  <Link href={`/account/orders/${order.id}`}>
                    <Button size="xs">Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={orderToCancel !== null} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <DialogContent className="max-w-sm overflow-hidden rounded-2xl border-destructive/20 p-0">
          <div className="bg-destructive/10 px-5 pt-5 pb-4">
            <div className="flex size-11 items-center justify-center rounded-full bg-background text-destructive shadow-sm">
              <Heart className="size-5 fill-current" />
            </div>
          </div>
          <DialogHeader className="px-5 pt-1">
            <DialogTitle>Cancel this order?</DialogTitle>
            <DialogDescription>
              Your order will be cancelled and this action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-5 pb-5 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setOrderToCancel(null)}>
              Keep order
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!orderToCancel) return
                orderService.updateStatus(orderToCancel.id, 'Cancelled')
                setOrderToCancel(null)
                reloadOrders()
              }}
            >
              Yes, cancel it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
