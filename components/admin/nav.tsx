"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Genel" },
  { href: "/admin/orders", label: "Siparişler" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/products", label: "Ürünler" },
  { href: "/admin/photos", label: "Görseller" },
  { href: "/admin/prices", label: "Fiyatlar" },
  { href: "/admin/languages", label: "Diller" },
  { href: "/admin/qr", label: "QR" },
  { href: "/admin/settings", label: "Ayarlar" },
];

export function AdminNav({ newOrders = 0 }: { newOrders?: number }) {
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:grid md:gap-1 md:overflow-visible">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
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
              {item.href === "/admin/orders" && newOrders > 0 ? (
                <span className={active ? "rounded-full bg-white/20 px-1.5 text-[11px]" : "rounded-full bg-accent px-1.5 text-[11px] text-white"}>
                  {newOrders}
                </span>
              ) : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
