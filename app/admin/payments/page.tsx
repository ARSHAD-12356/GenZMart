'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/format'
import { adminService } from '@/lib/services'

const STATUS_COLOR: Record<string, string> = {
  Paid: 'bg-success/20 text-success',
  Pending: 'bg-warning/20 text-warning',
  Refunded: 'bg-primary/20 text-primary',
  Failed: 'bg-destructive/20 text-destructive',
}

export default function AdminPaymentsPage() {
  const orders = adminService.getOrders()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Payments</h1>
        <p className="text-sm text-muted-foreground">{orders.length} transactions</p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Method</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-muted/20 transition">
                  <td className="px-4 py-3 font-mono text-sm">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3">{o.paymentMethod}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_COLOR[o.paymentStatus]}>{o.paymentStatus}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {o.paymentStatus === 'Paid' && (
                      <Button size="xs" variant="outline" className="text-primary border-primary/30">Refund</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
