'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@/components/ui/select'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { ProductGrid } from '@/components/product/product-grid'
import { StarRating } from '@/components/product/star-rating'
import { productService, brandService, categoryService } from '@/lib/services'
import { formatPrice } from '@/lib/format'

const allBrands = brandService.getAll()
const allCategories = categoryService.getAll()
const [PRICE_MIN, PRICE_MAX] = productService.getPriceBounds()

const sortOptions = [
  ['recommended', 'Recommended'],
  ['newest', 'Newest'],
  ['price-asc', 'Price: Low to High'],
  ['price-desc', 'Price: High to Low'],
  ['rating', 'Top rated'],
  ['popular', 'Most reviewed'],
] as const

const PER_PAGE = 12

export function ProductBrowser({
  title,
  initialSearch,
  initialCategory,
  initialSubcategory,
  initialTag,
  lockCategory,
}: {
  title: string
  initialSearch?: string
  initialCategory?: string
  initialSubcategory?: string
  initialTag?: string
  lockCategory?: boolean
}) {
  const [brands, setBrands] = useState<string[]>([])
  const [category, setCategory] = useState<string | undefined>(initialCategory)
  const [subcategory, setSubcategory] = useState<string | undefined>(initialSubcategory)
  const [price, setPrice] = useState<[number, number]>([PRICE_MIN, PRICE_MAX])
  const [minRating, setMinRating] = useState(0)
  const [onlyDiscount, setOnlyDiscount] = useState(initialTag === 'deal')
  const [inStock, setInStock] = useState(false)
  const [sort, setSort] = useState('recommended')
  const [page, setPage] = useState(1)

  const { items, total } = useMemo(
    () =>
      productService.query({
        search: initialSearch,
        category,
        subcategory,
        brand: brands,
        minPrice: price[0],
        maxPrice: price[1],
        minRating: minRating || undefined,
        onlyDiscount,
        inStock,
        sort,
        tags: initialTag && initialTag !== 'deal' ? [initialTag] : undefined,
        page,
        perPage: PER_PAGE,
      }),
    [initialSearch, category, subcategory, brands, price, minRating, onlyDiscount, inStock, sort, initialTag, page],
  )

  const pages = Math.max(1, Math.ceil(total / PER_PAGE))
  const activeFilters =
    brands.length + (minRating ? 1 : 0) + (onlyDiscount ? 1 : 0) + (inStock ? 1 : 0) +
    (price[0] !== PRICE_MIN || price[1] !== PRICE_MAX ? 1 : 0) +
    (!lockCategory && category ? 1 : 0)

  const reset = () => {
    setBrands([])
    setPrice([PRICE_MIN, PRICE_MAX])
    setMinRating(0)
    setOnlyDiscount(false)
    setInStock(false)
    if (!lockCategory) setCategory(undefined)
    setPage(1)
  }

  const toggleBrand = (name: string) => {
    setPage(1)
    setBrands((prev) => (prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]))
  }

  const Filters = (
    <div className="flex flex-col gap-6">
      {!lockCategory && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Category</h3>
          <div className="flex flex-col gap-2">
            <button
              className={`text-left text-sm ${!category ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => { setCategory(undefined); setPage(1) }}
            >
              All categories
            </button>
            {allCategories.map((c) => (
              <button
                key={c.id}
                className={`text-left text-sm ${category === c.slug ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => { setCategory(c.slug); setPage(1) }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Price range</h3>
        <Slider
          value={price}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={10}
          onValueChange={(v) => { setPrice(v as [number, number]); setPage(1) }}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatPrice(price[0])}</span>
          <span>{formatPrice(price[1])}</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Brand</h3>
        {allBrands.map((b) => (
          <Label key={b.id} className="flex items-center gap-2.5 text-sm font-normal">
            <Checkbox checked={brands.includes(b.name)} onCheckedChange={() => toggleBrand(b.name)} />
            {b.name}
          </Label>
        ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Rating</h3>
        {[4, 3, 2].map((r) => (
          <button
            key={r}
            onClick={() => { setMinRating(minRating === r ? 0 : r); setPage(1) }}
            className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm ${minRating === r ? 'bg-primary/10' : 'hover:bg-muted'}`}
          >
            <StarRating rating={r} /> <span className="text-muted-foreground">& up</span>
          </button>
        ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <Label className="flex items-center justify-between text-sm font-normal">
          On sale only
          <Switch checked={onlyDiscount} onCheckedChange={(v) => { setOnlyDiscount(v); setPage(1) }} />
        </Label>
        <Label className="flex items-center justify-between text-sm font-normal">
          In stock only
          <Switch checked={inStock} onCheckedChange={(v) => { setInStock(v); setPage(1) }} />
        </Label>
      </div>
    </div>
  )

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[260px_1fr] lg:px-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Filters</h2>
            {activeFilters > 0 && (
              <Button variant="ghost" size="xs" onClick={reset}>Clear ({activeFilters})</Button>
            )}
          </div>
          {Filters}
        </div>
      </aside>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal data-icon="inline-start" />
                  Filters {activeFilters > 0 && <Badge className="ml-1">{activeFilters}</Badge>}
                </Button>
              }
            />
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-8">{Filters}</div>
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:block">Sort by</span>
            <Select value={sort} onValueChange={(v) => { setSort(v as string); setPage(1) }}>
              <SelectTrigger size="sm" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sortOptions.map(([v, label]) => (
                    <SelectItem key={v} value={v}>{label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {activeFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {brands.map((b) => (
              <Badge key={b} variant="secondary" className="gap-1">
                {b}
                <button onClick={() => toggleBrand(b)} aria-label={`Remove ${b}`}>
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
            {onlyDiscount && <Badge variant="secondary">On sale</Badge>}
            {inStock && <Badge variant="secondary">In stock</Badge>}
            {minRating > 0 && <Badge variant="secondary">{minRating}★ & up</Badge>}
          </div>
        )}

        {items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SlidersHorizontal />
              </EmptyMedia>
              <EmptyTitle>No products match</EmptyTitle>
              <EmptyDescription>Try adjusting your filters or search terms.</EmptyDescription>
            </EmptyHeader>
            <Button variant="outline" onClick={reset}>Clear filters</Button>
          </Empty>
        ) : (
          <ProductGrid products={items} />
        )}

        {pages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }}
                />
              </PaginationItem>
              {Array.from({ length: pages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={(e) => { e.preventDefault(); setPage(i + 1) }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(pages, p + 1)) }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
