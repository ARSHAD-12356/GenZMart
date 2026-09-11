'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Heart,
  Star,
  RotateCcw,
  MapPin,
  Bell,
  User,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { useStore } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/account', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/reviews', label: 'My Reviews', icon: Star },
  { href: '/account/returns', label: 'Returns', icon: RotateCcw },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/notifications', label: 'Notifications', icon: Bell },
]

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, ready } = useStore()
  const isLoggingOutRef = useRef(false)

  useEffect(() => {
    if (ready && !user && !isLoggingOutRef.current) {
      router.replace('/login')
    }
  }, [user, ready, router])

  const handleSignOut = () => {
    isLoggingOutRef.current = true
    router.replace('/')
    logout()
  }

  if (!user) {
    return null
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-0 px-4 py-8 lg:gap-8 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 flex flex-col gap-2">
            {/* User info */}
            <div className="mb-2 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <Avatar className="size-11">
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                  {user.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-semibold capitalize">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-0.5">
              {NAV.map(({ href, label, icon: Icon, exact }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                    isActive(href, exact)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                  {isActive(href, exact) && <ChevronRight className="ml-auto size-3.5" />}
                </Link>
              ))}
            </nav>

            <Separator className="my-2" />

            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden w-full">
          {NAV.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                isActive(href, exact)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40',
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          ))}
        </div>

        {/* Main */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <SiteFooter />
    </div>
  )
}
