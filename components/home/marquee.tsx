const items = [
  'FREE 2-DAY SHIPPING',
  'STUDENT DISCOUNT 15%',
  'NEW DROPS WEEKLY',
  '30-DAY RETURNS',
  'BUYER PROTECTION',
  'PAY IN 4',
]

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-border bg-primary py-3 text-primary-foreground">
      <div className="flex w-max animate-marquee items-center gap-8">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-sm font-semibold tracking-wide">
            {t}
            <span className="text-primary-foreground/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
