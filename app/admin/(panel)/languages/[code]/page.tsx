import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { saveTranslations } from "@/app/admin/actions/languages";
import { TranslationForm } from "@/components/admin/translation-form";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { getTranslationWorkspace } from "@/lib/admin-data";
import { localePattern } from "@/lib/validators";

export const metadata = { title: "Çeviriler" };

export default function LanguageEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  return (
    <Suspense fallback={<LoadingState />}>
      <Editor params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Editor({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ code }, query] = await Promise.all([params, searchParams]);
  if (!localePattern.test(code)) notFound();
  const result = await getTranslationWorkspace(code);
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;
  if (!result.workspace) notFound();

  return (
    <div>
      <PageHeader
        action={
          <Link className="btn btn-secondary" href="/admin/languages">
            Dillere dön
          </Link>
        }
        description={result.workspace.language.name}
        title="Çeviriler"
      />
      {query.saved === "1" ? (
        <div className="mb-4">
          <Notice tone="ok">Çeviriler kaydedildi.</Notice>
        </div>
      ) : null}
      <TranslationForm action={saveTranslations} workspace={result.workspace} />
    </div>
  );
}
