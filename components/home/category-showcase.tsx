import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { categoryService } from '@/lib/services'

const categories = categoryService.getAll()

export function CategoryShowcase() {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Shop by category</h2>
        <p className="text-sm text-muted-foreground">Find your vibe across five curated worlds.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className={`group relative overflow-hidden rounded-2xl border border-border ${i === 0 ? 'col-span-2 md:col-span-1' : ''}`}
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={c.image || '/placeholder.svg'}
                alt={c.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
              <div>
                <h3 className="font-display font-semibold">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.productCount} items</p>
              </div>
              <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition group-hover:opacity-100">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
