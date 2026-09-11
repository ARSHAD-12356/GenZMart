'use client'

import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  Truck,
  RotateCcw,
  X,
  Heart,
} from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatDate } from '@/lib/format'
import { orderService } from '@/lib/services'
import type { Order } from '@/lib/types'

const STATUS_COLOR: Record<string, string> = {
  Placed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Confirmed: 'bg-primary/20 text-primary border-primary/30',
  Packed: 'bg-warning/20 text-warning border-warning/30',
  Shipped: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Out for Delivery': 'bg-accent/20 text-accent border-accent/30',
  Delivered: 'bg-success/20 text-success border-success/30',
  Cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
}

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  Paid: 'bg-success/20 text-success',
  Pending: 'bg-warning/20 text-warning',
  Refunded: 'bg-primary/20 text-primary',
  Failed: 'bg-destructive/20 text-destructive',
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  useEffect(() => {
    const found = orderService.getById(id)
    setOrder(found || null)
    setLoaded(true)
  }, [id])

  const handleCancelOrder = async () => {
    if (!order) return

    const updatedOrder = await orderService.updateStatus(order.id, 'Cancelled')
    if (updatedOrder) {
      setOrder(updatedOrder)
      setCancelDialogOpen(false)
      window.dispatchEvent(new Event('genz_orders_updated'))
    }
  }

  if (!loaded) return null
  if (!order) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" render={<Link href="/account/orders" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="font-display text-xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge className={`border ${STATUS_COLOR[order.orderStatus]}`}>{order.orderStatus}</Badge>
          <Badge className={PAYMENT_STATUS_COLOR[order.paymentStatus]}>{order.paymentStatus}</Badge>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
          <Package className="size-4 text-primary" />
          <h2 className="font-semibold">Order items</h2>
        </div>
        <div className="divide-y divide-border">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.name}</p>
                {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Price breakdown */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Price summary</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-primary">
                <span>Discount</span>
                <span>−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shipping === 0 ? <span className="text-success">Free</span> : formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Address & payment */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="size-4 text-primary" />
              <h2 className="font-semibold">Delivery address</h2>
            </div>
            <p className="text-sm text-muted-foreground">{order.address}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="size-4 text-primary" />
              <h2 className="font-semibold">Payment</h2>
            </div>
            <p className="text-sm">{order.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" render={<Link href={`/account/orders/${id}/tracking`} />}>
          <Truck className="size-4" /> Track order
        </Button>
        {order.orderStatus === 'Delivered' && (
          <Button variant="outline">
            <RotateCcw className="size-4" /> Return / Refund
          </Button>
        )}
        {['Placed', 'Confirmed'].includes(order.orderStatus) && (
          <Button
            variant="outline"
            onClick={() => setCancelDialogOpen(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            <X className="size-4" /> Cancel order
          </Button>
        )}
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
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
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep order
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder}>
              Yes, cancel it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
