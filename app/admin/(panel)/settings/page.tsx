import { Suspense } from "react";
import { OrderSettingsForm } from "@/components/admin/order-settings-form";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { loadOrderSettings } from "@/lib/admin-orders";
import { defaultOrderSettings } from "@/lib/orders";

export const metadata = { title: "Ayarlar" };

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SettingsContent />
    </Suspense>
  );
}

async function SettingsContent() {
  const result = await loadOrderSettings();
  if (!result.ok && result.reason !== "schema") {
    return <LoadError message={result.message} reason={result.reason} />;
  }
  const settings = result.ok ? result.settings : defaultOrderSettings;

  return (
    <div>
      <PageHeader
        description="QR menü butonları, bildirim ve POS-80C fiş ayarları."
        title="Ayarlar"
      />
      {!result.ok ? (
        <p className="mb-4 rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          Sipariş ayar tablosu henüz yok. supabase/migrations/0007_repair_orders.sql dosyasını çalıştırın.
        </p>
      ) : null}
      <OrderSettingsForm settings={settings} />
      <section className="mt-8 max-w-xl rounded-3xl border border-line bg-card p-5">
        <h2 className="font-serif text-2xl">Önerilen ayarlar</h2>
        <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm leading-6 text-muted">
          <li>Mutfak kopyası: aynı fişi onayda iki kez yazdır (müşteri + mutfak).</li>
          <li>Sessiz saat: belirli saatlerde zili kapat, yalnızca ekran rozeti kalsın.</li>
          <li>Hazırlık süresi: siparişte “~15 dk” tahmini göster, fişe de yaz.</li>
        </ul>
      </section>
    </div>
  );
}
