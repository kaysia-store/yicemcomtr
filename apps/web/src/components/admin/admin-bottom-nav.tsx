"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { id: "home", href: "/admin/dashboard", label: "Ana Sayfa", icon: "home" },
  { id: "categories", href: "/admin/categories", label: "Kategoriler", icon: "category" },
  { id: "products", href: "/admin/products", label: "Ürünler", icon: "restaurant_menu" },
  { id: "options", href: "/admin/products", label: "Seçenekler", icon: "tune" },
  { id: "settings", href: "/admin/settings", label: "Ayarlar", icon: "settings" },
];

function isBottomNavActive(pathname: string, id: string, href: string): boolean {
  switch (id) {
    case "home":
      return pathname.startsWith("/admin/dashboard");
    case "categories":
      return pathname.startsWith("/admin/categories");
    case "products":
      return (
        pathname === "/admin/products" ||
        (pathname.startsWith("/admin/products") && !/\/products\/[^/]+/.test(pathname))
      );
    case "options":
      return /\/admin\/products\/[^/]+/.test(pathname);
    case "settings":
      return pathname.startsWith("/admin/settings");
    default:
      return pathname.startsWith(href);
  }
}

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-bottom-nav" aria-label="Mobil navigasyon">
      {ITEMS.map((item) => {
        const active = isBottomNavActive(pathname, item.id, item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`admin-bottom-nav-link ${active ? "active" : ""}`}
          >
            <span
              className="material-symbols-outlined admin-bottom-nav-icon"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              aria-hidden
            >
              {item.icon}
            </span>
            <span className="admin-bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
