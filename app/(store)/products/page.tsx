import type { Metadata } from 'next'
import { ProductBrowser } from '@/components/catalog/product-browser'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse the full GenZMart catalog with filters and sorting.',
}

const titles: Record<string, string> = {
  new: 'New Arrivals',
  bestseller: 'Best Sellers',
  trending: 'Trending Now',
  deal: 'On Sale',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  return (
    <ProductBrowser
      title={tag && titles[tag] ? titles[tag] : 'All Products'}
      initialTag={tag}
    />
  )
}
