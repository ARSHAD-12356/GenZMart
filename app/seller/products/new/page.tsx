'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { categoryService } from '@/lib/services'
import { toast } from 'sonner'

const categories = categoryService.getAll()

export default function NewProductPage() {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    brand: '',
    sku: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
  })
  const [features, setFeatures] = useState<string[]>([''])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = async (status: 'active' | 'draft') => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    toast(status === 'active' ? 'Product submitted for review' : 'Draft saved', {
      description: status === 'active' ? 'It will go live after admin approval.' : 'You can come back and edit anytime.',
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" render={<Link href="/seller/products" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="font-display text-2xl font-bold">New Product</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <Section title="Basic information">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Product name" className="sm:col-span-2">
                <Input placeholder="e.g. Aurora Wireless Headphones" value={form.name} onChange={set('name')} />
              </Field>
              <Field label="Category">
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v ?? '' }))}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>{categories.map((c) => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}</SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Subcategory">
                <Input placeholder="e.g. Headphones" value={form.subcategory} onChange={set('subcategory')} />
              </Field>
              <Field label="Brand">
                <Input placeholder="e.g. Sonicwave" value={form.brand} onChange={set('brand')} />
              </Field>
              <Field label="SKU">
                <Input placeholder="e.g. GZ-0001" value={form.sku} onChange={set('sku')} />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                className="min-h-[100px] w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Describe your product…"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Field>
          </Section>

          <Section title="Pricing & inventory">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Selling price ($)">
                <Input type="number" placeholder="0.00" value={form.price} onChange={set('price')} />
              </Field>
              <Field label="Original price ($)">
                <Input type="number" placeholder="0.00" value={form.originalPrice} onChange={set('originalPrice')} />
              </Field>
              <Field label="Stock quantity">
                <Input type="number" placeholder="0" value={form.stock} onChange={set('stock')} />
              </Field>
            </div>
          </Section>

          <Section title="Key features">
            {features.map((feat, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder={`Feature ${i + 1}`}
                  value={feat}
                  onChange={(e) => {
                    const next = [...features]
                    next[i] = e.target.value
                    setFeatures(next)
                  }}
                />
                <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => setFeatures(features.filter((_, j) => j !== i))}>
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-fit" onClick={() => setFeatures([...features, ''])}>
              <Plus className="size-4" /> Add feature
            </Button>
          </Section>
        </div>

        {/* Actions sidebar */}
        <div className="flex flex-col gap-4">
          <div className="sticky top-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold">Publish</h2>
            <p className="text-xs text-muted-foreground">Products are reviewed by admin before going live.</p>
            <Separator />
            <Button className="w-full" onClick={() => handleSave('active')} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              <Save className="size-4" /> Submit for review
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSave('draft')} disabled={saving}>
              Save as draft
            </Button>
            <Button variant="ghost" className="w-full" render={<Link href="/seller/products" />}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-semibold">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}
