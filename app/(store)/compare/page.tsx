'use client'

import Link from 'next/link'
import Image from 'next/image'
import { GitCompare, ShoppingCart, Trash2, ArrowLeft, Star, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { formatPrice } from '@/lib/format'
import { productService } from '@/lib/services'
import { useStore } from '@/components/providers/store-provider'
import { StarRating } from '@/components/product/star-rating'

export default function ComparePage() {
  const { compare, toggleCompare, addToCart } = useStore()
  const products = productService.getByIds(compare)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Compare Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? 's' : ''} selected for comparison
          </p>
        </div>
        <Button variant="ghost" size="sm" render={<Link href="/products" />}>
          <ArrowLeft className="size-4" /> Back to products
        </Button>
      </div>

      {products.length === 0 ? (
        <Empty className="my-12">
          <EmptyHeader>
            <EmptyMedia variant="icon"><GitCompare /></EmptyMedia>
            <EmptyTitle>No products to compare</EmptyTitle>
            <EmptyDescription>Add products from product cards to compare specifications side-by-side.</EmptyDescription>
          </EmptyHeader>
          <Button render={<Link href="/products" />}>Browse products</Button>
        </Empty>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-48 p-4 font-semibold text-muted-foreground">Product</th>
                {products.map((p) => (
                  <th key={p.id} className="min-w-[200px] p-4 font-semibold">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{p.name}</span>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => toggleCompare(p)}
                        aria-label="Remove from compare"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Preview image */}
              <tr>
                <td className="p-4 font-medium text-muted-foreground">Preview</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4">
                    <div className="relative aspect-square w-32 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={p.images[0] || '/placeholder.svg'}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr>
                <td className="p-4 font-medium text-muted-foreground">Price</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4">
                    <div className="flex items-baseline gap-1.5 font-display font-bold text-base">
                      {formatPrice(p.price)}
                      {p.discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through font-normal">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="p-4 font-medium text-muted-foreground">Rating</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={p.rating} />
                      <span className="text-xs text-muted-foreground">({p.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr>
                <td className="p-4 font-medium text-muted-foreground">Category</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 capitalize">
                    {p.category} / {p.subcategory}
                  </td>
                ))}
              </tr>

              {/* Brand */}
              <tr>
                <td className="p-4 font-medium text-muted-foreground">Brand</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 font-medium">
                    {p.brand}
                  </td>
                ))}
              </tr>

              {/* Availability */}
              <tr>
                <td className="p-4 font-medium text-muted-foreground">Stock</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.stock > 0 ? (
                      <Badge className="bg-success/20 text-success border-success/30 border">In stock ({p.stock})</Badge>
                    ) : (
                      <Badge variant="secondary">Sold out</Badge>
                    )}
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-4 font-medium text-muted-foreground">Action</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4">
                    <Button
                      size="sm"
                      disabled={p.stock === 0}
                      onClick={() => addToCart(p)}
                    >
                      <ShoppingCart className="size-3.5" /> Add to cart
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
