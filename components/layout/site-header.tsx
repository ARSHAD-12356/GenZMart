'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/providers/theme-provider'
import {
  Search,
  Heart,
  ShoppingBag,
  GitCompare,
  User,
  LogIn,
  LogOut,
  Menu,
  Bell,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Sun,
  Moon,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { notificationService, productService } from '@/lib/services'
import { formatPrice } from '@/lib/format'
import { useStore } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'

interface SubGroup {
  title: string
  items: string[]
}

interface CategoryNavConfig {
  slug: string
  name: string
  groups: SubGroup[]
}

const CATEGORY_NAV_CONFIG: CategoryNavConfig[] = [
  {
    slug: 'audio',
    name: 'Audio',
    groups: [
      {
        title: 'Shop Audio',
        items: ['Headphones', 'Earbuds', 'Speakers'],
      },
      {
        title: 'Explore',
        items: ['Microphones', 'Audio Accessories'],
      },
    ],
  },
  {
    slug: 'wearables',
    name: 'Wearables',
    groups: [
      {
        title: 'Trackers & Watches',
        items: ['Smartwatches', 'Fitness Bands'],
      },
      {
        title: 'Next-Gen Tech',
        items: ['Smart Rings', 'Wearable Accessories'],
      },
    ],
  },
  {
    slug: 'gaming',
    name: 'Gaming',
    groups: [
      {
        title: 'Control & Input',
        items: ['Controllers', 'Gaming Keyboards', 'Gaming Mice'],
      },
      {
        title: 'Audio & Gear',
        items: ['Gaming Headsets', 'Gaming Accessories'],
      },
    ],
  },
  {
    slug: 'mobile',
    name: 'Mobile',
    groups: [
      {
        title: 'Devices',
        items: ['Smartphones', 'Tablets'],
      },
      {
        title: 'Power & Protection',
        items: ['Power Banks', 'Chargers', 'Phone Cases', 'Mobile Accessories'],
      },
    ],
  },
  {
    slug: 'computing',
    name: 'Computing',
    groups: [
      {
        title: 'Core Gear',
        items: ['Laptops', 'Monitors'],
      },
      {
        title: 'Peripherals & Storage',
        items: ['Keyboards', 'Mice', 'Webcams', 'Storage', 'Computer Accessories'],
      },
    ],
  },
  {
    slug: 'lifestyle',
    name: 'Lifestyle',
    groups: [
      {
        title: 'Setup & Tech',
        items: ['Desk Setup', 'Smart Accessories'],
      },
      {
        title: 'Everyday Carry',
        items: ['Travel Tech', 'Everyday Gadgets', 'Lifestyle Accessories'],
      },
    ],
  },
]

function HeaderBadge({ count }: { count: number }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !count) return null

  return (
    <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px] tabular-nums bg-accent text-accent-foreground font-semibold pointer-events-none">
      {count > 9 ? '9+' : count}
    </Badge>
  )
}

export function SiteHeader() {
  const router = useRouter()
  const { user, logout, cartCount, wishlist, compare } = useStore()
  const [query, setQuery] = useState('')
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null)
  const [mobileExpandedSlug, setMobileExpandedSlug] = useState<string | null>(null)
  const [unread, setUnread] = useState(0)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const desktopSearchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const updateUnread = () => {
      setUnread(notificationService.getAll().filter((n) => !n.read).length)
    }

    updateUnread()
    window.addEventListener('genz_notifications_updated', updateUnread)
    return () => window.removeEventListener('genz_notifications_updated', updateUnread)
  }, [])

  // Close search dropdown on click outside desktop or mobile containers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const isOutsideDesktop = !desktopSearchRef.current || !desktopSearchRef.current.contains(target)
      const isOutsideMobile = !mobileSearchRef.current || !mobileSearchRef.current.contains(target)
      if (isOutsideDesktop && isOutsideMobile) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchResults = query.trim()
    ? productService.query({ search: query.trim(), perPage: 5 }).items
    : []

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSearchDropdown(false)
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleMouseEnterCategory = (slug: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
    setActiveCategorySlug(slug)
  }

  const handleMouseLeaveNav = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveCategorySlug(null)
    }, 140)
  }

  const handleMouseEnterDropdown = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
  }

  const activeCategory = CATEGORY_NAV_CONFIG.find((c) => c.slug === activeCategorySlug)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex flex-col justify-center px-3 py-2 sm:px-4 lg:h-16 lg:py-0 max-w-7xl lg:px-8">
        <div className="flex items-center justify-between gap-2">
          {/* Menu Trigger & Brand Logo grouped tightly */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile menu sheet trigger */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="lg:hidden shrink-0" aria-label="Open mobile menu">
                    <Menu className="size-5" />
                  </Button>
                }
              />
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-display text-xl font-extrabold tracking-tight">
                    <span className="text-foreground">GenZ</span>
                    <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                      Mart
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 px-1">
                  {!user ? (
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/login"
                          className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          <LogIn className="size-4" />
                          <span>Sign In / Register</span>
                        </Link>
                      }
                    />
                  ) : (
                    <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/40 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold capitalize text-foreground">{user.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <SheetClose
                          nativeButton={false}
                          render={
                            <Link
                              href="/account"
                              className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition shrink-0"
                            >
                              Account
                            </Link>
                          }
                        />
                      </div>
                      <SheetClose
                        nativeButton={false}
                        render={
                          <button
                            onClick={() => {
                              logout()
                              router.replace('/')
                            }}
                            className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition"
                          >
                            <LogOut className="size-3.5" />
                            <span>Sign Out</span>
                          </button>
                        }
                      />
                    </div>
                  )}
                </div>
                <nav className="flex flex-col gap-1.5 px-3 mt-4">
                  {CATEGORY_NAV_CONFIG.map((c) => {
                    const isExpanded = mobileExpandedSlug === c.slug
                    return (
                      <div key={c.slug} className="flex flex-col rounded-lg border border-border/40 bg-muted/20 overflow-hidden">
                        <button
                          onClick={() => setMobileExpandedSlug(isExpanded ? null : c.slug)}
                          className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <span>{c.name}</span>
                          <ChevronDown
                            className={cn('size-4 text-muted-foreground transition-transform duration-200', isExpanded && 'rotate-180 text-primary')}
                          />
                        </button>

                        {isExpanded && (
                          <div className="flex flex-col gap-1.5 bg-background/60 p-3 border-t border-border/40">
                            {c.groups.map((group) => (
                              <div key={group.title} className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2 pt-1">
                                  {group.title}
                                </span>
                                {group.items.map((sub) => (
                                  <SheetClose
                                    key={sub}
                                    nativeButton={false}
                                    render={
                                      <Link
                                        href={`/category/${c.slug}?subcategory=${encodeURIComponent(sub)}`}
                                        className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                                      >
                                        {sub}
                                      </Link>
                                    }
                                  />
                                ))}
                              </div>
                            ))}
                            <div className="pt-2 border-t border-border/30 mt-1">
                              <SheetClose
                                nativeButton={false}
                                render={
                                  <Link
                                    href={`/category/${c.slug}`}
                                    className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold text-primary hover:underline"
                                  >
                                    <span>Browse all {c.name}</span>
                                    <ArrowRight className="size-3" />
                                  </Link>
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href="/deals"
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-accent hover:bg-accent/10 transition mt-2"
                      >
                        <Sparkles className="size-4" />
                        Deals & Drops
                      </Link>
                    }
                  />
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href="/products"
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
                      >
                        All Catalog Products
                      </Link>
                    }
                  />
                </nav>
              </SheetContent>
            </Sheet>

            {/* Wordmark Logo */}
            <Link href="/" className="flex items-center shrink-0 font-display text-xl font-extrabold tracking-tight group">
              <span className="text-foreground transition-colors group-hover:text-primary">GenZ</span>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Mart
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="mx-2 hidden items-center gap-1 lg:flex relative"
            onMouseLeave={handleMouseLeaveNav}
          >
            {CATEGORY_NAV_CONFIG.map((c) => {
              const isOpen = activeCategorySlug === c.slug
              return (
                <div
                  key={c.slug}
                  className="relative"
                  onMouseEnter={() => handleMouseEnterCategory(c.slug)}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveCategorySlug((prev) => (prev === c.slug ? null : c.slug))
                    }}
                    className={cn(
                      'group inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors focus:outline-none',
                      isOpen
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                    )}
                    aria-expanded={isOpen}
                  >
                    <span>{c.name}</span>
                    <ChevronDown
                      className={cn(
                        'size-3.5 text-muted-foreground/70 transition-transform duration-200 group-hover:text-foreground',
                        isOpen && 'rotate-180 text-primary',
                      )}
                    />
                  </button>

                  {/* Mega Dropdown */}
                  {isOpen && activeCategory && (
                    <div
                      className="absolute left-0 top-full pt-2 z-50 min-w-[340px] max-w-md animate-in fade-in-0 slide-in-from-top-1.5 duration-200 ease-out"
                      onMouseEnter={handleMouseEnterDropdown}
                      onMouseLeave={handleMouseLeaveNav}
                    >
                      <div className="relative overflow-hidden rounded-xl border border-border/60 bg-popover/95 text-popover-foreground p-4 shadow-2xl backdrop-blur-xl ring-1 ring-border/30">
                        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

                        <div className="grid grid-cols-2 gap-4">
                          {activeCategory.groups.map((group) => (
                            <div key={group.title} className="flex flex-col gap-2">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/70 border-b border-border/40 pb-1">
                                {group.title}
                              </span>
                              <div className="flex flex-col gap-1">
                                {group.items.map((sub) => (
                                  <Link
                                    key={sub}
                                    href={`/category/${activeCategory.slug}?subcategory=${encodeURIComponent(sub)}`}
                                    onClick={() => setActiveCategorySlug(null)}
                                    className="group/sub flex items-center justify-between rounded-md px-2 py-1 text-xs font-medium text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all duration-150"
                                  >
                                    <span>{sub}</span>
                                    <span className="opacity-0 -translate-x-1 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all text-primary text-[10px]">
                                      →
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground/70">GenZMart {activeCategory.name}</span>
                          <Link
                            href={`/category/${activeCategory.slug}`}
                            onClick={() => setActiveCategorySlug(null)}
                            className="flex items-center gap-1 font-semibold text-primary hover:text-accent transition-colors"
                          >
                            <span>Explore all</span>
                            <ArrowRight className="size-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            <Button
              variant="ghost"
              size="sm"
              className="px-3 text-sm font-semibold text-accent hover:text-accent hover:bg-accent/10 ml-1"
              render={<Link href="/deals" />}
            >
              <Sparkles className="size-3.5 mr-1" />
              Deals
            </Button>
          </nav>

          {/* Desktop Search Bar with Live Autocomplete Panel */}
          <div ref={desktopSearchRef} className="relative mx-2 hidden w-44 min-w-0 max-w-xs flex-1 md:block lg:w-56 transition-all focus-within:w-64">
            <form onSubmit={onSearch}>
              <InputGroup>
                <InputGroupInput
                  placeholder="Search products..."
                  value={query}
                  onFocus={() => setShowSearchDropdown(true)}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowSearchDropdown(true)
                  }}
                  className="h-9 text-xs"
                />
                <InputGroupAddon>
                  <Search className="size-3.5" />
                </InputGroupAddon>
              </InputGroup>
            </form>

            {showSearchDropdown && query.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-border/80 bg-popover/98 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-border/30 animate-in fade-in-0 slide-in-from-top-1">
                {searchResults.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    No products match &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          setShowSearchDropdown(false)
                          setQuery('')
                          router.push(`/product/${product.slug}`)
                        }}
                        onClick={() => {
                          setShowSearchDropdown(false)
                          setQuery('')
                        }}
                        className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <div className="relative size-8 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                          <Image
                            src={product.images[0] || '/placeholder.svg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-xs font-semibold text-foreground leading-tight">{product.name}</p>
                          <p className="truncate text-[10px] text-muted-foreground">{product.brand} · {product.category}</p>
                        </div>
                        <span className="shrink-0 text-xs font-bold text-primary">{formatPrice(product.price)}</span>
                      </Link>
                    ))}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        onSearch(e)
                      }}
                      onClick={(e) => {
                        onSearch(e)
                      }}
                      className="mt-1 flex items-center justify-between rounded-lg bg-muted/60 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 transition cursor-pointer"
                    >
                      <span>View all results</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile & Desktop Header Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Notification Icon Button (Mobile & Desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="relative shrink-0"
              aria-label="Notifications"
              render={<Link href={user ? "/account/notifications" : "/login"} />}
            >
              <Bell className="size-4" />
              {mounted && <HeaderBadge count={unread} />}
            </Button>

            {/* Shopping Cart Icon Button (Mobile & Desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="relative shrink-0"
              aria-label="Shopping Cart"
              render={<Link href="/cart" />}
            >
              <ShoppingBag className="size-4" />
              {mounted && <HeaderBadge count={cartCount} />}
            </Button>

            {/* Desktop Only Wishlist & Compare */}
            {mounted && user && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden sm:inline-flex shrink-0"
                  aria-label="Compare products"
                  render={<Link href="/compare" />}
                >
                  <GitCompare className="size-4" />
                  <HeaderBadge count={compare.length} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden sm:inline-flex shrink-0"
                  aria-label="Wishlist"
                  render={<Link href="/account/wishlist" />}
                >
                  <Heart className="size-4" />
                  <HeaderBadge count={wishlist.length} />
                </Button>
              </>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Account / Sign In */}
            {!user ? (
              <Button
                size="sm"
                className="relative ml-0.5 shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] text-primary-foreground font-bold text-xs px-3 py-1.5 shadow-sm shadow-primary/20 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 gap-1 border border-primary/20"
                render={<Link href="/login" />}
              >
                <LogIn className="size-3.5" />
                <span className="font-semibold tracking-wide text-xs whitespace-nowrap">Sign In</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="relative ml-0.5 shrink-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Account"
                title={user.name || "Account"}
                render={<Link href="/account" />}
              >
                <div className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">
                  {user.name ? user.name[0].toUpperCase() : <User className="size-4" />}
                </div>
              </Button>
            )}
          </div>
        </div>

        {/* Dedicated Mobile Search Bar with Live Autocomplete Dropdown */}
        <div ref={mobileSearchRef} className="relative mt-2 block md:hidden w-full pb-0.5">
          <form onSubmit={onSearch}>
            <InputGroup className="bg-muted/40 rounded-xl border border-border/50">
              <InputGroupInput
                placeholder="Search products..."
                value={query}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setShowSearchDropdown(true)
                }}
                className="h-8.5 text-xs border-none bg-transparent focus-visible:ring-0"
              />
              <InputGroupAddon>
                <Search className="size-3.5 text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </form>

          {showSearchDropdown && query.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-border/80 bg-popover/98 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-border/30 animate-in fade-in-0 slide-in-from-top-1">
              {searchResults.length === 0 ? (
                <div className="p-3 text-center text-xs text-muted-foreground">
                  No products match &ldquo;{query}&rdquo;
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        setShowSearchDropdown(false)
                        setQuery('')
                        router.push(`/product/${product.slug}`)
                      }}
                      onClick={() => {
                        setShowSearchDropdown(false)
                        setQuery('')
                      }}
                      className="flex items-center gap-3 rounded-lg p-2 hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                        <Image
                          src={product.images[0] || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground leading-tight">{product.name}</p>
                        <p className="truncate text-[10px] text-muted-foreground">{product.brand} · {product.category}</p>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-primary">{formatPrice(product.price)}</span>
                    </Link>
                  ))}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      onSearch(e)
                    }}
                    onClick={(e) => {
                      onSearch(e)
                    }}
                    className="mt-1 flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/15 transition cursor-pointer"
                  >
                    <span>View all results for &ldquo;{query}&rdquo;</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" className="shrink-0">
        <Sun className="size-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark' || theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className="shrink-0"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? (
        <Sun className="size-4 text-warning transition-transform hover:rotate-45" />
      ) : (
        <Moon className="size-4 text-accent transition-transform hover:-rotate-12" />
      )}
    </Button>
  )
}

