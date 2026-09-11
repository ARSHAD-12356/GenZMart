'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  CircleHelp,
  Heart,
  Package,
  Send,
  ShoppingBag,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/components/providers/store-provider'
import { formatDate, formatPrice } from '@/lib/format'
import { orderService, productService } from '@/lib/services'
import type { Order, Product } from '@/lib/types'
import { cn } from '@/lib/utils'

const BOT_IMAGE = 'https://t4.ftcdn.net/jpg/21/00/20/35/360_F_2100203506_T7f2NkoDojTkNAZajfddMRSo3IbiqiTy.jpg'

type Message = {
  id: number
  role: 'assistant' | 'user'
  text: string
  products?: Product[]
}

const QUICK_ACTIONS = [
  { label: 'Find a product', prompt: 'Show me something cool to shop' },
  { label: 'Track my order', prompt: 'Track my latest order' },
  { label: 'My cart', prompt: "What's in my cart?" },
  { label: 'My wishlist', prompt: 'Show my wishlist' },
  { label: 'Deals & offers', prompt: "Show me today's deals" },
  { label: 'Help me choose', prompt: 'Help me choose' },
]

const GREETING_WORDS = /^(hi|hii|hiii|hello|hey|hey there|good morning|good afternoon|good evening|how are you|what's up|thanks|thank you|bye)[!.? ]*$/i
const STOP_WORDS = new Set(['show', 'me', 'find', 'get', 'some', 'a', 'an', 'the', 'for', 'my', 'please', 'i', 'need', 'want', 'something', 'today', 'with', 'under', 'around', 'price', 'products', 'product'])

function AssistantAvatar({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn('assistant-avatar relative shrink-0 overflow-visible rounded-full', compact ? 'size-9' : 'size-16')}>
      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/70 via-accent/50 to-primary/20 blur-md" />
      <div className="relative size-full overflow-hidden rounded-full border-2 border-background shadow-[0_8px_24px_oklch(0.68_0.25_350_/_0.28)]">
        <Image src={BOT_IMAGE} alt="GenZAI bot" fill className="object-cover" sizes={compact ? '36px' : '48px'} />
      </div>
      <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-primary" />
    </div>
  )
}

function ProductMiniCard({
  product,
  onOpen,
  onAdd,
  onWishlist,
  wished,
}: {
  product: Product
  onOpen: () => void
  onAdd: () => void
  onWishlist: () => void
  wished: boolean
}) {
  return (
    <div className="group flex gap-2.5 rounded-xl border border-border/70 bg-background/55 p-2.5 transition hover:border-primary/50 hover:bg-background/80">
      <button onClick={onOpen} className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted" aria-label={`Open ${product.name}`}>
        <Image src={product.images[0] || '/placeholder.svg'} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="56px" />
      </button>
      <div className="min-w-0 flex-1">
        <button onClick={onOpen} className="block max-w-full text-left">
          <p className="truncate text-xs font-semibold hover:text-primary">{product.name}</p>
        </button>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
          <span>★ {product.rating.toFixed(1)}</span>
          {product.stock > 0 ? <span className="text-success">In stock</span> : <span className="text-destructive">Sold out</span>}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <button onClick={onAdd} disabled={product.stock === 0} className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            <ShoppingBag className="size-3" /> Add
          </button>
          <button onClick={onWishlist} className={cn('rounded-md p-1 transition hover:bg-accent/15', wished ? 'text-accent' : 'text-muted-foreground')} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}>
            <Heart className={cn('size-3.5', wished && 'fill-current')} />
          </button>
        </div>
      </div>
    </div>
  )
}

function getSearchProducts(input: string): Product[] {
  const query = input.toLowerCase()
  const maxPriceMatch = query.match(/(?:under|below|less than|up to)\s*[₹$]?\s*(\d+)/)
  const maxPrice = maxPriceMatch ? Number(maxPriceMatch[1]) : undefined
  const tokens = query
    .replace(/(?:under|below|less than|up to)\s*[₹$]?\s*\d+/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token))

  let products = productService.getAll().filter((product) => {
    const haystack = [product.name, product.category, product.subcategory, product.brand, product.shortDescription, ...product.tags].join(' ').toLowerCase()
    return tokens.length === 0 || tokens.some((token) => haystack.includes(token))
  })

  if (maxPrice !== undefined) products = products.filter((product) => product.price <= maxPrice)
  return products.sort((a, b) => (b.rating - a.rating) || (b.reviewCount - a.reviewCount)).slice(0, 3)
}

function makeGreeting(name?: string): Message {
  return {
    id: 1,
    role: 'assistant',
    text: name
      ? `Hey ${name.split(' ')[0]}! 👋 What can I help you find today?`
      : "Hey! 👋 Welcome to GenZMart! I'm your shopping buddy. What are you looking for today?",
  }
}

export function ShoppingAssistant() {
  const router = useRouter()
  const { user, cart, cartCount, cartSubtotal, wishlist, addToCart, toggleWishlist, ready } = useStore()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const [chooseStep, setChooseStep] = useState<'use' | 'budget' | null>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const messageIdRef = useRef(2)

  useEffect(() => {
    if (open && messages.length === 0) setMessages([makeGreeting(user?.name)])
  }, [open, messages.length, user?.name])

  useEffect(() => {
    const container = messagesRef.current
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const pushAssistant = (text: string, products?: Product[]) => {
    setMessages((current) => [...current, { id: messageIdRef.current++, role: 'assistant', text, products }])
  }

  const respond = (rawInput: string) => {
    const query = rawInput.trim()
    if (!query) return
    setMessages((current) => [...current, { id: messageIdRef.current++, role: 'user', text: query }])
    setInput('')
    setTyping(true)

    const lower = query.toLowerCase()
    const finish = (text: string, products?: Product[]) => {
      setTyping(false)
      pushAssistant(text, products)
    }

    if (GREETING_WORDS.test(query)) {
      const response = lower.includes('morning')
        ? 'Good morning! ☀️ Ready to find some cool tech?'
        : lower.includes('thanks') || lower.includes('thank')
          ? 'Anytime! 💚 Happy shopping!'
          : lower === 'bye'
            ? 'Catch you later! I’ll be here when your next tech obsession hits ✨'
            : `Hey${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! 👋 What can I help you find?`
      finish(response)
      return
    }

    if (lower.includes('help me choose') || lower.includes('choose') || lower.includes('recommend')) {
      setChooseStep('use')
      finish('Love that. What are you shopping for?', [])
      return
    }

    if (chooseStep === 'use') {
      setChooseStep('budget')
      finish(`Nice pick ✨ What's your budget for ${query}?`)
      return
    }

    if (chooseStep === 'budget') {
      setChooseStep(null)
      const products = getSearchProducts(query)
      finish(products.length ? 'I found a few smart picks for your vibe 💚' : 'I could not find a match in that budget. Try a different range?', products)
      return
    }

    if (lower.includes('cart') || lower.includes('basket')) {
      if (!cart.length) {
        finish('Your cart is feeling light ✨ Want me to find something fun to add?')
      } else {
        finish(`You have ${cartCount} item${cartCount === 1 ? '' : 's'} in your cart, worth ${formatPrice(cartSubtotal)}. Ready when you are 🛍️`)
      }
      return
    }

    if (lower.includes('wishlist') || lower.includes('saved')) {
      if (!wishlist.length) finish('Your wishlist is waiting for its first crush 💚')
      else finish(`You have ${wishlist.length} saved item${wishlist.length === 1 ? '' : 's'}. I can help you pick a favorite.`)
      return
    }

    if (lower.includes('deal') || lower.includes('offer') || lower.includes('sale')) {
      finish('Here are the deals getting the most love right now ⚡', productService.getDeals().slice(0, 3))
      return
    }

    if (lower.includes('order') || lower.includes('track') || lower.includes('delivered') || lower.includes('shipped')) {
      if (!ready || !user) {
        finish('Please log in first so I can securely access your order information.', [])
        return
      }
      const orders = orderService.getAll().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      const latest: Order | undefined = orders[0]
      if (!latest) finish('I could not find an order yet. Once you place one, I can keep an eye on it 📦')
      else finish(`Your latest order is #${latest.orderNumber} 📦\nStatus: ${latest.orderStatus}\nTotal: ${formatPrice(latest.total)}\nPlaced: ${formatDate(latest.createdAt)}`)
      return
    }

    const products = getSearchProducts(query)
    if (products.length) {
      finish('Here are a few picks that match your vibe ✨', products)
    } else {
      finish("I couldn't find that product. Want me to try headphones, gaming, wearables or deals?")
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    respond(input)
  }

  const handleQuickAction = (prompt: string) => respond(prompt)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-end px-3 sm:bottom-6 sm:px-8 lg:absolute lg:bottom-28 lg:z-30 lg:px-12">
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {open && (
          <div className="assistant-panel glass-strong w-[min(calc(100vw-2rem),380px)] overflow-hidden rounded-[1.5rem] shadow-2xl shadow-black/25 animate-in fade-in-0 slide-in-from-bottom-3 zoom-in-95 duration-300">
            <div className="flex items-center gap-3 border-b border-border/70 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 px-4 py-3">
              <AssistantAvatar compact />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-display text-sm font-bold">GenZAI</p>
                  <Sparkles className="size-3.5 text-accent" />
                </div>
                <p className="flex items-center gap-1 text-[10px] text-muted-foreground"><span className="size-1.5 rounded-full bg-primary" /> Online & ready to help</p>
              </div>
              <Button size="icon-sm" variant="ghost" onClick={() => setOpen(false)} aria-label="Close shopping assistant">
                <X className="size-4" />
              </Button>
            </div>

            <div ref={messagesRef} className="assistant-messages flex max-h-[min(52vh,430px)] min-h-64 flex-col gap-3 overflow-y-auto p-3">
              {messages.map((message) => (
                <div key={message.id} className={cn('flex max-w-[94%] gap-2 animate-in fade-in-0 slide-in-from-bottom-1 duration-300', message.role === 'user' && 'ml-auto flex-row-reverse')}>
                  {message.role === 'assistant' && <AssistantAvatar compact />}
                  <div className={cn('flex min-w-0 flex-col gap-2', message.role === 'user' ? 'items-end' : 'items-start')}>
                    <div className={cn('whitespace-pre-line rounded-2xl px-3 py-2 text-xs leading-relaxed', message.role === 'user' ? 'rounded-tr-sm bg-primary text-primary-foreground' : 'rounded-tl-sm bg-muted/80 text-foreground')}>
                      {message.text}
                    </div>
                    {message.products && message.products.length > 0 && (
                      <div className="flex w-full flex-col gap-2">
                        {message.products.map((product) => (
                          <ProductMiniCard
                            key={product.id}
                            product={product}
                            wished={wishlist.includes(product.id)}
                            onOpen={() => router.push(`/product/${product.slug}`)}
                            onAdd={() => addToCart(product)}
                            onWishlist={() => toggleWishlist(product)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {messages.length === 1 && !typing && (
                <div className="flex flex-wrap gap-1.5 pl-11">
                  {QUICK_ACTIONS.map((action) => (
                    <button key={action.label} onClick={() => handleQuickAction(action.prompt)} className="rounded-full border border-primary/25 bg-primary/5 px-2.5 py-1.5 text-[10px] font-semibold text-primary transition hover:border-primary/50 hover:bg-primary/10">
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
              {typing && (
                <div className="flex items-center gap-2 pl-1">
                  <AssistantAvatar compact />
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted/80 px-3 py-3">
                    <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.1s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-primary" />
                  </div>
                </div>
              )}
              <div />
            </div>

            <div className="border-t border-border/70 bg-background/35 p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 p-1.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10">
                <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask for a product, deal or order..." className="h-8 border-0 bg-transparent px-2 text-xs shadow-none focus-visible:ring-0" aria-label="Ask GenZ Assistant" />
                <Button type="submit" size="icon-sm" disabled={!input.trim() || typing} className="size-8 rounded-lg" aria-label="Send message">
                  <Send className="size-3.5" />
                </Button>
              </form>
              <p className="mt-2 flex items-center justify-center gap-1 text-[9px] text-muted-foreground"><Zap className="size-2.5 text-primary" /> Fast store-powered recommendations</p>
            </div>
          </div>
        )}

        {!open && (
          <div className="group flex items-center gap-2">
            <div className="pointer-events-none translate-x-2 rounded-full border border-primary/20 bg-background/85 px-3 py-1.5 text-[10px] font-semibold text-muted-foreground opacity-0 shadow-lg backdrop-blur transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
              Need help? Ask me 👋
            </div>
            <button onClick={() => setOpen(true)} className="assistant-launcher relative flex size-16 items-center justify-center rounded-full border border-primary/40 bg-background/80 shadow-[0_12px_40px_oklch(0.68_0.25_350_/_0.3)] backdrop-blur-xl transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30" aria-label="Open GenZAI shopping assistant">
              <div className="absolute inset-1 rounded-full border border-accent/20" />
              <span className="hidden lg:block"><AssistantAvatar /></span>
              <span className="lg:hidden"><AssistantAvatar compact /></span>
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg"><Sparkles className="size-3" /></span>
              <span className="assistant-hi absolute -left-8 -top-8 whitespace-nowrap rounded-full border border-primary/25 bg-background/90 px-2.5 py-1 text-[11px] font-bold text-primary shadow-lg backdrop-blur">Hii! 👋</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
