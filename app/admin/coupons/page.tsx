'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { formatDate, formatPrice } from '@/lib/format'
import { coupons } from '@/lib/mock-data'

export default function AdminCouponsPage() {
  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(coupons.map((c) => [c.id, c.active])),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Coupons</h1>
          <p className="text-sm text-muted-foreground">{coupons.length} coupons</p>
        </div>
        <Button><Plus className="size-4" /> Create coupon</Button>
      </div>

      <div className="flex flex-col gap-4">
        {coupons.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Tag className="size-4 text-primary" />
                  <span className="font-mono font-bold text-primary">{c.code}</span>
                  <Badge className={active[c.id] ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}>
                    {active[c.id] ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>
                    {c.type === 'percentage' ? `${c.value}% off` : `${formatPrice(c.value)} off`}
                  </span>
                  <span>Min order: {formatPrice(c.minOrder)}</span>
                  {c.maxDiscount && <span>Max discount: {formatPrice(c.maxDiscount)}</span>}
                  <span>Expires: {formatDate(c.expiry)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={active[c.id]}
                  onCheckedChange={(v) => setActive((s) => ({ ...s, [c.id]: v }))}
                />
                <Button size="icon-sm" variant="ghost"><Pencil className="size-3.5" /></Button>
                <Button size="icon-sm" variant="ghost" className="text-destructive hover:bg-destructive/10"><Trash2 className="size-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
