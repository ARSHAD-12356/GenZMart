'use client'

import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { orderService } from '@/lib/services'
import { cn } from '@/lib/utils'
import type { Order } from '@/lib/types'

const TIMELINE = [
  { status: 'Placed', label: 'Order placed', desc: 'Your order has been received.' },
  { status: 'Confirmed', label: 'Confirmed', desc: 'Seller confirmed your order.' },
  { status: 'Packed', label: 'Packed', desc: 'Your order is packed and ready to ship.' },
  { status: 'Shipped', label: 'Shipped', desc: 'Your order is on its way.' },
  { status: 'Out for Delivery', label: 'Out for delivery', desc: 'Out for delivery — arriving soon.' },
  { status: 'Delivered', label: 'Delivered', desc: 'Your order was delivered.' },
] as const

const STEP_ORDER = TIMELINE.map((t) => t.status)

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const found = orderService.getById(id)
    setOrder(found || null)
    setLoaded(true)
  }, [id])

  if (!loaded) return null
  if (!order) notFound()

  const currentStep = STEP_ORDER.indexOf(order.orderStatus as any)
  const isCancelled = order.orderStatus === 'Cancelled'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" render={<Link href={`/account/orders/${id}`} />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="font-display text-xl font-bold">Order Tracking</h1>
          <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
        </div>
      </div>

      {isCancelled ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <p className="font-display text-xl font-bold text-destructive">Order Cancelled</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This order was cancelled. Any payment will be refunded within 5–7 business days.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-0">
            {TIMELINE.map((step, i) => {
              const done = i < currentStep
              const active = i === currentStep
              const future = i > currentStep
              return (
                <div key={step.status} className="flex gap-4">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                        done
                          ? 'border-success bg-success/20 text-success'
                          : active
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border bg-muted text-muted-foreground',
                      )}
                    >
                      {done ? (
                        <Check className="size-4" />
                      ) : active ? (
                        <Clock className="size-3.5 animate-pulse" />
                      ) : (
                        <span className="text-xs">{i + 1}</span>
                      )}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div
                        className={cn(
                          'w-0.5 flex-1 my-1 transition-all',
                          done ? 'bg-success' : 'bg-border',
                        )}
                        style={{ minHeight: '2rem' }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn('pb-6 flex-1', i === TIMELINE.length - 1 && 'pb-0')}>
                    <p
                      className={cn(
                        'font-semibold',
                        done ? 'text-foreground' : active ? 'text-primary' : 'text-muted-foreground',
                      )}
                    >
                      {step.label}
                    </p>
                    <p className={cn('text-sm mt-0.5', future ? 'text-muted-foreground/50' : 'text-muted-foreground')}>
                      {step.desc}
                    </p>
                    {(done || active) && (
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" render={<Link href={`/account/orders/${id}`} />}>
          View order details
        </Button>
        <Button variant="outline" render={<Link href="/account/orders" />}>
          All orders
        </Button>
      </div>
    </div>
  )
}
