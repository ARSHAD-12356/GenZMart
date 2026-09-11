'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import {
  Heart,
  ShoppingCart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Zap,
  BadgeCheck,
  Package,
  Minus,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StarRating } from '@/components/product/star-rating'
import { ProductRail } from '@/components/product/product-rail'
import { productService, reviewService, categoryService } from '@/lib/services'
import { formatPrice, formatDate } from '@/lib/format'
import { useStore } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Product, Review } from '@/lib/types'

// ─── Client Product Page ────────────────────────────────────────────────────

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = productService.getBySlug(slug)
  if (!product) notFound()

  const reviews = reviewService.getForProduct(product.id)
  const related = productService.getRelated(product)
  const category = categoryService.getBySlug(product.category)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/category/${product.category}`} />}>
              {category?.name ?? product.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[200px] truncate">{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main product section */}
      <ProductMain product={product} reviews={reviews} />

      {/* Tabs */}
      <ProductTabs product={product} reviews={reviews} />

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <ProductRail title="Related products" subtitle={`More from ${category?.name}`} products={related} />
        </div>
      )}
    </div>
  )
}

// ─── Gallery ────────────────────────────────────────────────────────────────

function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0)
  const [imgSrcs, setImgSrcs] = useState<string[]>(product.images.length > 0 ? product.images : ['/placeholder.svg'])

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted group">
        <Image
          src={imgSrcs[active] || '/placeholder.svg'}
          alt={product.name}
          fill
          onError={() => {
            const next = [...imgSrcs]
            next[active] = '/placeholder.svg'
            setImgSrcs(next)
          }}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {product.discount > 0 && (
          <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground shadow-lg">
            -{product.discount}% OFF
          </Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <Badge variant="secondary" className="text-base px-4 py-2">Out of Stock</Badge>
          </div>
        )}
        {/* Prev / next arrows */}
        {product.images.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={() => setActive((p) => (p === 0 ? product.images.length - 1 : p - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-full bg-background/80 backdrop-blur hover:bg-background transition"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              aria-label="Next image"
              onClick={() => setActive((p) => (p === product.images.length - 1 ? 0 : p + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-full bg-background/80 backdrop-blur hover:bg-background transition"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>
      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {product.images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={cn(
              'relative shrink-0 size-16 overflow-hidden rounded-xl border-2 transition',
              active === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100',
            )}
          >
            <Image src={img} alt="" fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Info Panel ──────────────────────────────────────────────────────────────

function ProductMain({ product, reviews }: { product: Product; reviews: Review[] }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const { addRecentlyViewed } = useStore()
  const [qty, setQty] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const wished = isWishlisted(product.id)

  useEffect(() => {
    addRecentlyViewed(product.id)
  }, [product.id, addRecentlyViewed])

  const variantString = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' / ')

  const handleAddToCart = () => {
    addToCart(product, qty, variantString || undefined)
  }

  const handleBuyNow = () => {
    addToCart(product, qty, variantString || undefined)
    window.location.href = '/checkout'
  }

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.name, url: window.location.href })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      toast('Link copied', { description: 'Product link copied to clipboard.' })
    }
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.rating

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ProductGallery product={product} />

      <div className="flex flex-col gap-5">
        {/* Brand & name */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {product.brand}
          </span>
          <h1 className="mt-1 font-display text-2xl font-bold leading-tight sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">SKU: {product.sku} · Sold by{' '}
            <span className="text-foreground font-medium">{product.sellerName}</span>
          </p>
        </div>

        {/* Rating */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <StarRating rating={avgRating} />
            <span className="font-medium">{avgRating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          <Badge
            className={cn(
              product.stock > 0
                ? 'bg-success/20 text-success border-success/30'
                : 'bg-destructive/20 text-destructive border-destructive/30',
              'border'
            )}
          >
            {product.stock > 20 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
          </Badge>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl font-bold">{formatPrice(product.price)}</span>
          {product.discount > 0 && (
            <>
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              <Badge className="bg-accent/20 text-accent border-accent/30 border">
                Save {formatPrice(product.originalPrice - product.price)}
              </Badge>
            </>
          )}
        </div>

        <Separator />

        {/* Variants */}
        {product.variants.map((variant) => (
          <div key={variant.label} className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              {variant.label}:{' '}
              <span className="text-muted-foreground font-normal">
                {selectedVariants[variant.label] ?? 'Select'}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {variant.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.label]: opt }))}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm transition',
                    selectedVariants[variant.label] === opt
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Quantity */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Quantity</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid size-9 place-items-center rounded-lg border border-border hover:bg-muted transition"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-12 text-center font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
              className="grid size-9 place-items-center rounded-lg border border-border hover:bg-muted transition"
              aria-label="Increase quantity"
              disabled={product.stock === 0}
            >
              <Plus className="size-4" />
            </button>
            <span className="ml-2 text-xs text-muted-foreground">
              {product.stock > 0 ? `${product.stock} available` : 'Unavailable'}
            </span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            size="lg"
            className="flex-1"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart data-icon="inline-start" />
            Add to cart
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="flex-1"
            disabled={product.stock === 0}
            onClick={handleBuyNow}
          >
            <Zap data-icon="inline-start" />
            Buy now
          </Button>
          <Button
            size="lg"
            variant="outline"
            aria-label="Wishlist"
            onClick={() => toggleWishlist(product)}
            className={cn(wished && 'text-accent border-accent/60 bg-accent/10')}
          >
            <Heart className={cn('size-5', wished && 'fill-current')} />
          </Button>
          <Button size="lg" variant="outline" aria-label="Share" onClick={handleShare}>
            <Share2 className="size-5" />
          </Button>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Truck, label: 'Free shipping' },
            { icon: RotateCcw, label: '30-day returns' },
            { icon: ShieldCheck, label: '1yr warranty' },
            { icon: BadgeCheck, label: 'Genuine product' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 rounded-xl border border-border p-3 text-center">
              <Icon className="size-5 text-primary" />
              <span className="text-[11px] text-muted-foreground leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* Seller info */}
        <div className="flex items-center gap-3 rounded-xl border border-border p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
            <Package className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{product.sellerName}</p>
            <p className="text-xs text-muted-foreground">Verified seller · Ships worldwide</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto shrink-0">
            View store
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Rating Distribution ─────────────────────────────────────────────────────

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-4 text-right text-sm text-muted-foreground">{star}</span>
      <Star className="size-3.5 fill-warning text-warning shrink-0" />
      <Progress value={total > 0 ? (count / total) * 100 : 0} className="h-2 flex-1" />
      <span className="w-6 text-right text-sm text-muted-foreground">{count}</span>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function ProductTabs({ product, reviews }: { product: Product; reviews: Review[] }) {
  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <div className="mt-12">
      <Tabs defaultValue="description">
        <TabsList variant="line" className="w-full justify-start gap-4 border-b border-border rounded-none pb-0 h-auto bg-transparent">
          {['description', 'specifications', 'reviews', 'delivery'].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize pb-3 rounded-none">
              {t}
              {t === 'reviews' && <span className="ml-1 text-muted-foreground">({reviews.length})</span>}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="description" className="mt-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-3 font-display text-xl font-semibold">About this product</h2>
              <p className="leading-relaxed text-muted-foreground">{product.description}</p>
            </div>
            <div>
              <h3 className="mb-3 font-display text-lg font-semibold">Key features</h3>
              <ul className="flex flex-col gap-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-8">
          <h2 className="mb-4 font-display text-xl font-semibold">Specifications</h2>
          <div className="rounded-2xl border border-border overflow-hidden">
            {Object.entries(product.specifications).map(([key, val], i) => (
              <div
                key={key}
                className={cn(
                  'grid grid-cols-2 gap-4 px-5 py-3 text-sm',
                  i % 2 === 0 ? 'bg-muted/30' : 'bg-transparent',
                )}
              >
                <span className="font-medium text-muted-foreground">{key}</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-8">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            {/* Summary */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-border p-6 text-center">
                <p className="font-display text-6xl font-bold">{product.rating.toFixed(1)}</p>
                <StarRating rating={product.rating} className="mx-auto mt-2" />
                <p className="mt-1 text-sm text-muted-foreground">{product.reviewCount} reviews</p>
              </div>
              <div className="flex flex-col gap-2">
                {ratingDist.map(({ star, count }) => (
                  <RatingBar key={star} star={star} count={count} total={reviews.length} />
                ))}
              </div>
            </div>

            {/* Review list */}
            <div className="flex flex-col gap-6">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet. Be the first!</p>
              ) : (
                reviews.map((review) => <ReviewCard key={review.id} review={review} />)
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="mt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Truck,
                title: 'Free standard shipping',
                body: 'Delivered in 3–7 business days for orders over $50.',
              },
              {
                icon: Zap,
                title: 'Express delivery',
                body: 'Same-day or next-day delivery available in select cities.',
              },
              {
                icon: RotateCcw,
                title: '30-day easy returns',
                body: 'Not happy? Return within 30 days for a full refund.',
              },
              {
                icon: ShieldCheck,
                title: '1-year warranty',
                body: 'All products come with a minimum 1-year manufacturer warranty.',
              },
              {
                icon: BadgeCheck,
                title: '100% genuine',
                body: 'Every product is verified authentic and sold directly from authorized sellers.',
              },
              {
                icon: Package,
                title: 'Secure packaging',
                body: 'Products are packed securely to arrive in perfect condition.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border p-5">
                <Icon className="mb-3 size-6 text-primary" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ─── Review Card ─────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {review.author[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{review.author}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StarRating rating={review.rating} />
          {review.verified && (
            <BadgeCheck className="size-4 text-success ml-1" />
          )}
        </div>
      </div>
      <div>
        <p className="font-medium">{review.title}</p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{review.body}</p>
      </div>
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2">
          {review.images.map((img, i) => (
            <div key={i} className="relative size-16 overflow-hidden rounded-lg">
              <Image src={img} alt="Review photo" fill className="object-cover" sizes="64px" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
