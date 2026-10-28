import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { logout } from "@/app/admin/actions/settings";
import { AdminNav } from "@/components/admin/nav";
import { LoadingState } from "@/components/loading-state";
import { countNewOrders } from "@/lib/admin-orders";
import { getSiteUrl, getSupabaseEnv } from "@/lib/supabase/env";
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
  let locale = "tr";
  if (getSupabaseEnv()) {
    const supabase = await createClient();
    const [{ data: auth }, settings] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("restaurant_settings").select("default_locale").eq("id", 1).maybeSingle(),
    ]);
    label = auth.user?.email ?? "Yönetici";
    if (settings.data?.default_locale) locale = String(settings.data.default_locale);
  }
  const newOrders = await countNewOrders();
  const configured = getSiteUrl();
  const site =
    configured && !/localhost|127\.0\.0\.1/i.test(configured) ? configured : "https://yicem.com.tr";
  const menuUrl = `${site}/${locale}`;

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
            className="mt-2 block text-center text-xs font-medium text-accent hover:underline"
            href={menuUrl}
            rel="noreferrer"
            target="_blank"
          >
            QR menü
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
