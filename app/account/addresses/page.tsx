'use client'

import { useState } from 'react'
import { MapPin, Plus, Pencil, Trash2, Check, Home, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Address {
  id: string
  name: string
  phone: string
  line1: string
  city: string
  state: string
  zip: string
  type: 'home' | 'work' | 'other'
  isDefault: boolean
}

const INITIAL: Address[] = [
  {
    id: 'a1',
    name: 'Aria Kapoor',
    phone: '+1 (555) 123-4567',
    line1: '221B Skyline Ave, Apt 9',
    city: 'Metro City',
    state: 'CA',
    zip: '90210',
    type: 'home',
    isDefault: true,
  },
]

const TYPE_ICON = { home: Home, work: Briefcase, other: MapPin }

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Address, 'id'>>({
    name: '', phone: '', line1: '', city: '', state: '', zip: '', type: 'home', isDefault: false,
  })

  const openAdd = () => { setForm({ name: '', phone: '', line1: '', city: '', state: '', zip: '', type: 'home', isDefault: false }); setEditId(null); setShowForm(true) }
  const openEdit = (a: Address) => { setForm({ ...a }); setEditId(a.id); setShowForm(true) }

  const save = () => {
    if (editId) {
      setAddresses((prev) => prev.map((a) => a.id === editId ? { ...form, id: editId } : a))
    } else {
      const newId = `a${Date.now()}`
      if (form.isDefault) setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })))
      setAddresses((prev) => [...prev, { ...form, id: newId }])
    }
    setShowForm(false)
  }

  const remove = (id: string) => setAddresses((prev) => prev.filter((a) => a.id !== id))
  const setDefault = (id: string) => setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Addresses</h1>
          <p className="text-sm text-muted-foreground">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" /> Add address
        </Button>
      </div>

      {/* Add/edit form */}
      {showForm && (
        <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
          <h2 className="mb-4 font-semibold">{editId ? 'Edit address' : 'New address'}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ['Name', 'name', 'text'],
              ['Phone', 'phone', 'tel'],
              ['Address', 'line1', 'text'],
              ['City', 'city', 'text'],
              ['State', 'state', 'text'],
              ['ZIP / PIN', 'zip', 'text'],
            ] as [string, keyof typeof form, string][]).map(([label, key, type]) => (
              <div key={key} className={cn('flex flex-col gap-1', key === 'line1' && 'sm:col-span-2')}>
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <Input
                  type={type}
                  value={form[key] as string}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={save}>Save address</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Address cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => {
          const Icon = TYPE_ICON[a.type]
          return (
            <div
              key={a.id}
              className={cn(
                'flex flex-col gap-3 rounded-2xl border bg-card p-5 transition',
                a.isDefault ? 'border-primary/40 bg-primary/5' : 'border-border',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-primary" />
                  <span className="text-sm font-semibold capitalize">{a.type}</span>
                  {a.isDefault && <Badge className="text-xs bg-primary/20 text-primary">Default</Badge>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon-sm" variant="ghost" aria-label="Edit" onClick={() => openEdit(a)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button size="icon-sm" variant="ghost" aria-label="Delete" className="text-destructive hover:bg-destructive/10" onClick={() => remove(a.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium">{a.name}</p>
                <p className="text-muted-foreground">{a.phone}</p>
                <p>{a.line1}</p>
                <p>{a.city}, {a.state} {a.zip}</p>
              </div>
              {!a.isDefault && (
                <Button variant="outline" size="xs" className="w-fit" onClick={() => setDefault(a.id)}>
                  <Check className="size-3" /> Set as default
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
