'use client'

import { useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/components/providers/store-provider'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user } = useStore()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState('+1 (555) 000-0000')
  const [saving, setSaving] = useState(false)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    toast('Profile updated', { description: 'Your changes have been saved.' })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your personal information.</p>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center justify-center text-center gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:text-left sm:justify-start">
        {/* Row 1: Center profile pic on mobile */}
        <Avatar className="size-20 shrink-0 shadow-sm ring-2 ring-primary/20">
          <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Row 2: Name & Role */}
        <div className="min-w-0">
          <p className="font-display text-lg sm:text-xl font-bold capitalize text-foreground">{user?.name}</p>
          <p className="text-xs sm:text-sm text-muted-foreground capitalize mt-0.5">{user?.role} account</p>
        </div>

        {/* Row 3: Change photo button */}
        <Button variant="outline" size="sm" className="w-full sm:w-auto sm:ml-auto rounded-xl">
          Change photo
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={save} className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Personal information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <Separator className="my-4" />
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          <Save className="size-4" />
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </form>

      {/* Password section */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-1 font-semibold">Password</h2>
        <p className="mb-4 text-sm text-muted-foreground">Update your account password.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label>Current password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>New password</Label>
            <Input type="password" placeholder="Min. 8 characters" />
          </div>
        </div>
        <Button variant="outline" className="mt-4">Change password</Button>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
        <h2 className="mb-1 font-semibold text-destructive">Danger zone</h2>
        <p className="mb-4 text-sm text-muted-foreground">Delete your account permanently. This action cannot be undone.</p>
        <Button variant="destructive" size="sm">Delete account</Button>
      </div>
    </div>
  )
}
