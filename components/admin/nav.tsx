"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrdersLive } from "@/components/admin/orders-live-context";

const menuPaths = ["/admin/products", "/admin/categories", "/admin/prices", "/admin/photos"];

const items = [
  {
    href: "/admin",
    label: "Genel",
    active: (pathname: string) => pathname === "/admin",
  },
  {
    href: "/admin/orders",
    label: "Siparişler",
    active: (pathname: string) => pathname.startsWith("/admin/orders"),
  },
  {
    href: "/admin/products",
    label: "Ürünler",
    active: (pathname: string) => menuPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`)),
  },
  {
    href: "/admin/languages",
    label: "Diller",
    active: (pathname: string) => pathname.startsWith("/admin/languages"),
  },
  {
    href: "/admin/settings",
    label: "Ayarlar",
    active: (pathname: string) => pathname.startsWith("/admin/settings") || pathname.startsWith("/admin/qr"),
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const { newCount, live } = useOrdersLive();

  return (
    <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:grid md:gap-1 md:overflow-visible">
      {items.map((item) => {
        const active = item.active(pathname);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-full bg-accent px-3 py-2 text-sm whitespace-nowrap text-white"
                : "rounded-full px-3 py-2 text-sm whitespace-nowrap text-ink hover:bg-paper"
            }
            href={item.href}
            key={item.href}
          >
            <span className="inline-flex items-center gap-2">
              {item.label}
              {item.href === "/admin/orders" && newCount > 0 ? (
                <span
                  className={
                    active ? "rounded-full bg-white/20 px-1.5 text-[11px]" : "rounded-full bg-accent px-1.5 text-[11px] text-white"
                  }
                >
                  {newCount}
                </span>
              ) : null}
              {item.href === "/admin/orders" && live ? (
                <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" title="Canlı" />
              ) : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
