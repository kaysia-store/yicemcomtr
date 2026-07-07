"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  open: boolean;
  onClose: () => void;
};

type NavItem = {
  id: string;
  href: string;
  label: string;
  emoji: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", href: "/admin/dashboard", label: "Ana Sayfa", emoji: "🏠" },
  { id: "categories", href: "/admin/categories", label: "Kategoriler", emoji: "📂" },
  { id: "products", href: "/admin/products", label: "Ürünler", emoji: "🍽️" },
  { id: "product-options", href: "/admin/products", label: "Ürün Seçenekleri", emoji: "🎛️" },
  { id: "languages", href: "/admin/languages", label: "Diller", emoji: "🌍" },
  { id: "settings", href: "/admin/settings", label: "Ayarlar", emoji: "⚙️" },
];

function isNavActive(pathname: string, item: NavItem): boolean {
  switch (item.id) {
    case "home":
      return pathname.startsWith("/admin/dashboard");
    case "categories":
      return pathname.startsWith("/admin/categories");
    case "products":
      return (
        pathname === "/admin/products" ||
        (pathname.startsWith("/admin/products") && !/\/products\/[^/]+/.test(pathname))
      );
    case "product-options":
      return /\/admin\/products\/[^/]+/.test(pathname);
    case "languages":
      return pathname.startsWith("/admin/languages");
    case "settings":
      return pathname.startsWith("/admin/settings");
    default:
      return pathname.startsWith(item.href);
  }
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <aside className={`admin-sidebar ${open ? "open" : ""}`}>
      <div className="admin-sidebar-profile">
        <div className="admin-sidebar-avatar" aria-hidden>
          <span className="admin-sidebar-emoji admin-sidebar-emoji-lg">👤</span>
        </div>
        <div>
          <h1 className="admin-sidebar-title">Yicem Admin</h1>
          <p className="admin-sidebar-tagline">QR Menü Yönetimi</p>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`admin-sidebar-link ${active ? "active" : ""}`}
              onClick={onClose}
            >
              <span className="admin-sidebar-emoji" aria-hidden>
                {item.emoji}
              </span>
              <span className="admin-sidebar-text">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-sidebar-link admin-sidebar-link-muted" onClick={onClose}>
          <span className="admin-sidebar-emoji" aria-hidden>
            🔗
          </span>
          <span className="admin-sidebar-text">Canlı Menü</span>
        </Link>
        <button
          type="button"
          className="admin-sidebar-link admin-sidebar-link-muted admin-sidebar-logout"
          onClick={() => void handleLogout()}
        >
          <span className="admin-sidebar-emoji" aria-hidden>
            🚪
          </span>
          <span className="admin-sidebar-text">Çıkış</span>
        </button>
        <span className="admin-sidebar-version">v1.0.4</span>
      </div>
    </aside>
  );
}
