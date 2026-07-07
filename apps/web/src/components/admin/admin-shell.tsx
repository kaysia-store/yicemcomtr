"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AdminDataProvider } from "./providers/admin-data-provider";
import AdminHeader from "./admin-header";
import AdminSidebar from "./admin-sidebar";

type Props = {
  children: ReactNode;
};

export default function AdminShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/admin/login");
      else {
        setUserEmail(data.session.user.email ?? null);
        setReady(true);
      }
    });
  }, [router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="admin-loading-screen">
        <span className="material-symbols-outlined admin-loading-icon">progress_activity</span>
        <p>Yükleniyor…</p>
      </div>
    );
  }

  return (
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
      <div className="admin-main">
        <AdminHeader userEmail={userEmail} onMenuOpen={() => setSidebarOpen(true)} />
        <div className="admin-content">
          <AdminDataProvider>{children}</AdminDataProvider>
        </div>
      </div>
    </div>
  );
}
