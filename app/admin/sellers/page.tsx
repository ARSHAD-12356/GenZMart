'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { StarRating } from '@/components/product/star-rating'
import { formatDate } from '@/lib/format'
import { adminService } from '@/lib/services'

const STATUS_COLOR: Record<string, string> = {
  active: 'bg-success/20 text-success',
  pending: 'bg-warning/20 text-warning',
  suspended: 'bg-destructive/20 text-destructive',
}

export default function AdminSellersPage() {
  const allSellers = adminService.getSellers()
  const [search, setSearch] = useState('')
  const sellers = allSellers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Sellers</h1>
        <p className="text-sm text-muted-foreground">{allSellers.length} sellers</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search sellers…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="flex flex-col gap-4">
        {sellers.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{s.name}</p>
                <Badge className={STATUS_COLOR[s.status]}>{s.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Joined {formatDate(s.joinedAt)} · {s.productCount} products</p>
              {s.rating > 0 && (
                <div className="mt-1 flex items-center gap-1">
                  <StarRating rating={s.rating} />
                  <span className="text-xs text-muted-foreground">{s.rating}</span>
                </div>
              )}
              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{s.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {s.status === 'pending' && (
                <>
                  <Button size="sm" className="bg-success/20 text-success hover:bg-success/30">
                    <CheckCircle className="size-4" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive">
                    <XCircle className="size-4" /> Reject
                  </Button>
                </>
              )}
              {s.status === 'active' && (
                <Button size="sm" variant="outline" className="text-warning border-warning/30">
                  <Ban className="size-4" /> Suspend
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
