import Link from "next/link";
import { Suspense } from "react";
import { addLanguage, deleteLanguage, setLanguageActive } from "@/app/admin/actions/languages";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { LanguageForm } from "@/components/admin/language-form";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { getLanguages } from "@/lib/admin-data";

export const metadata = { title: "Diller" };

export default function LanguagesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LanguagesContent />
    </Suspense>
  );
}

async function LanguagesContent() {
  const result = await getLanguages();
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;

  return (
    <div>
      <PageHeader
        description="Yeni dil butonu kaydı açar. Ürün ve kategori metinlerini sonraki ekranda girersiniz."
        title="Diller"
      />
      <LanguageForm action={addLanguage} />
      <ul className="mt-6 grid gap-3">
        {result.languages.map((language) => (
          <li className="flex flex-wrap items-center gap-3 rounded-3xl border border-line bg-card px-4 py-4" key={language.code}>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{language.name}</p>
              <p className="text-xs text-muted">
                {language.code}
                {language.isDefault ? " · Varsayılan" : ""}
                {language.isActive ? " · Yayında" : " · Gizli"}
              </p>
            </div>
            <Link className="btn btn-secondary" href={`/admin/languages/${language.code}`}>
              Çeviriler
            </Link>
            {language.isDefault ? null : (
              <form action={setLanguageActive}>
                <input type="hidden" name="code" value={language.code} />
                <input type="hidden" name="active" value={language.isActive ? "false" : "true"} />
                <button className="btn btn-secondary" type="submit">
                  {language.isActive ? "Gizle" : "Yayınla"}
                </button>
              </form>
            )}
            {language.isDefault ? null : (
              <ConfirmSubmit
                action={deleteLanguage.bind(null, language.code)}
                confirm="Bu dili ve çevirilerini silmek istediğinize emin misiniz?"
              >
                Sil
              </ConfirmSubmit>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
