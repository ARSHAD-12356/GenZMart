import { ProductCard } from './product-card'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

export function ProductGrid({
  products,
  className,
}: {
  products: Product[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4',
        className,
      )}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
