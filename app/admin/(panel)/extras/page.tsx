import Link from "next/link";
import { Suspense } from "react";
import { deleteExtraOption, moveExtraOption } from "@/app/admin/actions/extras";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { SortButtons } from "@/components/admin/list-controls";
import { MenuSectionNav } from "@/components/admin/menu-section-nav";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { formatPrice } from "@/lib/format";
import { getExtraOptionList } from "@/lib/admin-data";

export const metadata = { title: "Ek seçenekler" };

function kindLabel(kind: string) {
  if (kind === "menu") return "Menüden";
  if (kind === "list") return "Liste";
  return "Sabit";
}

export default function ExtrasPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ExtrasContent />
    </Suspense>
  );
}

async function ExtrasContent() {
  const result = await getExtraOptionList();
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;

  return (
    <div>
      <PageHeader
        action={
          <Link className="btn btn-primary" href="/admin/extras/new">
            Ek seçenek ekle
          </Link>
        }
        description="Cips+içecek, ekmek gibi ortak seçimleri burada tanımlayıp kategorilere bağlayın."
        title="Ek seçenekler"
      />
      <MenuSectionNav />
      {result.extras.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">
          Henüz ek seçenek yok.
        </p>
      ) : (
        <ul className="grid gap-3">
          {result.extras.map((item, index) => (
            <li className="flex flex-wrap items-center gap-3 rounded-3xl border border-line bg-card px-3 py-3" key={item.id}>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-muted">
                  {kindLabel(item.kind)}
                  {" · "}
                  {item.selection === "multiple" ? "Çoklu" : "Tekli"}
                  {item.required ? " · Zorunlu" : ""}
                  {item.kind === "fixed" || item.kind === "menu" ? ` · ${formatPrice(item.price)}` : ""}
                  {item.kind === "list" ? ` · ${item.choiceCount} seçenek` : ""}
                  {item.kind === "menu" && item.menuCategoryName ? ` · ${item.menuCategoryName}` : ""}
                  {item.boundProductCount > 0 ? ` · ${item.boundProductCount} ürün` : ""}
                  {item.boundCategoryCount > 0 ? ` · ${item.boundCategoryCount} kategori` : ""}
                </p>
              </div>
              <SortButtons action={moveExtraOption} id={item.id} index={index} total={result.extras.length} />
              <Link className="btn btn-secondary" href={`/admin/extras/${item.id}`}>
                Düzenle
              </Link>
              <ConfirmSubmit
                action={deleteExtraOption.bind(null, item.id)}
                confirm="Bu ek seçeneği silmek istediğinize emin misiniz?"
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
