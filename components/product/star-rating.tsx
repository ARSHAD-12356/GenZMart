import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRating({
  rating,
  size = 14,
  className,
}: {
  rating: number
  size?: number
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i))
        return (
          <span key={i} className="relative inline-flex" style={{ width: size, height: size }}>
            <Star className="absolute text-muted-foreground/40" style={{ width: size, height: size }} />
            <span className="absolute overflow-hidden" style={{ width: `${fill * 100}%`, height: size }}>
              <Star
                className="fill-warning text-warning"
                style={{ width: size, height: size }}
              />
            </span>
          </span>
        )
      })}
    </div>
  )
}
