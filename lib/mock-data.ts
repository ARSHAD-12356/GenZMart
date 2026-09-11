import type {
  Product,
  Category,
  Brand,
  Review,
  Order,
  Coupon,
  AppNotification,
  Seller,
} from './types'

const img = (q: string) =>
  `/placeholder.svg?height=800&width=800&query=${encodeURIComponent(q)}`

export const categories: Category[] = [
  {
    id: 'c1',
    slug: 'audio',
    name: 'Audio',
    description: 'Headphones, earbuds and speakers tuned for the feed generation.',
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp',
    productCount: 6,
    subcategories: ['Headphones', 'Earbuds', 'Speakers', 'Microphones', 'Audio Accessories'],
  },
  {
    id: 'c2',
    slug: 'wearables',
    name: 'Wearables',
    description: 'Smartwatches and trackers that keep up with your day.',
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/1.webp',
    productCount: 4,
    subcategories: ['Smartwatches', 'Fitness Bands', 'Smart Rings', 'Wearable Accessories'],
  },
  {
    id: 'c3',
    slug: 'gaming',
    name: 'Gaming',
    description: 'Controllers, keyboards and gear built for the grind.',
    image: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp',
    productCount: 4,
    subcategories: ['Gaming Headsets', 'Controllers', 'Gaming Keyboards', 'Gaming Mice', 'Gaming Accessories'],
  },
  {
    id: 'c4',
    slug: 'mobile',
    name: 'Mobile',
    description: 'Phones and accessories that flex.',
    image: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp',
    productCount: 4,
    subcategories: ['Smartphones', 'Tablets', 'Power Banks', 'Chargers', 'Phone Cases', 'Mobile Accessories'],
  },
  {
    id: 'c6',
    slug: 'computing',
    name: 'Computing',
    description: 'Laptops, displays and workstation essentials.',
    image: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp',
    productCount: 4,
    subcategories: ['Laptops', 'Monitors', 'Keyboards', 'Mice', 'Webcams', 'Storage', 'Computer Accessories'],
  },
  {
    id: 'c5',
    slug: 'lifestyle',
    name: 'Lifestyle',
    description: 'Everyday carry and desk setups that hit different.',
    image: 'https://cdn.dummyjson.com/product-images/sunglasses/classic-sunglasses/1.webp',
    productCount: 4,
    subcategories: ['Desk Setup', 'Smart Accessories', 'Travel Tech', 'Everyday Gadgets', 'Lifestyle Accessories'],
  },
]

export const brands: Brand[] = [
  { id: 'b1', name: 'Sonicwave', slug: 'sonicwave', productCount: 5 },
  { id: 'b2', name: 'Pulse', slug: 'pulse', productCount: 4 },
  { id: 'b3', name: 'Nova', slug: 'nova', productCount: 5 },
  { id: 'b4', name: 'Vertex', slug: 'vertex', productCount: 4 },
  { id: 'b5', name: 'Kite', slug: 'kite', productCount: 4 },
]

interface Seed {
  name: string
  category: string
  subcategory: string
  brand: string
  price: number
  originalPrice: number
  rating: number
  reviewCount: number
  stock: number
  tags: string[]
  short: string
  q: string
  images: string[]
  variants?: { label: string; options: string[] }[]
  specs?: Record<string, string>
}

const seeds: Seed[] = [
  {
    name: 'Aurora Wireless Headphones',
    category: 'audio', subcategory: 'Headphones', brand: 'Sonicwave',
    price: 149, originalPrice: 229, rating: 4.8, reviewCount: 1243, stock: 42,
    tags: ['featured', 'bestseller', 'new'],
    short: 'Adaptive noise cancelling over-ear headphones.',
    q: 'over ear wireless headphones',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp',
    ],
    variants: [{ label: 'Color', options: ['Midnight', 'Lime', 'Magenta'] }],
    specs: { Driver: '40mm', Battery: '38h', Bluetooth: '5.3', Weight: '250g' },
  },
  {
    name: 'Echo Buds Pro',
    category: 'audio', subcategory: 'Earbuds', brand: 'Pulse',
    price: 89, originalPrice: 129, rating: 4.6, reviewCount: 872, stock: 120,
    tags: ['featured', 'bestseller'],
    short: 'True wireless earbuds with spatial audio.',
    q: 'true wireless earbuds',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/2.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/3.webp',
    ],
    variants: [{ label: 'Color', options: ['White', 'Black'] }],
    specs: { Battery: '28h', ANC: 'Yes', Waterproof: 'IPX4' },
  },
  {
    name: 'Bassline Portable Speaker',
    category: 'audio', subcategory: 'Speakers', brand: 'Sonicwave',
    price: 69, originalPrice: 99, rating: 4.5, reviewCount: 421, stock: 60,
    tags: ['trending'],
    short: 'Pocket speaker with 360° sound.',
    q: 'portable bluetooth speaker',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/2.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/1.webp',
    ],
    specs: { Battery: '20h', Waterproof: 'IP67' },
  },
  {
    name: 'Studio Monitor Headphones',
    category: 'audio', subcategory: 'Headphones', brand: 'Nova',
    price: 199, originalPrice: 249, rating: 4.7, reviewCount: 318, stock: 24,
    tags: ['new'],
    short: 'Reference-grade studio headphones.',
    q: 'studio monitor headphones',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/1.webp',
    ],
    specs: { Driver: '45mm', Impedance: '32ohm' },
  },
  {
    name: 'Nano Sport Earbuds',
    category: 'audio', subcategory: 'Earbuds', brand: 'Pulse',
    price: 49, originalPrice: 79, rating: 4.3, reviewCount: 655, stock: 200,
    tags: ['deal'],
    short: 'Secure-fit earbuds for workouts.',
    q: 'sport earbuds',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/2.webp',
    ],
  },
  {
    name: 'Resonance Soundbar',
    category: 'audio', subcategory: 'Speakers', brand: 'Nova',
    price: 179, originalPrice: 219, rating: 4.4, reviewCount: 142, stock: 0,
    tags: [],
    short: 'Compact soundbar with deep bass.',
    q: 'compact soundbar',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/1.webp',
    ],
  },
  {
    name: 'Pulse Watch Series 5',
    category: 'wearables', subcategory: 'Smartwatches', brand: 'Vertex',
    price: 229, originalPrice: 299, rating: 4.7, reviewCount: 934, stock: 55,
    tags: ['featured', 'bestseller', 'new'],
    short: 'AMOLED smartwatch with health suite.',
    q: 'smartwatch amoled',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/2.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/3.webp',
    ],
    variants: [{ label: 'Band', options: ['Sport', 'Woven', 'Leather'] }, { label: 'Size', options: ['41mm', '45mm'] }],
    specs: { Display: 'AMOLED', Battery: '7 days', GPS: 'Yes' },
  },
  {
    name: 'Move Fitness Band',
    category: 'wearables', subcategory: 'Fitness Bands', brand: 'Vertex',
    price: 59, originalPrice: 89, rating: 4.4, reviewCount: 1120, stock: 300,
    tags: ['deal', 'trending'],
    short: 'Slim tracker with 14-day battery.',
    q: 'fitness band tracker',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/2.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/3.webp',
    ],
  },
  {
    name: 'Orbit Hybrid Watch',
    category: 'wearables', subcategory: 'Smartwatches', brand: 'Nova',
    price: 189, originalPrice: 239, rating: 4.5, reviewCount: 276, stock: 40,
    tags: ['new'],
    short: 'Analog looks, smart brains.',
    q: 'hybrid analog smartwatch',
    images: [
      'https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/1.webp',
      'https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/2.webp',
    ],
  },
  {
    name: 'Trail GPS Watch',
    category: 'wearables', subcategory: 'Smartwatches', brand: 'Kite',
    price: 279, originalPrice: 349, rating: 4.6, reviewCount: 188, stock: 18,
    tags: ['featured'],
    short: 'Rugged multisport GPS watch.',
    q: 'rugged gps sport watch',
    images: [
      'https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner/1.webp',
      'https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner/2.webp',
    ],
  },
  {
    name: 'Strike Wireless Controller',
    category: 'gaming', subcategory: 'Controllers', brand: 'Nova',
    price: 64, originalPrice: 89, rating: 4.7, reviewCount: 512, stock: 90,
    tags: ['bestseller', 'trending'],
    short: 'Low-latency controller with hall triggers.',
    q: 'gaming controller',
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/2.webp',
    ],
    variants: [{ label: 'Color', options: ['Black', 'Lime', 'Magenta'] }],
  },
  {
    name: 'Mecha 75 Keyboard',
    category: 'gaming', subcategory: 'Keyboards', brand: 'Vertex',
    price: 119, originalPrice: 159, rating: 4.8, reviewCount: 402, stock: 33,
    tags: ['featured', 'new'],
    short: 'Hot-swap mechanical keyboard.',
    q: 'mechanical keyboard',
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/2.webp',
    ],
    specs: { Layout: '75%', Switch: 'Hot-swap', Connection: 'Wireless' },
  },
  {
    name: 'Glide Pro Mouse',
    category: 'gaming', subcategory: 'Mice', brand: 'Pulse',
    price: 54, originalPrice: 79, rating: 4.6, reviewCount: 690, stock: 150,
    tags: ['deal'],
    short: 'Ultralight 58g gaming mouse.',
    q: 'lightweight gaming mouse',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/monopod/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/1.webp',
    ],
  },
  {
    name: 'Arena Headset',
    category: 'gaming', subcategory: 'Gaming Headsets', brand: 'Sonicwave',
    price: 99, originalPrice: 139, rating: 4.4, reviewCount: 233, stock: 47,
    tags: ['trending'],
    short: 'Surround gaming headset.',
    q: 'gaming headset',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/1.webp',
    ],
  },
  {
    name: 'Nova Phone 12',
    category: 'mobile', subcategory: 'Smartphones', brand: 'Nova',
    price: 699, originalPrice: 799, rating: 4.7, reviewCount: 1502, stock: 25,
    tags: ['featured', 'bestseller', 'new'],
    short: '6.7" flagship with triple camera.',
    q: 'flagship smartphone',
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/3.webp',
    ],
    variants: [{ label: 'Storage', options: ['128GB', '256GB', '512GB'] }, { label: 'Color', options: ['Graphite', 'Lime', 'Violet'] }],
    specs: { Display: '6.7" OLED', Chip: 'Nova X2', Camera: '50MP', Battery: '5000mAh' },
  },
  {
    name: 'Flex Charging Pad',
    category: 'mobile', subcategory: 'Chargers', brand: 'Kite',
    price: 29, originalPrice: 45, rating: 4.3, reviewCount: 844, stock: 400,
    tags: ['deal', 'trending'],
    short: '15W magnetic wireless charger.',
    q: 'wireless charging pad',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpower-wireless-charger/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/1.webp',
    ],
  },
  {
    name: 'Guardian Phone Case',
    category: 'mobile', subcategory: 'Phone Cases', brand: 'Kite',
    price: 19, originalPrice: 29, rating: 4.5, reviewCount: 1230, stock: 500,
    tags: ['bestseller'],
    short: 'Drop-proof translucent case.',
    q: 'translucent phone case',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/iphone-12-silicone-case-with-magsafe-plum/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/iphone-12-silicone-case-with-magsafe-plum/2.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/iphone-12-silicone-case-with-magsafe-plum/3.webp',
    ],
    variants: [{ label: 'Color', options: ['Clear', 'Lime', 'Magenta'] }],
  },
  {
    name: 'Nova Phone 12 Mini',
    category: 'mobile', subcategory: 'Smartphones', brand: 'Nova',
    price: 549, originalPrice: 629, rating: 4.5, reviewCount: 388, stock: 30,
    tags: ['new'],
    short: 'Compact flagship, full power.',
    q: 'compact smartphone',
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-x/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-x/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-x/3.webp',
    ],
  },
  {
    name: 'Apex Pro Laptop 16',
    category: 'computing', subcategory: 'Laptops', brand: 'Nova',
    price: 1299, originalPrice: 1499, rating: 4.9, reviewCount: 640, stock: 22,
    tags: ['featured', 'bestseller', 'new'],
    short: '16-inch high-performance laptop with 32GB RAM.',
    q: 'pro laptop gaming workstation',
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/2.webp',
      'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp',
    ],
    specs: { RAM: '32GB', Storage: '1TB NVMe', Display: '16" 165Hz' },
  },
  {
    name: 'UltraVision 27 4K Monitor',
    category: 'computing', subcategory: 'Monitors', brand: 'Vertex',
    price: 349, originalPrice: 429, rating: 4.7, reviewCount: 280, stock: 35,
    tags: ['trending'],
    short: 'Color-accurate 4K IPS display with USB-C hub.',
    q: '4k monitor USB-C',
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/2.webp',
    ],
    specs: { Resolution: '3840x2160', Refresh: '144Hz', Color: '99% DCI-P3' },
  },
  {
    name: 'StreamCam HD Pro',
    category: 'computing', subcategory: 'Webcams', brand: 'Pulse',
    price: 79, originalPrice: 109, rating: 4.6, reviewCount: 412, stock: 85,
    tags: ['new'],
    short: '1080p 60fps auto-focus webcam with dual mics.',
    q: 'streaming webcam 1080p',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/monopod/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/selfie-stick-monopod/1.webp',
    ],
  },
  {
    name: 'Velocity NVMe SSD 2TB',
    category: 'computing', subcategory: 'Storage', brand: 'Nova',
    price: 139, originalPrice: 189, rating: 4.8, reviewCount: 510, stock: 120,
    tags: ['deal', 'bestseller'],
    short: 'PCIe Gen4 NVMe M.2 SSD up to 7400MB/s.',
    q: 'nvme ssd 2tb',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/1.webp',
    ],
  },
  {
    name: 'Voyager Desk Mat & Organizer',
    category: 'lifestyle', subcategory: 'Desk Setup', brand: 'Kite',
    price: 49, originalPrice: 69, rating: 4.6, reviewCount: 517, stock: 80,
    tags: ['featured', 'trending'],
    short: 'Water-resistant vegan leather desk mat.',
    q: 'desk mat setup organizer',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/monopod/2.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/selfie-stick-monopod/1.webp',
    ],
    variants: [{ label: 'Color', options: ['Black', 'Olive', 'Slate'] }],
  },
  {
    name: 'Hydro Smart Flask',
    category: 'lifestyle', subcategory: 'Everyday Gadgets', brand: 'Vertex',
    price: 34, originalPrice: 49, rating: 4.7, reviewCount: 921, stock: 260,
    tags: ['bestseller', 'deal'],
    short: 'Temperature-display smart water bottle.',
    q: 'insulated water bottle smart display',
    images: [
      'https://cdn.dummyjson.com/product-images/groceries/cooking-oil/1.webp',
      'https://cdn.dummyjson.com/product-images/groceries/juice/1.webp',
    ],
  },
  {
    name: 'Tech Travel Organizer Pouch',
    category: 'lifestyle', subcategory: 'Travel Tech', brand: 'Pulse',
    price: 45, originalPrice: 65, rating: 4.4, reviewCount: 276, stock: 110,
    tags: ['new'],
    short: 'Padded multi-compartment tech accessory pouch.',
    q: 'travel tech accessory organizer',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/iphone-12-silicone-case-with-magsafe-plum/2.webp',
    ],
  },
  {
    name: 'Grip Sunglasses',
    category: 'lifestyle', subcategory: 'Lifestyle Accessories', brand: 'Sonicwave',
    price: 39, originalPrice: 59, rating: 4.2, reviewCount: 164, stock: 140,
    tags: ['trending'],
    short: 'Polarized street-style shades.',
    q: 'sunglasses street style',
    images: [
      'https://cdn.dummyjson.com/product-images/sunglasses/classic-sunglasses/1.webp',
      'https://cdn.dummyjson.com/product-images/sunglasses/green-sunglasses/1.webp',
    ],
  },
]

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const products: Product[] = seeds.map((s, i) => {
  const discount = Math.round(((s.originalPrice - s.price) / s.originalPrice) * 100)
  const slug = slugify(s.name)
  const sellerMap: Record<string, { id: string; name: string }> = {
    Sonicwave: { id: 's1', name: 'Sonicwave Official' },
    Pulse: { id: 's2', name: 'Pulse Store' },
    Nova: { id: 's3', name: 'Nova Labs' },
    Vertex: { id: 's4', name: 'Vertex Gear' },
    Kite: { id: 's5', name: 'Kite Supply Co.' },
  }
  const seller = sellerMap[s.brand]
  return {
    id: `p${i + 1}`,
    slug,
    name: s.name,
    shortDescription: s.short,
    description: `${s.name} by ${s.brand}. ${s.short} Designed for a generation that lives online — bold, durable, and built to move. Every detail is engineered for everyday performance with a finish that turns heads.`,
    category: s.category,
    subcategory: s.subcategory,
    brand: s.brand,
    sellerId: seller.id,
    sellerName: seller.name,
    sku: `GZ-${(i + 1).toString().padStart(4, '0')}`,
    price: s.price,
    originalPrice: s.originalPrice,
    discount,
    rating: s.rating,
    reviewCount: s.reviewCount,
    stock: s.stock,
    images: s.images,
    variants: s.variants ?? [],
    specifications: s.specs ?? { Warranty: '1 year', Ships: 'Worldwide' },
    features: [
      'Premium build quality',
      'Fast, free shipping',
      '30-day easy returns',
      '1-year warranty',
    ],
    tags: s.tags,
    status: 'active',
    createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  }
})

export const reviews: Review[] = products.flatMap((p) =>
  Array.from({ length: 3 }).map((_, j) => ({
    id: `${p.id}-r${j}`,
    productId: p.id,
    author: ['Aria K.', 'Devon M.', 'Sky P.', 'Rio L.', 'Jules T.'][(j + Number(p.id.slice(1))) % 5],
    rating: Math.max(3, Math.round(p.rating - (j % 2))),
    title: ['Absolutely love it', 'Worth every penny', 'Solid pick'][j % 3],
    body: 'Shipping was fast and the quality is unreal for the price. Been using it daily and it holds up great. Would buy again.',
    date: new Date(Date.now() - j * 86400000 * 5).toISOString(),
    verified: j !== 2,
    images: j === 0 ? [img(p.name + ' user photo review')] : undefined,
  })),
)

export const coupons: Coupon[] = [
  { id: 'cp1', code: 'GENZ10', type: 'percentage', value: 10, minOrder: 50, maxDiscount: 40, expiry: '2026-12-31', active: true },
  { id: 'cp2', code: 'DROP25', type: 'fixed', value: 25, minOrder: 150, expiry: '2026-12-31', active: true },
  { id: 'cp3', code: 'FREESHIP', type: 'fixed', value: 15, minOrder: 40, expiry: '2026-12-31', active: true },
]

export const sellers: Seller[] = [
  { id: 's1', name: 'Sonicwave Official', logo: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp', banner: 'https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/1.webp', description: 'Sound-first gear for the always-on generation.', rating: 4.7, productCount: 3, status: 'active', joinedAt: '2024-02-11' },
  { id: 's3', name: 'Nova Labs', logo: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp', banner: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-x/1.webp', description: 'Flagship tech without the flagship markup.', rating: 4.8, productCount: 5, status: 'active', joinedAt: '2023-09-01' },
  { id: 's4', name: 'Vertex Gear', logo: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/1.webp', banner: 'https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/1.webp', description: 'Wearables that move with you.', rating: 4.6, productCount: 4, status: 'active', joinedAt: '2024-05-20' },
  { id: 's6', name: 'Flux Traders', logo: 'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/1.webp', banner: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/1.webp', description: 'New seller pending review.', rating: 0, productCount: 0, status: 'pending', joinedAt: '2026-08-30' },
]

export const orders: Order[] = []

export const notifications: AppNotification[] = [
  { id: 'n2', type: 'promo', title: 'Flash drop live', body: 'Up to 40% off audio for 24h. Code GENZ10.', date: new Date(Date.now() - 7200000).toISOString(), read: false },
]
