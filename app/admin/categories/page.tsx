'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { categoryService } from '@/lib/services'

export default function AdminCategoriesPage() {
  const allCategories = categoryService.getAll()
  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(allCategories.map((c) => [c.id, true])),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">{allCategories.length} categories</p>
        </div>
        <Button><Plus className="size-4" /> Add category</Button>
      </div>

      <div className="flex flex-col gap-4">
        {allCategories.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{c.name}</h3>
                  <Badge className={active[c.id] ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}>
                    {active[c.id] ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.productCount} products · Subcategories: {c.subcategories.join(', ')}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon-sm" variant="ghost" onClick={() => setActive((s) => ({ ...s, [c.id]: !s[c.id] }))}>
                  {active[c.id] ? <ToggleRight className="size-4 text-success" /> : <ToggleLeft className="size-4 text-muted-foreground" />}
                </Button>
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
