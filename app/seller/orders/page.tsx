'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { formatPrice, formatDate } from '@/lib/format'
import { orderService } from '@/lib/services'

const STATUS_COLOR: Record<string, string> = {
  Placed: 'bg-blue-500/20 text-blue-400',
  Confirmed: 'bg-primary/20 text-primary',
  Packed: 'bg-warning/20 text-warning',
  Shipped: 'bg-blue-500/20 text-blue-400',
  'Out for Delivery': 'bg-accent/20 text-accent',
  Delivered: 'bg-success/20 text-success',
  Cancelled: 'bg-destructive/20 text-destructive',
}

const NEXT_ACTION: Record<string, string | null> = {
  Placed: 'Confirm',
  Confirmed: 'Pack',
  Packed: 'Ship',
  Shipped: 'Mark Delivered',
  'Out for Delivery': null,
  Delivered: null,
  Cancelled: null,
}

export default function SellerOrdersPage() {
  const allOrders = orderService.getAll()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const orders = allOrders.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">{allOrders.length} total orders</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by order #…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              {Object.keys(STATUS_COLOR).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium">{order.orderNumber}</span>
                <Badge className={STATUS_COLOR[order.orderStatus]}>{order.orderStatus}</Badge>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
                <span className="font-semibold">{formatPrice(order.total)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="flex gap-2">
                {order.items.slice(0, 2).map((item, i) => (
                  <div key={i} className="relative size-12 overflow-hidden rounded-lg bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{order.items.map((i) => i.name).join(', ')}</p>
                <p className="text-xs text-muted-foreground">{order.customer} · {order.paymentMethod}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {NEXT_ACTION[order.orderStatus] && (
                  <Button size="sm">
                    {NEXT_ACTION[order.orderStatus]}
                  </Button>
                )}
                <Button size="sm" variant="outline" render={<Link href={`/seller/orders/${order.id}`} />}>
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
