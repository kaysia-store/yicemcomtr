import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { Notice } from "@/components/notice";
import { SettingsForm } from "@/components/admin/settings-form";
import { saveRestaurantName } from "@/app/admin/actions/settings";
import { getDashboard } from "@/lib/admin-data";

export default function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  return (
    <Suspense fallback={<LoadingState />}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

async function Dashboard({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, result] = await Promise.all([searchParams, getDashboard()]);
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;

  return (
    <div>
      <PageHeader
        description="Kategorileri, ürünleri, dilleri ve QR kodu buradan yönetin."
        title={result.name}
      />
      {saved === "1" ? (
        <div className="mb-4">
          <Notice tone="ok">Ayarlar kaydedildi.</Notice>
        </div>
      ) : null}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Stat href="/admin/categories" label="Kategori" value={result.counts.categories} />
        <Stat href="/admin/products" label="Ürün" value={result.counts.products} />
        <Stat href="/admin/languages" label="Dil" value={result.counts.languages} />
      </div>
      <section className="max-w-xl rounded-3xl border border-line bg-card p-5">
        <h2 className="font-serif text-2xl">Restoran</h2>
        <div className="mt-4">
          <SettingsForm action={saveRestaurantName} name={result.name} showTitle={result.showTitle} />
        </div>
      </section>
      <p className="mt-6 text-sm text-muted">
        Müşteri menüsü:{" "}
        <Link className="font-medium text-accent" href={`/${result.defaultLocale}`}>
          /{result.defaultLocale}
        </Link>
      </p>
    </div>
  );
}

function Stat({ href, label, value }: { href: string; label: string; value: number }) {
  return (
    <Link className="rounded-3xl border border-line bg-card px-4 py-4" href={href}>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-serif text-3xl">{value}</p>
    </Link>
  );
}
