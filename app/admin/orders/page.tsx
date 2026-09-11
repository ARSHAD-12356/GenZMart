'use client'

import Image from 'next/image'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatDate, formatPrice } from '@/lib/format'
import { adminService } from '@/lib/services'

const STATUS_COLOR: Record<string, string> = {
  Placed: 'bg-blue-500/20 text-blue-400',
  Confirmed: 'bg-primary/20 text-primary',
  Packed: 'bg-warning/20 text-warning',
  Shipped: 'bg-blue-500/20 text-blue-400',
  'Out for Delivery': 'bg-accent/20 text-accent',
  Delivered: 'bg-success/20 text-success',
  Cancelled: 'bg-destructive/20 text-destructive',
}

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  Paid: 'bg-success/20 text-success',
  Pending: 'bg-warning/20 text-warning',
  Refunded: 'bg-primary/20 text-primary',
  Failed: 'bg-destructive/20 text-destructive',
}

export default function AdminOrdersPage() {
  const allOrders = adminService.getOrders()
  const [search, setSearch] = useState('')
  const orders = allOrders.filter((o) => o.orderNumber.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">{allOrders.length} orders</p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by order #…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="flex flex-col gap-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium">{o.orderNumber}</span>
                <Badge className={STATUS_COLOR[o.orderStatus]}>{o.orderStatus}</Badge>
                <Badge className={PAYMENT_STATUS_COLOR[o.paymentStatus]}>{o.paymentStatus}</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">{formatDate(o.createdAt)}</span>
                <span className="font-semibold">{formatPrice(o.total)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-3">
              <div>
                <p className="text-sm font-medium">{o.customer}</p>
                <p className="text-xs text-muted-foreground">{o.address}</p>
              </div>
              <div className="flex gap-2">
                <Button size="xs" variant="outline">View</Button>
                {o.orderStatus !== 'Cancelled' && (
                  <Button size="xs" variant="outline" className="text-destructive border-destructive/30">Cancel</Button>
                )}
                {o.paymentStatus === 'Paid' && (
                  <Button size="xs" variant="outline" className="text-primary border-primary/30">Refund</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
