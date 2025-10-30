"use client";

import { Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-provider";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

export function Header() {
  const { logout } = useAuth();
  const { user, getUserName, getUserEmail, getUserAvatar } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getUserAvatar()} alt={getUserName()} />
                <AvatarFallback>
                  {getUserName().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {getUserName()}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {getUserEmail()}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
