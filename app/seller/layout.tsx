'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Warehouse,
  BarChart2,
  Star,
  Bell,
  Settings,
  Store,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/products', label: 'Products', icon: Package },
  { href: '/seller/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/seller/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/seller/reviews', label: 'Reviews', icon: Star },
  { href: '/seller/notifications', label: 'Notifications', icon: Bell },
  { href: '/seller/settings', label: 'Settings', icon: Settings },
]

export default function SellerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex items-center gap-2 border-b border-border p-5">
          <Link href="/" className="inline-flex items-center shrink-0 font-display text-lg font-extrabold tracking-tight group">
            <span className="text-foreground transition-colors group-hover:text-primary">GenZ</span>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Mart
            </span>
          </Link>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground ml-auto">
            Seller
          </span>
        </div>

        {/* Seller info */}
        <div className="flex items-center gap-2 border-b border-border p-4">
          <div className="grid size-9 place-items-center rounded-full bg-primary/20">
            <Store className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Sonicwave Official</p>
            <p className="text-xs text-muted-foreground">Active seller</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                isActive(href)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
              {isActive(href) && <ChevronRight className="ml-auto size-3.5" />}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" render={<Link href="/" />}>
            <LogOut className="size-4" /> Exit to store
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
        <Link href="/seller/dashboard" className="font-display text-sm font-bold">
          <span className="text-gradient">Seller</span> Center
        </Link>
        <div className="ml-auto flex gap-1 overflow-x-auto">
          {NAV.slice(0, 5).map(({ href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'grid size-8 place-items-center rounded-lg transition',
                isActive(href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <Icon className="size-4" />
            </Link>
          ))}
        </div>
      </div>

      <main className="flex-1 pt-14 lg:pt-0">
        <div className="mx-auto max-w-6xl p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
