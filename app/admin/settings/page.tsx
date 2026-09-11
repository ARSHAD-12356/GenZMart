'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [flags, setFlags] = useState({ maintenance: false, registrations: true, guestCheckout: true })

  const save = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    toast('Settings saved')
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold">Admin Settings</h1>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">General</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Platform name</Label>
            <Input defaultValue="GenZMart" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Contact email</Label>
            <Input type="email" defaultValue="admin@genzmart.com" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Tax rate (%)</Label>
            <Input type="number" defaultValue="8" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Free shipping threshold ($)</Label>
            <Input type="number" defaultValue="50" />
          </div>
        </div>
        <Button className="mt-4" onClick={save} disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          <Save className="size-4" /> Save changes
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Feature flags</h2>
        <div className="flex flex-col gap-4">
          {[
            { key: 'maintenance' as const, label: 'Maintenance mode', desc: 'Take the site offline for maintenance.' },
            { key: 'registrations' as const, label: 'Allow registrations', desc: 'Enable new user sign-ups.' },
            { key: 'guestCheckout' as const, label: 'Guest checkout', desc: 'Allow checkout without an account.' },
          ].map(({ key, label, desc }) => (
            <Label key={key} className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-xs text-muted-foreground font-normal">{desc}</p>
              </div>
              <Switch checked={flags[key]} onCheckedChange={(v) => setFlags((f) => ({ ...f, [key]: v }))} />
            </Label>
          ))}
        </div>
      </div>
    </div>
  )
}
