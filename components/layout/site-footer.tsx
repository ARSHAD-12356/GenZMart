'use client'

import Link from 'next/link'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { categoryService } from '@/lib/services'
import { toast } from 'sonner'

// Inline SVG brand icons — lucide-react removed brand logos in v1.0
function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

const socialLinks = [
  { Icon: IconInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: IconX, href: 'https://x.com', label: 'X (Twitter)' },
  { Icon: IconYoutube, href: 'https://youtube.com', label: 'YouTube' },
]

const cats = categoryService.getAll()

const columns = [
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Admin Panel', '/admin/dashboard'],
      ['Careers', '/careers'],
      ['Sustainability', '/sustainability'],
    ],
  },
  {
    title: 'Support',
    links: [
      ['Help Center', '/support'],
      ['Track Order', '/account/orders'],
      ['Returns', '/returns'],
      ['Shipping', '/shipping'],
    ],
  },
  {
    title: 'Sell & Admin',
    links: [
      ['Become a Seller', '/seller'],
      ['Seller Center', '/seller/dashboard'],
      ['Admin Dashboard', '/admin/dashboard'],
      ['Brand Partners', '/brands'],
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background ambient brand glow */}
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.4fr]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex items-center shrink-0 font-display text-xl font-extrabold tracking-tight group">
              <span className="text-white transition-colors group-hover:text-primary">GenZ</span>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Mart
              </span>
            </Link>
            <p className="max-w-xs text-sm text-slate-400">
              The premium marketplace built for the always-on generation. Shop bold. Live loud.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ Icon, href, label }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="icon"
                  className="rounded-full border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                  aria-label={label}
                  render={<a href={href} target="_blank" rel="noopener noreferrer" />}
                >
                  <Icon className="size-4" />
                </Button>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="font-display text-sm font-semibold text-slate-200">{col.title}</h3>
              {col.links.map(([label, href]) => (
                <Link key={label} href={href} className="text-sm text-slate-400 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold text-slate-200">Stay in the loop</h3>
            <p className="text-sm text-slate-400">Drops, deals and early access — straight to your inbox.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                toast('Subscribed', { description: "You're on the list." })
              }}
            >
              <InputGroup className="bg-slate-900/80 border-slate-800">
                <InputGroupInput type="email" required placeholder="you@email.com" className="text-slate-100 placeholder:text-slate-500" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton type="submit" size="icon-xs" aria-label="Subscribe">
                    <Send />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </div>
        </div>

        <div className="my-8 h-px bg-slate-800/80" />

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Shop by category:</span>
          {cats.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="text-xs text-slate-400 hover:text-primary transition-colors">
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-slate-400 sm:flex-row">
          <p className="flex flex-wrap items-center gap-1.5">
            <span>© {new Date().getFullYear()} GenZMart. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span>Developed by</span>
            <span className="font-extrabold bg-gradient-to-r from-primary via-accent to-emerald-400 bg-clip-text text-transparent animate-gradient-flow">
              ArshXcoder
            </span>
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
