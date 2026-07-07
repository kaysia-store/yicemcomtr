"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AdminHeaderSlotProvider } from "./admin-header-context";
import { AdminDataProvider } from "./providers/admin-data-provider";
import AdminHeader from "./admin-header";
import AdminLoadingSpinner from "./ui/admin-loading-spinner";
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

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="admin-loading-screen">
        <AdminLoadingSpinner size="lg" />
        <p>Yükleniyor…</p>
      </div>
    );
  }

  return (
    <AdminHeaderSlotProvider>
      <div className="admin-app">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen ? (
          <button
            type="button"
            className="admin-overlay"
            aria-label="Menüyü kapat"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
        <main className="admin-main">
          <AdminHeader onMenuOpen={() => setSidebarOpen(true)} />
          <div className="admin-content">
            <AdminDataProvider>{children}</AdminDataProvider>
          </div>
        </main>
      </div>
    </AdminHeaderSlotProvider>
  );
}
