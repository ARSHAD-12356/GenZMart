'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Loader2, Shield, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useStore } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useStore()
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'seller' | 'admin'>('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const targetRole = isAdminMode || role === 'admin' || email.toLowerCase().includes('admin')
        ? 'admin'
        : email.toLowerCase().includes('seller') || role === 'seller'
        ? 'seller'
        : 'customer'

      await login(email, password, targetRole)

      if (targetRole === 'admin') {
        router.push('/admin/dashboard')
      } else if (targetRole === 'seller') {
        router.push('/seller/dashboard')
      } else {
        router.push('/')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminMode = () => {
    if (!isAdminMode) {
      setIsAdminMode(true)
      setRole('admin')
      setEmail('admin@genzmart.com')
      setPassword('admin123')
      setError('')
    } else {
      setIsAdminMode(false)
      setRole('customer')
      setEmail('')
      setPassword('')
      setError('')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header section inside card */}
      <div className="text-center">
        {isAdminMode ? (
          <div className="flex flex-col items-center gap-1.5 animate-in fade-in-0 duration-300">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Shield className="size-3.5" />
              <span>ADMINISTRATOR PORTAL</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Welcome Admin 🛡️
            </h1>
            <p className="text-xs text-muted-foreground">
              GenZMart Store Management System & Control Panel
            </p>
          </div>
        ) : (
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Sign in to your GenZMart account</p>
          </div>
        )}
      </div>

      {/* Admin Mode Special Welcome Banner */}
      {isAdminMode && (
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-3 text-xs text-foreground flex flex-col gap-1.5 animate-in fade-in-0 duration-200">
          <div className="flex items-center justify-between font-bold text-primary">
            <span className="flex items-center gap-1 text-xs">
              <Shield className="size-3.5" />
              Admin Mode Active
            </span>
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono font-semibold">PRE-FILLED</span>
          </div>
          <p className="text-muted-foreground text-[11px]">
            Log in with Admin ID: <code className="text-primary font-mono font-semibold">admin@genzmart.com</code> / <code className="text-primary font-mono font-semibold">admin123</code>
          </p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder={isAdminMode ? "admin@genzmart.com" : "you@example.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Label className="flex items-center gap-2 text-sm font-normal">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} id="remember" />
          Remember me
        </Label>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className={cn(
            "w-full font-semibold transition-all",
            isAdminMode ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 glow-primary" : "glow-primary"
          )}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading
            ? 'Signing in…'
            : isAdminMode
            ? 'Sign in as Admin 🛡️'
            : 'Sign in'}
          {!loading && <ArrowRight data-icon="inline-end" />}
        </Button>
      </form>

      {/* Footer links inside card */}
      <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
        <div>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Create one
          </Link>
        </div>

        <div>
          Are you a seller?{' '}
          <Link href="/seller/dashboard" className="font-semibold text-foreground hover:text-accent underline">
            Seller login
          </Link>
        </div>
      </div>

      {/* Admin Login Button - Bottom inside the Card */}
      <div className="pt-3 border-t border-border/50">
        {!isAdminMode ? (
          <Button
            type="button"
            variant="outline"
            onClick={toggleAdminMode}
            className="w-full h-11 text-xs font-extrabold tracking-wider border-primary/50 text-primary bg-primary/10 hover:bg-primary/20 shadow-sm transition-all gap-2"
          >
            <Shield className="size-4 text-primary" />
            <span>ADMIN LOGIN PORTAL</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={toggleAdminMode}
            className="w-full h-9 text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            <span>Switch back to Customer login</span>
          </Button>
        )}
      </div>
    </div>
  )
}
