import Link from "next/link";
import { Suspense } from "react";
import { CategoryForm } from "@/components/admin/category-form";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { SetupNotice } from "@/components/setup-notice";
import { saveCategory } from "@/app/admin/actions/categories";
import { getExtraOptionList } from "@/lib/admin-data";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const metadata = { title: "Yeni kategori" };

export default function NewCategoryPage() {
  if (!getSupabaseEnv()) return <SetupNotice />;

  return (
    <Suspense fallback={<LoadingState />}>
      <NewCategoryContent />
    </Suspense>
  );
}

async function NewCategoryContent() {
  const list = await getExtraOptionList();
  const extraOptions = list.ok
    ? list.extras.map((item) => ({ id: item.id, name: item.name, kind: item.kind }))
    : [];
  if (!list.ok && list.reason !== "schema") {
    return <LoadError message={list.message} reason={list.reason} />;
  }

  return (
    <div>
      <PageHeader
        action={
          <Link className="btn btn-secondary" href="/admin/categories">
            Listeye dön
          </Link>
        }
        title="Yeni kategori"
      />
      <CategoryForm action={saveCategory} extraOptions={extraOptions} />
    </div>
  );
}
