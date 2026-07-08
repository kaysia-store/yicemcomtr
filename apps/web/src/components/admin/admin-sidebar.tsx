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
  { id: "menu", href: "/admin/menu", label: "Menü", emoji: "📋" },
  { id: "prices", href: "/admin/prices", label: "Fiyatlar", emoji: "💰" },
  { id: "extras", href: "/admin/extras", label: "Ek Özellikler", emoji: "🧩" },
  { id: "languages", href: "/admin/languages", label: "Diller", emoji: "🌍" },
  { id: "settings", href: "/admin/settings", label: "Ayarlar", emoji: "⚙️" },
];

function isNavActive(pathname: string, item: NavItem): boolean {
  switch (item.id) {
    case "home":
      return pathname.startsWith("/admin/dashboard");
    case "menu":
      return pathname.startsWith("/admin/menu") || pathname.startsWith("/admin/categories") || pathname.startsWith("/admin/products");
    case "prices":
      return pathname.startsWith("/admin/prices");
    case "extras":
      return pathname.startsWith("/admin/extras");
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
          <img src="/karakter2.png" alt="" className="admin-sidebar-avatar-img" />
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
