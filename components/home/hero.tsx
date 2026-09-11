'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Star, Truck, ShieldCheck, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/format'
import { ShoppingAssistant } from './shopping-assistant'

interface CampaignItem {
  headlineLine1: string
  headlineLine2: string
  badge: string
  product: {
    id: string
    name: string
    slug: string
    category: string
    price: number
    originalPrice: number
    rating: number
    image: string
  }
}

const CAMPAIGN_ITEMS: CampaignItem[] = [
  {
    headlineLine1: 'Tech that',
    headlineLine2: 'fits your vibe.',
    badge: 'Featured Drop',
    product: {
      id: 'p1',
      name: 'Aurora Wireless Headphones',
      slug: 'aurora-wireless-headphones',
      category: 'Audio',
      price: 149,
      originalPrice: 229,
      rating: 4.8,
      image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp',
    },
  },
  {
    headlineLine1: 'Discover',
    headlineLine2: "what's next.",
    badge: 'Spatial Audio',
    product: {
      id: 'p2',
      name: 'Echo Buds Pro',
      slug: 'echo-buds-pro',
      category: 'Audio',
      price: 89,
      originalPrice: 129,
      rating: 4.6,
      image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp',
    },
  },
  {
    headlineLine1: 'Upgrade the',
    headlineLine2: 'way you live.',
    badge: 'Best Seller',
    product: {
      id: 'p7',
      name: 'Pulse Watch Series 5',
      slug: 'pulse-watch-series-5',
      category: 'Wearables',
      price: 229,
      originalPrice: 299,
      rating: 4.7,
      image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/1.webp',
    },
  },
  {
    headlineLine1: 'Your next',
    headlineLine2: 'tech obsession.',
    badge: 'Trending Tech',
    product: {
      id: 'p11',
      name: 'Strike Wireless Controller',
      slug: 'strike-wireless-controller',
      category: 'Gaming',
      price: 64,
      originalPrice: 89,
      rating: 4.7,
      image: 'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp',
    },
  },
  {
    headlineLine1: 'Built for',
    headlineLine2: 'how you move.',
    badge: 'Workstation Pro',
    product: {
      id: 'p23',
      name: 'Apex Pro Laptop 16',
      slug: 'apex-pro-laptop-16',
      category: 'Computing',
      price: 1299,
      originalPrice: 1499,
      rating: 4.9,
      image: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp',
    },
  },
  {
    headlineLine1: 'Find your',
    headlineLine2: 'next favorite.',
    badge: 'Desk Setup',
    product: {
      id: 'p27',
      name: 'Voyager Desk Mat & Organizer',
      slug: 'voyager-desk-mat-organizer',
      category: 'Lifestyle',
      price: 49,
      originalPrice: 69,
      rating: 4.6,
      image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/monopod/2.webp',
    },
  },
]

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 3D Tilt & Cursor Light State
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, lightX: 50, lightY: 50, active: false })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Change active campaign item with smooth transition
  const changeCampaignIndex = (newIdx: number) => {
    if (newIdx === activeIdx || isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveIdx(newIdx)
      setIsTransitioning(false)
    }, 250)
  }

  // Auto rotate showcase products synchronized with headlines every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveIdx((prev) => (prev + 1) % CAMPAIGN_ITEMS.length)
        setIsTransitioning(false)
      }, 250)
    }, 4500)
    return () => clearInterval(timer)
  }, [activeIdx])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const rotY = (x - 0.5) * 20
    const rotX = (0.5 - y) * 20

    setTilt({
      rotX,
      rotY,
      lightX: x * 100,
      lightY: y * 100,
      active: true,
    })
  }

  const handleMouseLeave = () => {
    setTilt((prev) => ({ ...prev, rotX: 0, rotY: 0, active: false }))
  }

  const currentCampaign = CAMPAIGN_ITEMS[activeIdx]
  const currentProduct = currentCampaign.product

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-grid min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 lg:py-16"
    >
      {/* Background ambient gradient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-primary/20 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-32 size-96 rounded-full bg-accent/20 blur-3xl animate-float-slower"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-8">
        {/* Left Column: Synchronized Hero Campaign Text & CTAs */}
        <div className="flex flex-col gap-6 justify-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="w-fit gap-1.5 border-primary/40 bg-primary/10 text-primary">
              <Sparkles className="size-3.5" /> {currentCampaign.badge}
            </Badge>
          </div>

          <div className="relative min-h-[120px] sm:min-h-[140px] flex items-center">
            <h1
              className={`font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl transition-all duration-500 ease-out ${
                isTransitioning
                  ? 'opacity-0 -translate-y-2 scale-[0.98]'
                  : 'opacity-100 translate-y-0 scale-100'
              }`}
            >
              {currentCampaign.headlineLine1}
              <br />
              <span className="text-gradient">{currentCampaign.headlineLine2}</span>
            </h1>
          </div>

          <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            GenZMart is the premium marketplace for the always-on generation. High-grade audio, wearables,
            gaming, computing and lifestyle gear engineered to move.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="h-12 px-6 text-sm glow-primary" render={<Link href="/products" />}>
              Shop the drop
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-sm" render={<Link href="/deals" />}>
              Today&apos;s deals
            </Button>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Star className="size-4 text-warning" /> 4.8/5 from 50k+ reviews</span>
            <span className="flex items-center gap-1.5"><Truck className="size-4 text-primary" /> Free 2-day shipping</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" /> Buyer protection</span>
          </div>
        </div>

        {/* Right Column: Floating 3D Interactive Presentation Stage (Synchronized) */}
        <div className="relative flex flex-col items-center justify-center py-2">
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex w-full max-w-md flex-col items-center justify-center p-2 sm:p-4"
            style={{ perspective: '1000px' }}
          >
            {/* Dynamic Interactive Radial Light Following Cursor */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-500"
              style={{
                background: tilt.active
                  ? `radial-gradient(400px circle at ${tilt.lightX}% ${tilt.lightY}%, oklch(0.86 0.2 128 / 0.18), transparent 70%)`
                  : 'radial-gradient(350px circle at 50% 50%, oklch(0.86 0.2 128 / 0.1), transparent 70%)',
              }}
            />

            {/* 3D Tilted Product Group Container */}
            <div
              className="relative flex w-full flex-col items-center gap-4 transition-transform duration-200 ease-out"
              style={{
                transform: !isMobile
                  ? `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale3d(${tilt.active ? 1.03 : 1}, ${tilt.active ? 1.03 : 1}, 1)`
                  : 'none',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Floating Tag Header Badge */}
              <div
                className="flex items-center justify-between gap-3 w-full px-2"
                style={{ transform: 'translateZ(25px)' }}
              >
                <Badge className="bg-primary/20 text-primary border border-primary/30 font-medium px-3 py-1 text-xs backdrop-blur-md shadow-sm">
                  {currentProduct.category} Drop
                </Badge>
                <div className="flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full backdrop-blur-md">
                  <Sparkles className="size-3.5" />
                  <span>UP TO 40% OFF</span>
                </div>
              </div>

              {/* Main Floating Product Image with Smooth Transition */}
              <div
                className="relative aspect-square w-full max-w-[300px] sm:max-w-[340px] flex items-center justify-center"
                style={{ transform: 'translateZ(45px)' }}
              >
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-primary/20 via-accent/10 to-transparent blur-2xl" />
                <Link href={`/product/${currentProduct.slug}`} className="relative block h-full w-full">
                  <Image
                    key={currentProduct.id}
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    fill
                    priority
                    className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 340px"
                  />
                </Link>
              </div>

              {/* Integrated Floating Product Bar */}
              <div
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-card/60 p-4 backdrop-blur-xl shadow-xl transition-all duration-300"
                style={{ transform: 'translateZ(30px)' }}
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {currentProduct.category}
                  </span>
                  <h3 className="truncate font-display text-base font-bold">
                    <Link href={`/product/${currentProduct.slug}`} className="hover:text-primary transition">
                      {currentProduct.name}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-display text-lg font-bold">{formatPrice(currentProduct.price)}</span>
                    <span className="text-xs text-muted-foreground line-through">{formatPrice(currentProduct.originalPrice)}</span>
                  </div>
                </div>

                <Button size="sm" className="shrink-0 glow-primary" render={<Link href={`/product/${currentProduct.slug}`} />}>
                  <ShoppingBag className="size-3.5" />
                  Shop now
                </Button>
              </div>
            </div>

            {/* Thumbnail Selectors (Synchronized with headlines & products) */}
            <div className="mt-5 flex items-center justify-center gap-2 z-10 flex-wrap">
              {CAMPAIGN_ITEMS.map((item, i) => (
                <button
                  key={item.product.id}
                  onClick={() => changeCampaignIndex(i)}
                  aria-label={`Showcase ${item.product.name}`}
                  className={`relative size-11 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                    activeIdx === i
                      ? 'border-primary scale-105 shadow-lg shadow-primary/20 bg-primary/10'
                      : 'border-border/60 bg-card/40 opacity-60 hover:opacity-100 hover:border-primary/50'
                  }`}
                >
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover p-1" sizes="44px" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ShoppingAssistant />
    </section>
  )
}

