import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { ProductBrowser } from '@/components/catalog/product-browser'
import { categoryService } from '@/lib/services'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = categoryService.getBySlug(slug)
  return {
    title: category?.name ?? 'Category',
    description: category?.description,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ subcategory?: string }>
}) {
  const { slug } = await params
  const { subcategory } = (await searchParams) ?? {}
  const category = categoryService.getBySlug(slug)
  if (!category) notFound()

  const displayTitle = subcategory ? `${category.name} — ${subcategory}` : category.name

  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image src={category.image || '/placeholder.svg'} alt="" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/products" />}>Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={`/category/${category.slug}`} />}>{category.name}</BreadcrumbLink>
              </BreadcrumbItem>
              {subcategory && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{subcategory}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{displayTitle}</h1>
          <p className="mt-2 max-w-lg text-muted-foreground">{category.description}</p>
        </div>
      </div>
      <ProductBrowser
        title={`${displayTitle} products`}
        initialCategory={slug}
        initialSubcategory={subcategory}
        lockCategory
      />
    </div>
  )
}
