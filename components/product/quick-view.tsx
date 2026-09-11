'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from './star-rating'
import { formatPrice } from '@/lib/format'
import { useStore } from '@/components/providers/store-provider'
import type { Product } from '@/lib/types'

export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { addToCart } = useStore()
  if (!product) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square bg-muted">
            <Image
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 384px"
            />
            {product.discount > 0 && (
              <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
                -{product.discount}%
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-4 p-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {product.brand}
              </span>
              <DialogTitle className="font-display text-xl leading-tight">{product.name}</DialogTitle>
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} />
                <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
              </div>
            </div>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </DialogDescription>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="mt-auto flex flex-col gap-2">
              <Button
                size="lg"
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
              >
                <ShoppingCart data-icon="inline-start" />
                {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
              </Button>
              <Button size="lg" variant="outline" render={<Link href={`/product/${product.slug}`} />}>
                View full details
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
