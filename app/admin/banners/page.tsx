'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, ToggleLeft, ToggleRight, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const MOCK_BANNERS = [
  { id: 'b1', title: 'Summer Sale — Up to 50% off', type: 'homepage', active: true, image: '/placeholder.svg?height=400&width=1200&query=sale+banner+neon+lime' },
  { id: 'b2', title: 'New Audio Drops', type: 'promotional', active: true, image: '/placeholder.svg?height=400&width=1200&query=audio+promo+banner' },
  { id: 'b3', title: 'Gaming Week Flash Deal', type: 'homepage', active: false, image: '/placeholder.svg?height=400&width=1200&query=gaming+sale+banner+neon' },
]

export default function AdminBannersPage() {
  const [banners, setBanners] = useState(MOCK_BANNERS)
  const toggle = (id: string) => setBanners((b) => b.map((ban) => ban.id === id ? { ...ban, active: !ban.active } : ban))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Banners</h1>
          <p className="text-sm text-muted-foreground">{banners.length} banners</p>
        </div>
        <Button><Plus className="size-4" /> Add banner</Button>
      </div>

      <div className="flex flex-col gap-4">
        {banners.map((b) => (
          <div key={b.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="relative aspect-[4/1] bg-muted">
              <Image src={b.image} alt={b.title} fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-background/40" />
              <p className="absolute bottom-3 left-4 font-display text-lg font-bold text-white">{b.title}</p>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">{b.type}</Badge>
                <Badge className={b.active ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}>
                  {b.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button size="icon-sm" variant="ghost" onClick={() => toggle(b.id)}>
                  {b.active ? <ToggleRight className="size-4 text-success" /> : <ToggleLeft className="size-4 text-muted-foreground" />}
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
