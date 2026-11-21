import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { saveExtraOption } from "@/app/admin/actions/extras";
import { ExtraOptionForm } from "@/components/admin/extra-option-form";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { getExtraOptionEditor } from "@/lib/admin-data";
import { uuidPattern } from "@/lib/validators";

export const metadata = { title: "Ek seçeneği düzenle" };

export default function EditExtraPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<LoadingState />}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidPattern.test(id)) notFound();
  const result = await getExtraOptionEditor(id);
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;
  if (!result.extra) notFound();

  return (
    <div>
      <PageHeader
        action={
          <Link className="btn btn-secondary" href="/admin/extras">
            Listeye dön
          </Link>
        }
        title="Ek seçeneği düzenle"
      />
      <ExtraOptionForm action={saveExtraOption} categories={result.categories} extra={result.extra} />
    </div>
  );
}
