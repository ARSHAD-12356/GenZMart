'use client'

import { useState } from 'react'
import {
  Package,
  Truck,
  CreditCard,
  Tag,
  Heart,
  BarChart2,
  Bell,
  BellOff,
  Check,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { formatRelative } from '@/lib/format'
import { notificationService } from '@/lib/services'
import type { AppNotification } from '@/lib/types'
import { cn } from '@/lib/utils'

const TYPE_ICON: Record<AppNotification['type'], React.ElementType> = {
  order: Package,
  shipment: Truck,
  delivery: Truck,
  payment: CreditCard,
  promo: Tag,
  'price-drop': BarChart2,
  stock: Bell,
}

const TYPE_COLOR: Record<AppNotification['type'], string> = {
  order: 'bg-primary/20 text-primary',
  shipment: 'bg-blue-500/20 text-blue-400',
  delivery: 'bg-success/20 text-success',
  payment: 'bg-warning/20 text-warning',
  promo: 'bg-accent/20 text-accent',
  'price-drop': 'bg-primary/20 text-primary',
  stock: 'bg-muted text-muted-foreground',
}

export default function NotificationsPage() {
  const allNotifications = notificationService.getAll()
  const [readState, setReadState] = useState<Record<string, boolean>>(
    Object.fromEntries(allNotifications.map((n) => [n.id, n.read])),
  )
  const [prefs, setPrefs] = useState({
    orders: true,
    shipping: true,
    promos: true,
    priceDrops: true,
    stock: false,
  })

  const markRead = (id: string) => setReadState((s) => ({ ...s, [id]: true }))
  const markAllRead = () => setReadState(Object.fromEntries(allNotifications.map((n) => [n.id, true])))
  const unreadCount = allNotifications.filter((n) => !readState[n.id]).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary hover:underline flex items-center gap-1">
            <Check className="size-4" /> Mark all as read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
        {allNotifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <BellOff className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          allNotifications.map((n) => {
            const Icon = TYPE_ICON[n.type]
            const isUnread = !readState[n.id]
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  'flex items-start gap-4 px-5 py-4 text-left transition hover:bg-muted/50',
                  isUnread && 'bg-primary/5',
                )}
              >
                <div className={cn('mt-0.5 grid size-9 shrink-0 place-items-center rounded-full', TYPE_COLOR[n.type])}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn('text-sm font-medium', isUnread && 'font-semibold')}>{n.title}</p>
                    {isUnread && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatRelative(n.date)}</p>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Notification preferences</h2>
        <div className="flex flex-col gap-4">
          {[
            { key: 'orders' as const, label: 'Order updates', desc: 'Order placed, confirmed, packed' },
            { key: 'shipping' as const, label: 'Shipping & delivery', desc: 'Shipment and delivery alerts' },
            { key: 'promos' as const, label: 'Promotions', desc: 'Flash sales, deals and drops' },
            { key: 'priceDrops' as const, label: 'Price drops', desc: 'Wishlist item price alerts' },
            { key: 'stock' as const, label: 'Back in stock', desc: 'Items back in stock alerts' },
          ].map(({ key, label, desc }) => (
            <div key={key}>
              <Label className="flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground font-normal">{desc}</p>
                </div>
                <Switch
                  checked={prefs[key]}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
                />
              </Label>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
