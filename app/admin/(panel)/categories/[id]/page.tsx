import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryForm } from "@/components/admin/category-form";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { saveCategory } from "@/app/admin/actions/categories";
import { getCategoryEditor } from "@/lib/admin-data";
import { uuidPattern } from "@/lib/validators";

export const metadata = { title: "Kategoriyi düzenle" };

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<LoadingState />}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidPattern.test(id)) notFound();
  const result = await getCategoryEditor(id);
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;
  if (!result.category) notFound();

  return (
    <div>
      <PageHeader
        action={
          <Link className="btn btn-secondary" href="/admin/categories">
            Listeye dön
          </Link>
        }
        title="Kategoriyi düzenle"
      />
      <CategoryForm action={saveCategory} category={result.category} />
    </div>
  );
}
