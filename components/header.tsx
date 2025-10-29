"use client";

import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-card border-b border-border flex items-center justify-between px-6 z-30">
      <div className="flex-1">
        <h2 className="text-lg font-medium text-foreground">
          Bảng Điều Khiển Nexora
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-foreground">
          <Bell size={18} />
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-foreground">
          <Settings size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="text-foreground">
          <User size={18} />
        </Button>
      </div>
    </header>
  );
}
