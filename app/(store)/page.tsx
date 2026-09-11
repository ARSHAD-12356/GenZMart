import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/home/marquee'
import { CategoryShowcase } from '@/components/home/category-showcase'
import { ProductRail } from '@/components/product/product-rail'
import { PromoBanner, TrustBadges } from '@/components/home/promo-banner'
import { productService } from '@/lib/services'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Marquee />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-14 lg:px-8">
        <TrustBadges />
        <ProductRail
          title="Flash deals"
          subtitle="Biggest discounts, live right now."
          products={productService.getDeals()}
          viewAllHref="/deals"
        />
        <CategoryShowcase />
        <ProductRail
          title="New arrivals"
          subtitle="Fresh drops added this week."
          products={productService.getNewArrivals()}
          viewAllHref="/products?tag=new"
        />
        <PromoBanner />
        <ProductRail
          title="Best sellers"
          subtitle="What everyone's copping."
          products={productService.getBestSellers()}
          viewAllHref="/products?tag=bestseller"
        />
        <ProductRail
          title="Trending now"
          subtitle="Moving fast across the feed."
          products={productService.getTrending()}
          viewAllHref="/products?tag=trending"
        />
      </div>
    </div>
  )
}
