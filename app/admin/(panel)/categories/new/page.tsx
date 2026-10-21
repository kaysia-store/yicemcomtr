import Link from "next/link";
import { CategoryForm } from "@/components/admin/category-form";
import { PageHeader } from "@/components/page-header";
import { SetupNotice } from "@/components/setup-notice";
import { saveCategory } from "@/app/admin/actions/categories";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const metadata = { title: "Yeni kategori" };

export default function NewCategoryPage() {
  if (!getSupabaseEnv()) return <SetupNotice />;

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
      <CategoryForm action={saveCategory} />
    </div>
  );
}
