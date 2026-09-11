'use client'

import Link from 'next/link'
import { use } from 'react'
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  Clock,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/format'

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; total?: string; payment?: string; address?: string }>
}) {
  const params = use(searchParams)
  const orderNum = params.order ?? 'GZ-0000-0000'
  const total = Number(params.total ?? 0)
  const payment = params.payment ?? 'Card'
  const address = params.address ? decodeURIComponent(params.address) : '—'

  // Estimate delivery
  const today = new Date()
  const deliveryMin = new Date(today)
  deliveryMin.setDate(today.getDate() + 3)
  const deliveryMax = new Date(today)
  deliveryMax.setDate(today.getDate() + 7)
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
      {/* Success animation */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
          <div className="relative grid size-20 place-items-center rounded-full bg-success/20">
            <CheckCircle className="size-10 text-success" />
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Order placed! 🎉</h1>
        <p className="mt-2 text-muted-foreground">
          Thanks for shopping at GenZMart. We&apos;ll get it to you soon.
        </p>
        <div className="mt-4 rounded-xl bg-primary/10 px-6 py-3 text-center">
          <p className="text-xs text-muted-foreground">Order number</p>
          <p className="font-display text-xl font-bold text-primary">{orderNum}</p>
        </div>
      </div>

      {/* Details card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4">
          <Row icon={CreditCard} label="Payment method">
            <span className="capitalize">{payment.replace(/-/g, ' ')}</span>
          </Row>
          <Separator />
          <Row icon={MapPin} label="Delivering to">
            <span className="text-right">{address}</span>
          </Row>
          <Separator />
          <Row icon={Clock} label="Estimated delivery">
            <span className="text-success font-medium">
              {fmt(deliveryMin)} – {fmt(deliveryMax)}
            </span>
          </Row>
          <Separator />
          <Row icon={Package} label="Order total">
            <span className="font-display text-xl font-bold">{formatPrice(total)}</span>
          </Row>
        </div>
      </div>

      {/* Tracking timeline preview */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold">What happens next?</h2>
        <div className="flex flex-col gap-4">
          {[
            { label: 'Order confirmed', done: true },
            { label: 'Seller packs your order', done: false },
            { label: 'Shipped', done: false },
            { label: 'Out for delivery', done: false },
            { label: 'Delivered', done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${step.done ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}
              >
                {step.done ? <CheckCircle className="size-4" /> : i + 1}
              </div>
              <span className={step.done ? 'font-medium' : 'text-muted-foreground text-sm'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button className="flex-1" render={<Link href="/account/orders" />}>
          <Package data-icon="inline-start" />
          View my orders
        </Button>
        <Button variant="outline" className="flex-1" render={<Link href="/products" />}>
          <ShoppingBag data-icon="inline-start" />
          Continue shopping
        </Button>
      </div>
    </div>
  )
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
        <Icon className="size-4 text-primary" />
        {label}
      </div>
      <div className="text-sm text-right">{children}</div>
    </div>
  )
}
