'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'One uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'One number', ok: /\d/.test(password) },
  ]
  const score = checks.filter((c) => c.ok).length
  const colors = ['bg-destructive', 'bg-warning', 'bg-success']
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn('h-1 flex-1 rounded-full transition-all', i < score ? colors[score - 1] : 'bg-muted')} />
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        {checks.map(({ label, ok }) => (
          <div key={label} className={cn('flex items-center gap-1 text-xs', ok ? 'text-success' : 'text-muted-foreground')}>
            <Check className={cn('size-3', ok ? 'opacity-100' : 'opacity-30')} /> {label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<typeof form & { submit?: string }>({
    name: '', email: '', password: '', confirm: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const errs = { name: '', email: '', password: '', confirm: '' }
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Valid email required'
    if (form.password.length < 8) errs.password = 'Min 8 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    return Object.values(errs).every((v) => !v)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signup(form.name, form.email, form.password)
      router.push('/')
    } catch {
      setErrors((prev) => ({ ...prev, submit: 'Something went wrong.' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join GenZMart — shop bold, live loud.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Your name" value={form.name} onChange={set('name')} autoComplete="name" />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              className="pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPw ? 'Hide' : 'Show'}
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {form.password && <PasswordStrength password={form.password} />}
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
          {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
        </div>

        {(errors as any).submit && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{(errors as any).submit}</p>
        )}

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Creating account…' : 'Create account'}
          {!loading && <ArrowRight data-icon="inline-end" />}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
