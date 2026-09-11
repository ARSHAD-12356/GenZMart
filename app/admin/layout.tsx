'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  Tag,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  Star,
  Ticket,
  Image as ImageIcon,
  BarChart2,
  Settings,
  Layers,
  ChevronRight,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/sellers', label: 'Sellers', icon: Store },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/returns', label: 'Returns', icon: RotateCcw },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex items-center gap-2 border-b border-border p-4">
          <Shield className="size-5 text-primary" />
          <div>
            <p className="font-display text-sm font-bold text-gradient">Admin</p>
            <p className="text-xs text-muted-foreground">GenZMart</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition',
                isActive(href)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
              {isActive(href) && <ChevronRight className="ml-auto size-3" />}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-2">
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" render={<Link href="/" />}>
            ← Exit to store
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-2 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden">
        <span className="font-display text-sm font-bold text-gradient shrink-0">Admin</span>
        {NAV.slice(0, 7).map(({ href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'grid size-8 shrink-0 place-items-center rounded-lg',
              isActive(href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
            )}
          >
            <Icon className="size-4" />
          </Link>
        ))}
      </div>

      <main className="flex-1 pt-14 lg:pt-0">
        <div className="mx-auto max-w-6xl p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
