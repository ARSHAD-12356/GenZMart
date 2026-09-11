'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2, Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-primary/20">
          <Mail className="size-8 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Check your inbox</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a reset link to <span className="font-medium text-foreground">{email}</span>.
            Check your email and follow the instructions.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t receive it?{' '}
          <button onClick={() => setSent(false)} className="text-primary hover:underline">
            Resend
          </button>
        </p>
        <Button variant="outline" className="w-full" render={<Link href="/login" />}>
          <ArrowLeft data-icon="inline-start" />
          Back to sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold">Forgot password?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Sending…' : 'Send reset link'}
          {!loading && <ArrowRight data-icon="inline-end" />}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link href="/login" className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
          <ArrowLeft className="size-4" /> Back to sign in
        </Link>
      </div>
    </div>
  )
}
