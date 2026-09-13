'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const pathname = usePathname()
  const { user, cartCount, wishlist } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide mobile nav in admin and seller routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/seller')) {
    return null
  }

  const items = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Explore',
      href: '/products',
      icon: Compass,
      isActive: pathname === '/products' || pathname.startsWith('/category') || pathname.startsWith('/search'),
    },
    {
      label: 'Wishlist',
      href: '/account/wishlist',
      icon: Heart,
      badge: mounted && wishlist.length > 0 ? wishlist.length : undefined,
      isActive: pathname === '/account/wishlist',
    },
    {
      label: 'Cart',
      href: '/cart',
      icon: ShoppingBag,
      badge: mounted && cartCount > 0 ? cartCount : undefined,
      isActive: pathname === '/cart',
    },
    {
      label: user ? 'Account' : 'Sign In',
      href: user ? '/account' : '/login',
      icon: User,
      isActive: pathname.startsWith('/account') || pathname === '/login',
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border/60 bg-background/85 px-2 backdrop-blur-xl md:hidden safe-area-pb"
      aria-label="Mobile navigation"
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors w-14',
              item.isActive
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <div className="relative">
              <Icon className={cn('size-5 transition-transform', item.isActive && 'scale-110')} />
              {item.badge !== undefined && (
                <Badge className="absolute -right-2.5 -top-1.5 size-4 justify-center rounded-full p-0 text-[9px] tabular-nums bg-accent text-accent-foreground font-bold pointer-events-none">
                  {item.badge > 9 ? '9+' : item.badge}
                </Badge>
              )}
            </div>
            <span className="truncate max-w-[56px] text-center leading-tight">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
