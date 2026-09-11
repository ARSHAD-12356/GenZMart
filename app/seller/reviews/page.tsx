'use client'

import Image from 'next/image'
import { StarRating } from '@/components/product/star-rating'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { sellerService, reviewService } from '@/lib/services'

const SELLER_ID = 's1'

export default function SellerReviewsPage() {
  const products = sellerService.getProducts(SELLER_ID)
  const reviews = products.flatMap((p) => reviewService.getForProduct(p.id).map((r) => ({ ...r, productName: p.name, productImage: p.images[0] })))
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Reviews</h1>
          <p className="text-sm text-muted-foreground">{reviews.length} total · Avg {avgRating.toFixed(1)} ★</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2">
          <StarRating rating={avgRating} />
          <span className="font-bold">{avgRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-4">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image src={r.productImage} alt={r.productName} fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{r.author}</p>
                  <span className="text-xs text-muted-foreground">on</span>
                  <p className="text-sm text-primary">{r.productName}</p>
                  {r.verified && <Badge className="bg-success/20 text-success text-xs">Verified</Badge>}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <StarRating rating={r.rating} />
                  <span className="text-xs text-muted-foreground">{formatDate(r.date)}</span>
                </div>
                <p className="mt-1 font-medium text-sm">{r.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{r.body}</p>
              </div>
              <Button size="xs" variant="outline" className="shrink-0">Reply</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
