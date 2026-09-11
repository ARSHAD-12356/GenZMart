'use client'

import { StarRating } from '@/components/product/star-rating'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { adminService, reviewService } from '@/lib/services'

export default function AdminReviewsPage() {
  const products = adminService.getProducts()
  const reviews = products.flatMap((p) =>
    reviewService.getForProduct(p.id).map((r) => ({ ...r, productName: p.name })),
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Reviews</h1>
        <p className="text-sm text-muted-foreground">{reviews.length} total reviews</p>
      </div>

      <div className="flex flex-col gap-3">
        {reviews.slice(0, 20).map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{r.author}</span>
                  <span className="text-xs text-muted-foreground">on</span>
                  <span className="text-sm text-primary">{r.productName}</span>
                  {r.verified && <Badge className="text-xs bg-success/20 text-success">Verified</Badge>}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <StarRating rating={r.rating} />
                  <span className="text-xs text-muted-foreground">{formatDate(r.date)}</span>
                </div>
                <p className="mt-1 font-medium text-sm">{r.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{r.body}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="xs" variant="outline">Approve</Button>
                <Button size="xs" variant="outline" className="text-destructive">Hide</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
