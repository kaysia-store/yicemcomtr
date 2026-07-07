"use client";

import { usePathname } from "next/navigation";

function formatHeaderDate() {
  return new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getPageMeta(pathname: string) {
  if (pathname.startsWith("/admin/menu")) {
    return { title: "Menü", subtitle: "Kategoriler, ürünler ve alt özellikler" };
  }
  if (pathname.startsWith("/admin/dashboard")) {
    return { title: "Özet", subtitle: formatHeaderDate() };
  }
  return { title: "Admin", subtitle: "Yi'Cem yönetim paneli" };
}

type Props = {
  userEmail: string | null;
  onMenuOpen: () => void;
};

function userInitials(email: string | null) {
  if (!email) return "YC";
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase() || "YC";
}

export default function AdminHeader({ userEmail, onMenuOpen }: Props) {
  const pathname = usePathname();
  const { title, subtitle } = getPageMeta(pathname);

  return (
    <header className="admin-page-header">
      <div className="admin-page-header-left">
        <button type="button" className="admin-menu-btn" onClick={onMenuOpen} aria-label="Menüyü aç">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h1 className="admin-page-title">{title}</h1>
          <p className="admin-page-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="admin-page-header-right">
        <div className="admin-user-chip" title={userEmail ?? undefined}>
          <span className="admin-user-avatar">{userInitials(userEmail)}</span>
          <span className="admin-user-email">{userEmail ?? "Admin"}</span>
        </div>
      </div>
    </header>
  );
}
