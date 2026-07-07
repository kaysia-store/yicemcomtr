"use client";

import { usePathname } from "next/navigation";
import { useAdminHeaderSlot } from "./admin-header-context";

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/admin/categories")) return "Kategoriler";
  if (pathname.startsWith("/admin/products")) return "Ürünler";
  if (pathname.startsWith("/admin/languages")) return "Diller";
  if (pathname.startsWith("/admin/settings")) return "Ayarlar";
  if (pathname.startsWith("/admin/dashboard")) return "Ana Sayfa";
  return "Yicem Admin";
}

type Props = {
  onMenuOpen: () => void;
};

export default function AdminHeader({ onMenuOpen }: Props) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const { slot } = useAdminHeaderSlot();

  return (
    <header className="admin-top-appbar">
      <div className="admin-top-appbar-left">
        <button type="button" className="admin-menu-btn" onClick={onMenuOpen} aria-label="Menüyü aç">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="admin-top-appbar-title">{title}</h2>
      </div>
      {slot.toolbar ? <div className="admin-top-appbar-actions">{slot.toolbar}</div> : null}
    </header>
  );
}
