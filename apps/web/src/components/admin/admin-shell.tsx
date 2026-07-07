"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import AdminSidebar from "./admin-sidebar";

type Props = {
  children: ReactNode;
};

export default function AdminShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/admin/login");
      else setReady(true);
    });
  }, [router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="admin-loading-screen">
        <p>Yükleniyor…</p>
      </div>
    );
  }

  return (
    <div className="admin-app">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen ? <button type="button" className="admin-overlay" aria-label="Menüyü kapat" onClick={() => setSidebarOpen(false)} /> : null}
      <div className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="admin-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Menüyü aç">
            ☰
          </button>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}

export function AdminBreadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="admin-breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="admin-breadcrumb-item">
          {index > 0 ? <span className="admin-breadcrumb-sep">/</span> : null}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
