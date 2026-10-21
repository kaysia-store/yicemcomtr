import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/app/admin/actions/settings";
import { AdminNav } from "@/components/admin/nav";
import { LoadingState } from "@/components/loading-state";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingState label="Panel yükleniyor…" />}>
      <AdminFrame>{children}</AdminFrame>
    </Suspense>
  );
}

async function AdminFrame({ children }: { children: React.ReactNode }) {
  let label = "İnceleme modu";
  if (getSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    label = user?.email ?? "Yönetici";
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="flex flex-col border-b border-line bg-card md:min-h-screen md:border-r md:border-b-0">
        <div className="px-4 py-4">
          <Link className="font-serif text-2xl" href="/admin">
            Yönetim
          </Link>
          <p className="mt-1 truncate text-xs text-muted">{label}</p>
        </div>
        <AdminNav />
        <div className="mt-auto px-3 py-4">
          {getSupabaseEnv() ? (
            <form action={logout}>
              <button className="btn btn-secondary w-full" type="submit">
                Çıkış
              </button>
            </form>
          ) : (
            <p className="px-1 text-xs leading-5 text-muted">
              Supabase bağlı değil. Düzenlemeler bu bilgisayardaki önizleme dosyasına yazılır.
            </p>
          )}
        </div>
      </aside>
      <main className="px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
