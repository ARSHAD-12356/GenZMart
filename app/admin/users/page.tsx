'use client'

import { useState } from 'react'
import { Search, UserCheck, UserX, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { adminService } from '@/lib/services'

const STATUS_COLOR: Record<string, string> = {
  active: 'bg-success/20 text-success',
  suspended: 'bg-destructive/20 text-destructive',
  inactive: 'bg-muted text-muted-foreground',
}

export default function AdminUsersPage() {
  const allUsers = adminService.getUsers()
  const [search, setSearch] = useState('')
  const users = allUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">{allUsers.length} registered users</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search users…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Joined</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Orders</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {new Date(u.joined).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{u.orders}</td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_COLOR[u.status]}>{u.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="icon-sm" variant="ghost" aria-label="Activate"><UserCheck className="size-3.5 text-success" /></Button>
                      <Button size="icon-sm" variant="ghost" aria-label="Suspend"><Ban className="size-3.5 text-warning" /></Button>
                      <Button size="icon-sm" variant="ghost" aria-label="Deactivate"><UserX className="size-3.5 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
