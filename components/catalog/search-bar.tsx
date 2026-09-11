'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'

export function SearchBar({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter()
  const [q, setQ] = useState(initialQuery ?? '')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search')
      }}
    >
      <InputGroup className="h-12">
        <InputGroupInput
          autoFocus
          placeholder="Search products, brands, categories…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
