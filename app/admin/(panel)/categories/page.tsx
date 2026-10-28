import Link from "next/link";
import { Suspense } from "react";
import {
  deleteCategory,
  moveCategory,
  toggleCategoryPublished,
} from "@/app/admin/actions/categories";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { PublishButton, SortButtons } from "@/components/admin/list-controls";
import { MenuSectionNav } from "@/components/admin/menu-section-nav";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { getCategoryList } from "@/lib/admin-data";

export const metadata = { title: "Kategoriler" };

export default function CategoriesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CategoriesContent />
    </Suspense>
  );
}

async function CategoriesContent() {
  const result = await getCategoryList();
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;

  return (
    <div>
      <PageHeader
        action={
          <Link className="btn btn-primary" href="/admin/categories/new">
            Kategori ekle
          </Link>
        }
        description="Ürünler bu kategorilerin altında sıralanır."
        title="Kategoriler"
      />
      <MenuSectionNav />
      {result.categories.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">
          Henüz kategori yok.
        </p>
      ) : (
        <ul className="grid gap-3">
          {result.categories.map((category, index) => (
            <li className="flex flex-wrap items-center gap-3 rounded-3xl border border-line bg-card px-3 py-3" key={category.id}>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-muted">{category.isPublished ? "Yayında" : "Gizli"}</p>
              </div>
              <SortButtons
                action={moveCategory}
                id={category.id}
                index={index}
                total={result.categories.length}
              />
              <PublishButton action={toggleCategoryPublished} id={category.id} published={category.isPublished} />
              <Link className="btn btn-secondary" href={`/admin/categories/${category.id}`}>
                Düzenle
              </Link>
              <ConfirmSubmit
                action={deleteCategory.bind(null, category.id)}
                confirm="Bu kategoriyi silmek istediğinize emin misiniz?"
              >
                Sil
              </ConfirmSubmit>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
