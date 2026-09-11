import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/types'

export function ProductRail({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title: string
  subtitle?: string
  products: Product[]
  viewAllHref?: string
}) {
  if (!products.length) return null
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-balance">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Button variant="ghost" size="sm" render={<Link href={viewAllHref} />}>
            View all
            <ArrowRight data-icon="inline-end" />
          </Button>
        )}
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[70%] shrink-0 snap-start sm:w-[280px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
