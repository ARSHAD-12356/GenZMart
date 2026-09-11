'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function SellerSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [prefs, setPrefs] = useState({ orderAlerts: true, reviewAlerts: true, promoEmails: false })

  const save = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    toast('Settings saved')
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Store information</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Store name</Label>
            <Input defaultValue="Sonicwave Official" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Contact email</Label>
            <Input type="email" defaultValue="seller@sonicwave.io" />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label className="text-xs text-muted-foreground">Store description</Label>
            <textarea
              className="min-h-[80px] resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
              defaultValue="Sound-first gear for the always-on generation."
            />
          </div>
        </div>
        <Button className="mt-4" onClick={save} disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          <Save className="size-4" /> Save changes
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Notifications</h2>
        <div className="flex flex-col gap-4">
          {[
            { key: 'orderAlerts' as const, label: 'New order alerts', desc: 'Get notified when a new order is placed.' },
            { key: 'reviewAlerts' as const, label: 'Review notifications', desc: 'Get notified when you receive a new review.' },
            { key: 'promoEmails' as const, label: 'Promotional emails', desc: 'Receive platform tips and seller updates.' },
          ].map(({ key, label, desc }) => (
            <Label key={key} className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-xs text-muted-foreground font-normal">{desc}</p>
              </div>
              <Switch checked={prefs[key]} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))} />
            </Label>
          ))}
        </div>
      </div>
    </div>
  )
}
