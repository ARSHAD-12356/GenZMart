import Link from 'next/link'
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'

const trust = [
  { icon: Truck, title: 'Free shipping', desc: 'On orders over $40' },
  { icon: RotateCcw, title: 'Easy returns', desc: '30-day money back' },
  { icon: ShieldCheck, title: 'Secure checkout', desc: 'Encrypted payments' },
  { icon: Headphones, title: '24/7 support', desc: 'Real humans, always' },
]

export function TrustBadges() {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {trust.map((t) => (
        <div key={t.title} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <t.icon className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium">{t.title}</p>
            <p className="text-xs text-muted-foreground">{t.desc}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 size-64 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative flex max-w-xl flex-col gap-4">
        <span className="text-sm font-semibold uppercase tracking-widest text-accent">Flash weekend</span>
        <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Members save an extra 15% with code <span className="text-gradient">GENZ10</span>
        </h2>
        <p className="text-muted-foreground">
          Sign up free and unlock student pricing, early drops and members-only bundles.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="h-12 px-6" render={<Link href="/signup" />}>
            Join GenZMart
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-6" render={<Link href="/deals" />}>
            Browse deals
          </Button>
        </div>
      </div>
    </section>
  )
}
