'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Minus,
  Plus,
  Trash2,
  Heart,
  ShoppingBag,
  ArrowRight,
  Tag,
  X,
  AlertCircle,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { formatPrice } from '@/lib/format'
import { couponService } from '@/lib/services'
import { useStore } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { CartLine } from '@/lib/types'

const SHIPPING_THRESHOLD = 50
const TAX_RATE = 0.08

export default function CartPage() {
  const { cart, cartSubtotal, removeFromCart, updateQuantity, toggleWishlist } = useStore()
  const [couponCode, setCouponCode] = useState('')
  const [couponInput, setCouponInput] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const shippingFree = cartSubtotal >= SHIPPING_THRESHOLD
  const shipping = shippingFree ? 0 : 9.99
  const discountedSubtotal = Math.max(0, cartSubtotal - couponDiscount)
  const tax = Math.round(discountedSubtotal * TAX_RATE)
  const total = discountedSubtotal + shipping + tax

  const applyCoupon = async () => {
    setApplyingCoupon(true)
    setCouponError('')
    await new Promise((r) => setTimeout(r, 500))
    const result = couponService.validate(couponInput, cartSubtotal)
    if (result.ok) {
      setCouponDiscount(result.discount)
      setCouponCode(couponInput)
      toast('Coupon applied!', { description: `You saved ${formatPrice(result.discount)}.` })
    } else {
      setCouponError(result.message)
    }
    setApplyingCoupon(false)
  }

  const removeCoupon = () => {
    setCouponCode('')
    setCouponInput('')
    setCouponDiscount(0)
    setCouponError('')
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBag />
            </EmptyMedia>
            <EmptyTitle>Your cart is empty</EmptyTitle>
            <EmptyDescription>
              Looks like you haven&apos;t added anything yet. Start shopping!
            </EmptyDescription>
          </EmptyHeader>
          <Button render={<Link href="/products" />}>
            Browse products <ArrowRight data-icon="inline-end" />
          </Button>
        </Empty>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold">
        Shopping Cart{' '}
        <span className="text-muted-foreground font-normal text-xl">({cart.length})</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Cart items */}
        <div className="flex flex-col gap-4">
          {/* Free shipping bar */}
          {!shippingFree && (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="size-4 text-primary shrink-0" />
                <span>
                  Add{' '}
                  <span className="font-semibold text-primary">
                    {formatPrice(SHIPPING_THRESHOLD - cartSubtotal)}
                  </span>{' '}
                  more for free shipping
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (cartSubtotal / SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {cart.map((line) => (
            <CartItem
              key={`${line.productId}-${line.variant}`}
              line={line}
              onRemove={() => removeFromCart(line.productId, line.variant)}
              onUpdateQty={(q) => updateQuantity(line.productId, q, line.variant)}
              onMoveToWishlist={() => {
                const mockProduct = {
                  id: line.productId,
                  slug: line.slug,
                  name: line.name,
                  images: [line.image],
                  price: line.price,
                  originalPrice: line.originalPrice,
                  stock: line.stock,
                } as any
                toggleWishlist(mockProduct)
                removeFromCart(line.productId, line.variant)
              }}
            />
          ))}
        </div>

        {/* Order summary */}
        <div className="flex flex-col gap-4">
          <div className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold">Order Summary</h2>

            {/* Coupon */}
            {couponCode ? (
              <div className="flex items-center justify-between rounded-xl bg-primary/10 px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Tag className="size-4 text-primary" />
                  <span className="font-medium text-primary">{couponCode}</span>
                  <span className="text-muted-foreground">−{formatPrice(couponDiscount)}</span>
                </div>
                <button onClick={removeCoupon} aria-label="Remove coupon">
                  <X className="size-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code (try GENZ10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                  />
                  <Button
                    variant="outline"
                    onClick={applyCoupon}
                    disabled={!couponInput.trim() || applyingCoupon}
                  >
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="size-3" /> {couponError}
                  </p>
                )}
              </div>
            )}

            <Separator />

            {/* Totals */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Coupon discount</span>
                  <span>−{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shippingFree ? 'text-success' : ''}>
                  {shippingFree ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold">Total</span>
              <span className="font-display text-2xl font-bold">{formatPrice(total)}</span>
            </div>

            <Button size="lg" className="w-full" render={<Link href="/checkout" />}>
              Proceed to checkout
              <ArrowRight data-icon="inline-end" />
            </Button>

            <Button size="lg" variant="ghost" className="w-full" render={<Link href="/products" />}>
              Continue shopping
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Secure checkout · SSL encrypted · Free returns
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Cart Item ───────────────────────────────────────────────────────────────

function CartItem({
  line,
  onRemove,
  onUpdateQty,
  onMoveToWishlist,
}: {
  line: CartLine
  onRemove: () => void
  onUpdateQty: (qty: number) => void
  onMoveToWishlist: () => void
}) {
  const outOfStock = line.stock === 0

  return (
    <div
      className={cn(
        'flex gap-4 rounded-2xl border border-border bg-card p-4 transition',
        outOfStock && 'opacity-60',
      )}
    >
      {/* Image */}
      <Link href={`/product/${line.slug}`} className="relative shrink-0 size-20 sm:size-24 overflow-hidden rounded-xl bg-muted">
        <Image src={line.image} alt={line.name} fill className="object-cover" sizes="96px" />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/product/${line.slug}`}
              className="line-clamp-2 text-sm font-medium leading-tight hover:text-primary"
            >
              {line.name}
            </Link>
            {line.variant && (
              <p className="mt-0.5 text-xs text-muted-foreground">{line.variant}</p>
            )}
          </div>
          <button
            onClick={onRemove}
            aria-label="Remove item"
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        {outOfStock && (
          <Badge variant="secondary" className="w-fit text-xs">Out of stock</Badge>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          {/* Qty controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateQty(line.quantity - 1)}
              aria-label="Decrease"
              className="grid size-7 place-items-center rounded-lg border border-border hover:bg-muted transition"
              disabled={line.quantity <= 1}
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{line.quantity}</span>
            <button
              onClick={() => onUpdateQty(line.quantity + 1)}
              aria-label="Increase"
              className="grid size-7 place-items-center rounded-lg border border-border hover:bg-muted transition"
              disabled={line.quantity >= line.stock}
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onMoveToWishlist}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition"
            >
              <Heart className="size-3.5" /> Save
            </button>
            <div className="text-right">
              <p className="font-semibold">{formatPrice(line.price * line.quantity)}</p>
              {line.originalPrice > line.price && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(line.originalPrice * line.quantity)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
