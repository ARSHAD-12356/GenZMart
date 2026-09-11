'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setDone(true)
    setLoading(false)
    setTimeout(() => router.push('/login'), 2500)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-success/20">
          <CheckCircle className="size-8 text-success" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Password reset!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been updated. Redirecting you to sign in…
          </p>
        </div>
        <Button className="w-full" render={<Link href="/login" />}>
          Sign in now <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold">Reset password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose a strong new password.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              autoComplete="new-password"
              required
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
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Repeat password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Resetting…' : 'Reset password'}
          {!loading && <ArrowRight data-icon="inline-end" />}
        </Button>
      </form>
    </div>
  )
}
