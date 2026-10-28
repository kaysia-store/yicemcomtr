import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { logout } from "@/app/admin/actions/settings";
import { AdminNav } from "@/components/admin/nav";
import { LoadingState } from "@/components/loading-state";
import { countNewOrders } from "@/lib/admin-orders";
import { purgeExpiredOrderCustomerData } from "@/lib/purge-orders";
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
  await connection();
  let label = "İnceleme modu";
  if (getSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    label = user?.email ?? "Yönetici";
  }
  const [newOrders] = await Promise.all([countNewOrders(), purgeExpiredOrderCustomerData()]);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="flex flex-col border-b border-line bg-card md:sticky md:top-0 md:h-screen md:overflow-y-auto md:border-r md:border-b-0">
        <div className="px-4 py-4">
          <Link className="font-serif text-2xl" href="/admin">
            Yönetim
          </Link>
          <div className="mt-3 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="h-24 w-auto object-contain" src="/karakter.png" />
          </div>
          <p className="mt-2 truncate text-center text-xs text-muted">{label}</p>
          <a
            className="mt-3 block rounded-full border border-line px-3 py-2 text-center text-sm font-medium hover:bg-paper"
            href="https://yicem.com.tr"
            rel="noreferrer"
            target="_blank"
          >
            QR menüye git
          </a>
        </div>
        <AdminNav newOrders={newOrders} />
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
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
