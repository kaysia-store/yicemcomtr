import Link from "next/link";
import { Suspense } from "react";
import { saveExtraOption } from "@/app/admin/actions/extras";
import { ExtraOptionForm } from "@/components/admin/extra-option-form";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { SetupNotice } from "@/components/setup-notice";
import { getExtraOptionCreateData } from "@/lib/admin-data";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const metadata = { title: "Yeni ek seçenek" };

export default function NewExtraPage() {
  if (!getSupabaseEnv()) return <SetupNotice />;
  return (
    <Suspense fallback={<LoadingState />}>
      <NewExtraContent />
    </Suspense>
  );
}

async function NewExtraContent() {
  const result = await getExtraOptionCreateData();
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;

  return (
    <div>
      <PageHeader
        action={
          <Link className="btn btn-secondary" href="/admin/extras">
            Listeye dön
          </Link>
        }
        title="Yeni ek seçenek"
      />
      <ExtraOptionForm action={saveExtraOption} categories={result.categories} products={result.products} />
    </div>
  );
}
