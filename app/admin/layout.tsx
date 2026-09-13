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
  Menu,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
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
  const currentNavItem = NAV.find((item) => isActive(item.href)) || NAV[0]

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Sidebar Desktop */}
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
            <LogOut className="size-4 mr-2" /> Exit to store
          </Button>
        </div>
      </aside>

      {/* Mobile top bar & Sheet Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur-lg lg:hidden">
        <div className="flex items-center gap-2.5">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open admin menu">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 overflow-y-auto p-0 flex flex-col">
              <SheetHeader className="p-4 border-b border-border text-left">
                <div className="flex items-center gap-2">
                  <Shield className="size-5 text-primary" />
                  <div>
                    <SheetTitle className="font-display text-base font-bold text-gradient">
                      Admin Control Panel
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground">GenZMart Administration</p>
                  </div>
                </div>
              </SheetHeader>
              <nav className="flex flex-1 flex-col gap-1 p-3">
                {NAV.map(({ href, label, icon: Icon }) => (
                  <SheetClose
                    key={href}
                    render={
                      <Link
                        href={href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition font-medium',
                          isActive(href)
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span>{label}</span>
                        {isActive(href) && <ChevronRight className="ml-auto size-4" />}
                      </Link>
                    }
                  />
                ))}
              </nav>
              <div className="border-t border-border p-3 mt-auto">
                <SheetClose
                  render={
                    <Link
                      href="/"
                      className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted transition"
                    >
                      <LogOut className="size-4" />
                      <span>Exit to Store</span>
                    </Link>
                  }
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-display text-sm font-extrabold text-gradient">Admin</span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="truncate text-xs font-semibold text-foreground">{currentNavItem.label}</span>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-medium text-muted-foreground hover:text-primary transition"
        >
          Exit
        </Link>
      </div>

      <main className="flex-1 pt-14 lg:pt-0">
        <div className="mx-auto max-w-6xl p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
