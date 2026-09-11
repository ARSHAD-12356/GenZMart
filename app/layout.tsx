import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'
import { StoreProvider } from '@/components/providers/store-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'GenZMart — Shop bold. Live loud.',
    template: '%s · GenZMart',
  },
  description:
    'GenZMart is the premium marketplace for the always-on generation — audio, wearables, gaming, mobile and lifestyle gear that hits different.',
  keywords: ['GenZMart', 'ecommerce', 'gadgets', 'audio', 'wearables', 'gaming'],
  generator: 'v0.app',
  openGraph: {
    title: 'GenZMart — Shop bold. Live loud.',
    description: 'The premium marketplace built for Gen Z.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: '#0e0e14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground tracking-[-0.01em]">
        <ThemeProvider>
          <StoreProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster position="top-center" />
          </StoreProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
