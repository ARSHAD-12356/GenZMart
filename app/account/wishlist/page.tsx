'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { StarRating } from '@/components/product/star-rating'
import { formatPrice } from '@/lib/format'
import { productService } from '@/lib/services'
import { useStore } from '@/components/providers/store-provider'

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore()
  const products = productService.getByIds(wishlist)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Wishlist</h1>
        <p className="text-sm text-muted-foreground">{products.length} saved items</p>
      </div>

      {products.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><Heart /></EmptyMedia>
            <EmptyTitle>Your wishlist is empty</EmptyTitle>
            <EmptyDescription>Save products you love and buy them later.</EmptyDescription>
          </EmptyHeader>
          <Button render={<Link href="/products" />}>Browse products</Button>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
              <Link href={`/product/${product.slug}`} className="relative aspect-square bg-muted block overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{product.brand}</p>
                <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-medium hover:text-primary">
                  {product.name}
                </Link>
                <div className="flex items-center gap-1.5">
                  <StarRating rating={product.rating} />
                  <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <div>
                    <p className="font-display font-bold">{formatPrice(product.price)}</p>
                    {product.discount > 0 && (
                      <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon-sm"
                      disabled={product.stock === 0}
                      onClick={() => addToCart(product)}
                      aria-label="Add to cart"
                    >
                      <ShoppingCart />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      aria-label="Remove from wishlist"
                      onClick={() => toggleWishlist(product)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
