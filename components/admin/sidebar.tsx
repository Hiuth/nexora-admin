"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Tag,
  Layers,
  ShoppingCart,
  Boxes,
  Settings,
  Menu,
  FolderTree,
  Shield,
  Monitor,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutGrid,
  },
  {
    label: "Quản lý danh mục",
    href: "/admin/categories",
    icon: Layers,
  },
  {
    label: "Quản lý danh mục con",
    href: "/admin/subcategories",
    icon: FolderTree,
  },
  {
    label: "Quản lý thương hiệu",
    href: "/admin/brands",
    icon: Tag,
  },
  {
    label: "Quản lý thuộc tính",
    href: "/admin/attributes",
    icon: Settings,
  },
  {
    label: "Quản lý sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Quản lý đơn vị sản phẩm",
    href: "/admin/product-units",
    icon: Boxes,
  },
  {
    label: "Quản lý PC Build",
    href: "/admin/pc-builds",
    icon: Monitor,
  },
  {
    label: "Quản lý đơn hàng",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Quản lý bảo hành",
    href: "/admin/warranty",
    icon: Shield,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {isOpen && (
            <h1 className="text-xl font-bold text-sidebar-foreground">
              Nexora
            </h1>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <Menu size={20} className="text-sidebar-foreground" />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-sidebar-primary-foreground">
              A
            </span>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Admin
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                admin@nexora.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
