"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin/products", label: "Liste" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/prices", label: "Fiyatlar" },
  { href: "/admin/photos", label: "Görseller" },
];

export function MenuSectionNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex flex-wrap gap-1 rounded-full border border-line bg-card p-1">
      {tabs.map((tab) => {
        const active =
          tab.href === "/admin/products"
            ? pathname === "/admin/products" || pathname.startsWith("/admin/products/")
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-full bg-accent px-3 py-1.5 text-sm text-white"
                : "rounded-full px-3 py-1.5 text-sm text-ink hover:bg-paper"
            }
            href={tab.href}
            key={tab.href}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
