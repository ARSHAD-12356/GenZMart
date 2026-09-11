'use client'

import Image from 'next/image'
import { Star, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { StarRating } from '@/components/product/star-rating'
import { formatDate } from '@/lib/format'
import { reviewService, orderService, productService } from '@/lib/services'
import { products } from '@/lib/mock-data'

// Derive: reviewed products from mock reviews authored by 'Aria K.'
const myReviews = products
  .flatMap((p) => reviewService.getForProduct(p.id).filter((r) => r.author === 'Aria K.').map((r) => ({ ...r, product: p })))

// Pending = delivered orders without reviews
const allOrders = orderService.getAll().filter((o) => o.orderStatus === 'Delivered')
const reviewedProductIds = new Set(myReviews.map((r) => r.productId))
const pendingReview = allOrders.flatMap((o) =>
  o.items
    .filter((i) => !reviewedProductIds.has(i.productId))
    .map((i) => ({ ...i, orderId: o.id, orderNumber: o.orderNumber })),
)

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">My Reviews</h1>
        <p className="text-sm text-muted-foreground">{myReviews.length} reviews written</p>
      </div>

      <Tabs defaultValue="written">
        <TabsList>
          <TabsTrigger value="written">Written ({myReviews.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingReview.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="written" className="mt-4 flex flex-col gap-4">
          {myReviews.length === 0 ? (
            <p className="text-muted-foreground text-sm">You haven&apos;t written any reviews yet.</p>
          ) : (
            myReviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start gap-4">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image src={r.product.images[0]} alt={r.product.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{r.product.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating rating={r.rating} />
                      <span className="text-xs text-muted-foreground">{formatDate(r.date)}</span>
                      {r.verified && <Badge className="text-xs bg-success/20 text-success">Verified</Badge>}
                    </div>
                    <p className="mt-1 font-medium text-sm">{r.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{r.body}</p>
                  </div>
                  <Button size="xs" variant="outline">Edit</Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4 flex flex-col gap-4">
          {pendingReview.length === 0 ? (
            <p className="text-muted-foreground text-sm">No pending reviews. All products reviewed!</p>
          ) : (
            pendingReview.map((item) => (
              <div key={`${item.orderId}-${item.productId}`} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-4">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Order: {item.orderNumber}</p>
                    <div className="mt-1.5 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="size-4 text-muted-foreground hover:text-warning cursor-pointer" />
                      ))}
                    </div>
                  </div>
                  <Button size="sm">
                    <MessageSquarePlus className="size-4" /> Write review
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
