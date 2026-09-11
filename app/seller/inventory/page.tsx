'use client'

import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { sellerService } from '@/lib/services'
import { cn } from '@/lib/utils'

const SELLER_ID = 's1'

export default function InventoryPage() {
  const products = sellerService.getProducts(SELLER_ID)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Inventory</h1>
        <p className="text-sm text-muted-foreground">{products.length} products tracked</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total products', value: products.length, color: 'text-foreground' },
          { label: 'In stock', value: products.filter((p) => p.stock > 20).length, color: 'text-success' },
          { label: 'Low stock', value: products.filter((p) => p.stock > 0 && p.stock <= 20).length, color: 'text-warning' },
          { label: 'Out of stock', value: products.filter((p) => p.stock === 0).length, color: 'text-destructive' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">SKU</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => {
                const stockStatus = p.stock === 0 ? 'out' : p.stock <= 20 ? 'low' : 'ok'
                return (
                  <tr key={p.id} className="hover:bg-muted/20 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{p.sku}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'font-bold text-base',
                          stockStatus === 'ok' ? 'text-success' : stockStatus === 'low' ? 'text-warning' : 'text-destructive',
                        )}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        {stockStatus !== 'ok' && <AlertTriangle className={`size-3.5 ${stockStatus === 'low' ? 'text-warning' : 'text-destructive'}`} />}
                        <Badge
                          className={
                            stockStatus === 'ok'
                              ? 'bg-success/20 text-success'
                              : stockStatus === 'low'
                                ? 'bg-warning/20 text-warning'
                                : 'bg-destructive/20 text-destructive'
                          }
                        >
                          {stockStatus === 'ok' ? 'In stock' : stockStatus === 'low' ? 'Low stock' : 'Out of stock'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="xs" variant="outline">Update stock</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
