'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Plus, Pencil, Trash2, Eye, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { formatPrice } from '@/lib/format'
import { sellerService } from '@/lib/services'
import { cn } from '@/lib/utils'

const SELLER_ID = 's1'

const STATUS_COLOR: Record<string, string> = {
  active: 'bg-success/20 text-success',
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-warning/20 text-warning',
}

export default function SellerProductsPage() {
  const allProducts = sellerService.getProducts(SELLER_ID)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const products = allProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{allProducts.length} products</p>
        </div>
        <Button render={<Link href="/seller/products/new" />}>
          <Plus className="size-4" /> Add product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">SKU</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{p.sku}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={cn('font-medium', p.stock === 0 ? 'text-destructive' : p.stock <= 20 ? 'text-warning' : 'text-success')}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_COLOR[p.status]}>{p.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="icon-sm" variant="ghost" aria-label="View" render={<Link href={`/product/${p.slug}`} target="_blank" />}>
                        <Eye className="size-3.5" />
                      </Button>
                      <Button size="icon-sm" variant="ghost" aria-label="Edit" render={<Link href={`/seller/products/${p.id}`} />}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button size="icon-sm" variant="ghost" aria-label="Delete" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="flex flex-col items-center gap-3 p-12 text-center">
              <Package className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
