"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  Palette,
  Layers,
  ShoppingCart,
  ChevronDown,
  Settings,
  Shield,
  Wrench,
  FolderTree,
  PackageOpen,
  Monitor,
  Plus,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuGroups = [
  {
    title: "Tổng Quan",
    items: [
      {
        label: "Bảng Điều Khiển",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Quản Lý Sản Phẩm",
    items: [
      {
        label: "Sản Phẩm",
        href: "/products",
        icon: Package,
      },
      {
        label: "Đơn Vị Sản Phẩm",
        href: "/product-units",
        icon: PackageOpen,
      },
      {
        label: "Máy Tính Xây Sẵn",
        href: "/configurable-products",
        icon: Monitor,
      },
      {
        label: "Thuộc Tính",
        href: "/attributes",
        icon: Layers,
      },
      {
        label: "Thuộc Tính Sản Phẩm",
        href: "/product-attributes",
        icon: Settings,
      },
    ],
  },
  {
    title: "Tổ Chức Danh Mục",
    items: [
      {
        label: "Danh Mục",
        href: "/categories",
        icon: Tag,
      },
      {
        label: "Danh Mục Con",
        href: "/subcategories",
        icon: FolderTree,
      },
      {
        label: "Thương Hiệu",
        href: "/brands",
        icon: Palette,
      },
    ],
  },
  {
    title: "Dịch Vụ",
    items: [
      {
        label: "Bảo Hành",
        href: "/warranty",
        icon: Shield,
      },
    ],
  },
  {
    title: "Bán Hàng",
    items: [
      {
        label: "Đơn Hàng",
        href: "/orders",
        icon: ShoppingCart,
      },
      {
        label: "Tạo Đơn Hàng",
        href: "/orders/create",
        icon: Plus,
      },
      {
        label: "Chuẩn Bị Đơn Hàng",
        href: "/orders/preparation",
        icon: ClipboardList,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {isOpen && (
          <h1 className="text-xl font-bold text-sidebar-foreground">Nexora</h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-sidebar-accent rounded-md transition-colors"
        >
          <ChevronDown
            size={20}
            className={cn(
              "text-sidebar-foreground transition-transform",
              !isOpen && "rotate-90"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-6">
            {isOpen && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                    title={!isOpen ? item.label : undefined}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {isOpen && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
