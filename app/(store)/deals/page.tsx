import type { Metadata } from 'next'
import { ProductBrowser } from '@/components/catalog/product-browser'

export const metadata: Metadata = {
  title: 'Deals',
  description: 'The biggest discounts on GenZMart, live right now.',
}

export default function DealsPage() {
  return (
    <div className="flex flex-col">
      <div className="border-b border-border bg-grid">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">Limited time</span>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Deals & <span className="text-gradient">Drops</span>
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Every product here is discounted. Use code GENZ10 for an extra 10% off at checkout.
          </p>
        </div>
      </div>
      <ProductBrowser title="On sale" initialTag="deal" />
    </div>
  )
}
