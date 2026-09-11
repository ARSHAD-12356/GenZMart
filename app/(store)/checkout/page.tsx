'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Check,
  ChevronRight,
  MapPin,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Truck,
  Zap,
  Tag,
  AlertCircle,
  Plus,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { formatPrice } from '@/lib/format'
import { couponService, orderService } from '@/lib/services'
import { useStore } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const TAX_RATE = 0.08
const STEPS = ['Address', 'Shipping', 'Payment', 'Review'] as const
type Step = (typeof STEPS)[number]

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Shipping', sub: '3–7 business days', price: 0 },
  { id: 'express', label: 'Express Shipping', sub: '1–2 business days', price: 9.99 },
  { id: 'overnight', label: 'Overnight', sub: 'Next business day', price: 19.99 },
]

const PAYMENT_OPTIONS = [
  { id: 'cod', label: 'Cash on Delivery', icon: Truck },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
]

interface Address {
  name: string; phone: string; line1: string; line2: string; city: string; state: string; zip: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartSubtotal, clearCart, user } = useStore()

  const [step, setStep] = useState<Step>('Address')
  const [address, setAddress] = useState<Address>({ name: '', phone: '', line1: '', line2: '', city: '', state: '', zip: '' })
  const [addressErrors, setAddressErrors] = useState<Partial<Address>>({})
  const [shipping, setShipping] = useState('standard')
  const [payment, setPayment] = useState('cod')
  const [couponInput, setCouponInput] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [placing, setPlacing] = useState(false)

  const shippingCost = SHIPPING_OPTIONS.find((s) => s.id === shipping)?.price ?? 0
  const discountedSub = Math.max(0, cartSubtotal - couponDiscount)
  const tax = Math.round(discountedSub * TAX_RATE)
  const total = discountedSub + shippingCost + tax

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><ShoppingBag /></EmptyMedia>
            <EmptyTitle>Nothing to checkout</EmptyTitle>
            <EmptyDescription>Add items to your cart first.</EmptyDescription>
          </EmptyHeader>
          <Button render={<Link href="/products" />}>Shop now</Button>
        </Empty>
      </div>
    )
  }

  const validateAddress = () => {
    const errs: Partial<Address> = {}
    if (!address.name.trim()) errs.name = 'Required'
    if (!address.phone.trim()) errs.phone = 'Required'
    if (!address.line1.trim()) errs.line1 = 'Required'
    if (!address.city.trim()) errs.city = 'Required'
    if (!address.state.trim()) errs.state = 'Required'
    if (!address.zip.trim()) errs.zip = 'Required'
    setAddressErrors(errs)
    return Object.keys(errs).length === 0
  }

  const nextStep = () => {
    const idx = STEPS.indexOf(step)
    if (step === 'Address' && !validateAddress()) return
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }

  const prevStep = () => {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  const applyCoupon = async () => {
    const result = couponService.validate(couponInput, cartSubtotal)
    if (result.ok) {
      setCouponDiscount(result.discount)
      setCouponCode(couponInput)
      setCouponError('')
      toast('Coupon applied!', { description: `You saved ${formatPrice(result.discount)}.` })
    } else {
      setCouponError(result.message)
    }
  }

  const placeOrder = async () => {
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 1500))
    const orderNum = `GZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    // Create real order dynamically
    orderService.createOrder({
      orderNumber: orderNum,
      customer: address.name || user?.name || 'Customer',
      seller: 'GenZMart Direct',
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        variant: item.variant,
      })),
      subtotal: cartSubtotal,
      discount: couponDiscount,
      shipping: shippingCost,
      tax: tax,
      total: total,
      paymentMethod: PAYMENT_OPTIONS.find((p) => p.id === payment)?.label || payment,
      paymentStatus: payment === 'cod' ? 'Pending' : 'Paid',
      orderStatus: 'Placed',
      address: `${address.name}, ${address.line1}${address.line2 ? `, ${address.line2}` : ''}, ${address.city}, ${address.state} ${address.zip} (Phone: ${address.phone})`,
    })

    clearCart()
    router.push(
      `/order-success?order=${orderNum}&total=${total}&payment=${payment}&address=${encodeURIComponent(
        `${address.name}, ${address.line1}, ${address.city}, ${address.state} ${address.zip}`,
      )}`,
    )
  }

  const stepIndex = STEPS.indexOf(step)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold">Checkout</h1>

      {/* Progress stepper */}
      <div className="mb-10 flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'grid size-8 place-items-center rounded-full text-sm font-bold transition-all',
                  i < stepIndex ? 'bg-primary text-primary-foreground' : i === stepIndex ? 'bg-primary text-primary-foreground ring-4 ring-primary/30' : 'bg-muted text-muted-foreground',
                )}
              >
                {i < stepIndex ? <Check className="size-4" /> : i + 1}
              </div>
              <span className={cn('hidden text-xs sm:block', i === stepIndex ? 'text-foreground font-medium' : 'text-muted-foreground')}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('mx-2 h-0.5 flex-1 transition-all', i < stepIndex ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Step content */}
        <div className="flex flex-col gap-6">
          {/* ── Address ── */}
          {step === 'Address' && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Delivery address</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={addressErrors.name}>
                  <Input value={address.name} onChange={(e) => setAddress((a) => ({ ...a, name: e.target.value }))} placeholder="Your name" />
                </Field>
                <Field label="Phone" error={addressErrors.phone}>
                  <Input value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
                </Field>
                <Field label="Address line 1" error={addressErrors.line1} className="sm:col-span-2">
                  <Input value={address.line1} onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))} placeholder="Street address" />
                </Field>
                <Field label="Address line 2 (optional)" className="sm:col-span-2">
                  <Input value={address.line2} onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))} placeholder="Apartment, suite, unit" />
                </Field>
                <Field label="City" error={addressErrors.city}>
                  <Input value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} placeholder="City" />
                </Field>
                <Field label="State" error={addressErrors.state}>
                  <Input value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} placeholder="State" />
                </Field>
                <Field label="ZIP / PIN code" error={addressErrors.zip}>
                  <Input value={address.zip} onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))} placeholder="ZIP code" />
                </Field>
              </div>
            </div>
          )}

          {/* ── Shipping ── */}
          {step === 'Shipping' && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Truck className="size-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Shipping method</h2>
              </div>
              <RadioGroup value={shipping} onValueChange={setShipping} className="flex flex-col gap-3">
                {SHIPPING_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition',
                      shipping === opt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={opt.id} id={`ship-${opt.id}`} />
                      <div>
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-sm text-muted-foreground">{opt.sub}</p>
                      </div>
                    </div>
                    <span className="font-semibold">
                      {opt.price === 0 ? <span className="text-success">Free</span> : formatPrice(opt.price)}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* ── Payment ── */}
          {step === 'Payment' && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="size-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Payment method</h2>
              </div>
              <RadioGroup value={payment} onValueChange={setPayment} className="flex flex-col gap-3">
                {PAYMENT_OPTIONS.map(({ id, label, icon: Icon }) => (
                  <label
                    key={id}
                    className={cn(
                      'flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition',
                      payment === id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                    )}
                  >
                    <RadioGroupItem value={id} id={`pay-${id}`} />
                    <Icon className="size-5 text-muted-foreground" />
                    <span className="font-medium">{label}</span>
                  </label>
                ))}
              </RadioGroup>

              {payment === 'card' && (
                <div className="mt-4 grid gap-3 rounded-xl border border-border p-4">
                  <Field label="Card number">
                    <Input placeholder="1234 5678 9012 3456" maxLength={19} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Expiry (MM/YY)">
                      <Input placeholder="MM/YY" maxLength={5} />
                    </Field>
                    <Field label="CVV">
                      <Input placeholder="•••" maxLength={4} type="password" />
                    </Field>
                  </div>
                  <Field label="Name on card">
                    <Input placeholder="Full name" />
                  </Field>
                </div>
              )}

              {payment === 'upi' && (
                <div className="mt-4 rounded-xl border border-border p-4">
                  <Field label="UPI ID">
                    <Input placeholder="yourname@upi" />
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* ── Review ── */}
          {step === 'Review' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2"><MapPin className="size-4 text-primary" /> Delivery to</h3>
                  <Button variant="ghost" size="xs" onClick={() => setStep('Address')}>Edit</Button>
                </div>
                <p className="text-sm text-muted-foreground">{address.name} · {address.phone}</p>
                <p className="text-sm">{address.line1}{address.line2 && `, ${address.line2}`}, {address.city}, {address.state} {address.zip}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2"><Truck className="size-4 text-primary" /> Shipping</h3>
                  <Button variant="ghost" size="xs" onClick={() => setStep('Shipping')}>Edit</Button>
                </div>
                <p className="text-sm">{SHIPPING_OPTIONS.find((s) => s.id === shipping)?.label}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2"><CreditCard className="size-4 text-primary" /> Payment</h3>
                  <Button variant="ghost" size="xs" onClick={() => setStep('Payment')}>Edit</Button>
                </div>
                <p className="text-sm">{PAYMENT_OPTIONS.find((p) => p.id === payment)?.label}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-3 font-semibold">Items ({cart.length})</h3>
                <div className="flex flex-col gap-3">
                  {cart.map((line) => (
                    <div key={`${line.productId}-${line.variant}`} className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image src={line.image} alt={line.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium">{line.name}</p>
                        {line.variant && <p className="text-xs text-muted-foreground">{line.variant}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{formatPrice(line.price * line.quantity)}</p>
                        <p className="text-xs text-muted-foreground">×{line.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between gap-3">
            {stepIndex > 0 ? (
              <Button variant="outline" onClick={prevStep}>Back</Button>
            ) : (
              <Button variant="outline" render={<Link href="/cart" />}>← Cart</Button>
            )}
            {step === 'Review' ? (
              <Button size="lg" className="flex-1" onClick={placeOrder} disabled={placing}>
                {placing ? 'Placing order…' : 'Place order'}
                <Zap data-icon="inline-end" />
              </Button>
            ) : (
              <Button size="lg" onClick={nextStep}>
                Continue <ChevronRight data-icon="inline-end" />
              </Button>
            )}
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-lg font-bold">Order Summary</h2>
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({cart.reduce((n, l) => n + l.quantity, 0)} items)</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Coupon ({couponCode})</span>
                  <span>−{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingCost === 0 ? <span className="text-success">Free</span> : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <span className="font-display font-bold">Total</span>
              <span className="font-display text-xl font-bold">{formatPrice(total)}</span>
            </div>

            {/* Coupon in sidebar */}
            {step === 'Payment' && !couponCode && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-muted-foreground">Have a coupon?</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Code (try GENZ10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="h-8 text-sm"
                  />
                  <Button size="sm" variant="outline" onClick={applyCoupon} disabled={!couponInput.trim()}>
                    <Tag className="size-3.5" />
                  </Button>
                </div>
                {couponError && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="size-3" /> {couponError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="size-3" /> {error}
        </p>
      )}
    </div>
  )
}
