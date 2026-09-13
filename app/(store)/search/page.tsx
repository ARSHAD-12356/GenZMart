import type { Metadata } from 'next'
import { ProductBrowser } from '@/components/catalog/product-browser'
import { SearchBar } from '@/components/catalog/search-bar'

export const metadata: Metadata = {
  title: 'Search',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return (
    <div className="flex flex-col">
      <ProductBrowser
        key={q}
        title={q ? `Results for “${q}”` : 'Search'}
        initialSearch={q}
      />
    </div>
  )
}
