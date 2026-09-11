'use client'

import { formatPrice } from '@/lib/format'
import { adminService, orderService } from '@/lib/services'

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex h-40 items-end gap-2">
      {data.map(({ label, value }) => (
        <div key={label} className="flex flex-1 flex-col items-center gap-1">
          <div className="w-full rounded-t-md bg-primary/60 hover:bg-primary transition-all" style={{ height: `${(value / max) * 100}%`, minHeight: '4px' }} />
          <span className="text-[10px] text-muted-foreground truncate w-full text-center">{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminReportsPage() {
  const orders = adminService.getOrders()
  const users = adminService.getUsers()
  const products = adminService.getProducts()
  const sellers = adminService.getSellers()

  const revenue = orders.reduce((n, o) => n + o.total, 0)
  const avgOrder = orders.length > 0 ? revenue / orders.length : 0

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  const monthlyData = months.map((label, i) => ({ label, value: Math.round(500 + i * 120 + Math.random() * 300) }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">Platform-wide analytics</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total revenue', value: formatPrice(revenue) },
          { label: 'Total orders', value: orders.length },
          { label: 'Avg order value', value: formatPrice(avgOrder) },
          { label: 'Total users', value: users.length },
          { label: 'Active sellers', value: sellers.filter((s) => s.status === 'active').length },
          { label: 'Active products', value: products.filter((p) => p.status === 'active').length },
          { label: 'Delivered orders', value: orders.filter((o) => o.orderStatus === 'Delivered').length },
          { label: 'Cancelled orders', value: orders.filter((o) => o.orderStatus === 'Cancelled').length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <p className="font-display text-xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Monthly revenue (2026)</h2>
        <BarChart data={monthlyData} />
      </div>
    </div>
  )
}
