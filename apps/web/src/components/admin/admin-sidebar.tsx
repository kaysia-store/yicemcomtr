"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  open: boolean;
  onClose: () => void;
};

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊", short: "Özet" },
  { href: "/admin/menu", label: "Menü", icon: "🍽️", short: "Menü" },
];

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
      <div className="admin-sidebar-brand" title="Yi'Cem Admin">
        <strong>YC</strong>
      </div>

      <nav className="admin-sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link ${active ? "active" : ""}`}
              onClick={onClose}
              title={item.label}
            >
              <span className="admin-sidebar-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="admin-sidebar-text">{item.short}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-sidebar-link" onClick={onClose} title="Canlı Menü">
          <span className="admin-sidebar-icon" aria-hidden="true">
            🌐
          </span>
          <span className="admin-sidebar-text">Site</span>
        </Link>
        <button
          type="button"
          className="admin-sidebar-link admin-sidebar-logout"
          onClick={() => void handleLogout()}
          title="Çıkış"
        >
          <span className="admin-sidebar-icon" aria-hidden="true">
            🚪
          </span>
          <span className="admin-sidebar-text">Çıkış</span>
        </button>
      </div>
    </aside>
  );
}
