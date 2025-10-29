"use client"

import { Bell, Search, User } from "lucide-react"

export function Header() {
  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <button className="p-2 hover:bg-background rounded-lg transition-colors">
          <Bell size={20} className="text-foreground" />
        </button>
        <button className="p-2 hover:bg-background rounded-lg transition-colors">
          <User size={20} className="text-foreground" />
        </button>
      </div>
    </header>
  )
}
