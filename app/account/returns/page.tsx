'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { RotateCcw, Clock, CheckCircle, XCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { formatDate, formatPrice } from '@/lib/format'
import { orderService } from '@/lib/services'
import type { Order } from '@/lib/types'

// Return requests list (starts empty by default for real-time order returns)
const MOCK_RETURNS: any[] = []

const RETURN_STATUS_COLOR: Record<string, string> = {
  Pending: 'bg-warning/20 text-warning',
  Approved: 'bg-success/20 text-success',
  Rejected: 'bg-destructive/20 text-destructive',
  Refunded: 'bg-primary/20 text-primary',
}

const REASONS = [
  'Defective product',
  'Wrong item received',
  'Not as described',
  'Changed my mind',
  'Better price available',
  'Other',
]

export default function ReturnsPage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState('')
  const [reason, setReason] = useState('')
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([])

  useEffect(() => {
    setDeliveredOrders(orderService.getAll().filter((o) => o.orderStatus === 'Delivered'))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Returns & Refunds</h1>
          <p className="text-sm text-muted-foreground">{MOCK_RETURNS.length} return request{MOCK_RETURNS.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="size-4" /> New return
        </Button>
      </div>

      {/* Return request form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Request a return</h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">Select order</label>
              <Select value={selectedOrder} onValueChange={(val) => val && setSelectedOrder(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {deliveredOrders.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.orderNumber} — {o.items[0]?.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">Reason for return</label>
              <Select value={reason} onValueChange={(val) => val && setReason(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button disabled={!selectedOrder || !reason}>Submit request</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Return list */}
      {MOCK_RETURNS.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-12 text-center">
          <RotateCcw className="size-10 text-muted-foreground" />
          <div>
            <p className="font-semibold">No returns</p>
            <p className="text-sm text-muted-foreground">You haven&apos;t requested any returns yet.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {MOCK_RETURNS.map((ret) => (
            <div key={ret.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-3">
                <span className="font-mono text-sm">{ret.orderNumber}</span>
                <Badge className={RETURN_STATUS_COLOR[ret.status]}>{ret.status}</Badge>
              </div>
              <div className="flex items-center gap-4 p-5">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image src={ret.image} alt={ret.productName} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{ret.productName}</p>
                  <p className="text-sm text-muted-foreground">Reason: {ret.reason}</p>
                  <p className="text-xs text-muted-foreground">Requested: {formatDate(ret.requestedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Refund</p>
                  <p className="font-display font-bold text-success">{formatPrice(ret.refund)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
