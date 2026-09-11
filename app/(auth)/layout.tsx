import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-md transition-all hover:bg-muted hover:text-foreground hover:border-border"
      >
        <ArrowLeft className="size-3.5" />
        <span>Back to home</span>
      </Link>

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -top-32 -left-32 size-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="animate-float-slower absolute -bottom-32 -right-32 size-[500px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="bg-grid absolute inset-0 opacity-40" />
      </div>

      {/* CSS/Text Wordmark Logo */}
      <Link href="/" className="relative mb-8 flex items-center shrink-0 font-display text-2xl font-extrabold tracking-tight group">
        <span className="text-foreground transition-colors group-hover:text-primary">GenZ</span>
        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Mart
        </span>
      </Link>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl border border-border/60">{children}</div>
      </div>

      <p className="relative mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 flex-wrap">
        <span>© {new Date().getFullYear()} GenZMart · All rights reserved</span>
        <span>•</span>
        <span>Developed by</span>
        <span className="font-extrabold bg-gradient-to-r from-primary via-accent to-emerald-400 bg-clip-text text-transparent animate-gradient-flow">
          ArshXcoder
        </span>
      </p>
    </div>
  )
}
