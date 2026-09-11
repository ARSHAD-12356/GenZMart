'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Eye, GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from './star-rating'
import { QuickView } from './quick-view'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useStore } from '@/components/providers/store-provider'
import type { Product } from '@/lib/types'

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addToCart, toggleWishlist, isWishlisted, toggleCompare, isCompared } = useStore()
  const [quickOpen, setQuickOpen] = useState(false)
  const [imgSrc, setImgSrc] = useState(product.images[0] || '/placeholder.svg')
  const wished = isWishlisted(product.id)
  const compared = isCompared(product.id)
  const out = product.stock === 0

  return (
    <>
      <div
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_40px_-12px_oklch(0.86_0.2_128_/_0.35)]',
          className,
        )}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Link href={`/product/${product.slug}`} aria-label={product.name}>
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              onError={() => setImgSrc('/placeholder.svg')}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </Link>

          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.discount > 0 && (
              <Badge className="bg-accent text-accent-foreground shadow">-{product.discount}%</Badge>
            )}
            {product.tags.includes('new') && (
              <Badge className="bg-primary text-primary-foreground">New</Badge>
            )}
            {out && <Badge variant="secondary">Sold out</Badge>}
          </div>

          <div className="absolute right-3 top-3 flex flex-col gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="icon-sm"
              variant="secondary"
              aria-label="Add to wishlist"
              className={cn('rounded-full', wished && 'bg-accent text-accent-foreground')}
              onClick={() => toggleWishlist(product)}
            >
              <Heart className={cn(wished && 'fill-current')} />
            </Button>
            <Button
              size="icon-sm"
              variant="secondary"
              aria-label="Quick view"
              className="rounded-full"
              onClick={() => setQuickOpen(true)}
            >
              <Eye />
            </Button>
            <Button
              size="icon-sm"
              variant="secondary"
              aria-label="Compare"
              className={cn('rounded-full', compared && 'bg-primary text-primary-foreground')}
              onClick={() => toggleCompare(product)}
            >
              <GitCompare />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </span>
          <Link href={`/product/${product.slug}`} className="line-clamp-1 font-medium leading-tight hover:text-primary">
            {product.name}
          </Link>
          <p className="line-clamp-1 text-xs text-muted-foreground">{product.shortDescription}</p>
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} />
            <span className="text-xs text-muted-foreground">{product.rating.toFixed(1)} ({product.reviewCount})</span>
          </div>
          <div className="mt-auto flex items-end justify-between gap-2 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-lg font-bold">{formatPrice(product.price)}</span>
              {product.discount > 0 && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <Button
              size="icon-sm"
              aria-label="Add to cart"
              disabled={out}
              onClick={() => addToCart(product)}
            >
              <ShoppingCart />
            </Button>
          </div>
        </div>
      </div>
      <QuickView product={product} open={quickOpen} onOpenChange={setQuickOpen} />
    </>
  )
}
