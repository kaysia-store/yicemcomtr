"use client";

import { useActionState } from "react";
import { TranslateButton } from "@/components/admin/translate-button";
import { Notice } from "@/components/notice";
import { SubmitButton } from "@/components/submit-button";
import { idleActionState, type ActionState, type TranslationWorkspace } from "@/lib/types";

export function TranslationForm({
  action,
  workspace,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  workspace: TranslationWorkspace;
}) {
  const [state, formAction] = useActionState(action, idleActionState);
  const { language, defaultLocale } = workspace;
  const canTranslate = language.code !== defaultLocale;

  return (
    <form action={formAction} className="grid gap-8">
      <input type="hidden" name="locale" value={language.code} />
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
      <p className="text-sm leading-6 text-muted">
        {language.isDefault
          ? "Bu dil varsayılan dildir. Adlar boş bırakılamaz."
          : "Ad boş bırakılırsa o çeviri silinir ve menü varsayılan dile düşer. Çevir butonu otomatik çeviri altyapısını çağırır; servis bağlantısı henüz kurulmadı."}
      </p>
      <label className="grid max-w-md gap-1.5 text-sm font-medium" htmlFor="language-display-name">
        Dilin görünen adı
        <input className="field" defaultValue={language.name} id="language-display-name" maxLength={40} name="languageName" required />
      </label>

      <section className="grid gap-4">
        <h2 className="font-serif text-2xl">Kategoriler</h2>
        {workspace.categories.length === 0 ? <p className="text-sm text-muted">Henüz kategori yok.</p> : null}
        {workspace.categories.map((category) => {
          const id = `category-${category.id}`;
          return (
            <div className="grid gap-2 rounded-3xl border border-line bg-card p-4" key={category.id}>
              <div className="flex items-start justify-between gap-3">
                <label className="text-sm font-medium" htmlFor={id}>
                  Ad
                </label>
                {canTranslate ? (
                  <TranslateButton sourceLocale={defaultLocale} targetId={id} targetLocale={language.code} text={category.sourceName} />
                ) : null}
              </div>
              {canTranslate ? <p className="text-xs text-muted">Türkçe: {category.sourceName || "—"}</p> : null}
              <input className="field" defaultValue={category.name} id={id} maxLength={80} name={`category:${category.id}`} />
            </div>
          );
        })}
      </section>

      <section className="grid gap-4">
        <h2 className="font-serif text-2xl">Ürünler</h2>
        {workspace.products.length === 0 ? <p className="text-sm text-muted">Henüz ürün yok.</p> : null}
        {workspace.products.map((product) => {
          const nameId = `product-${product.id}-name`;
          const descriptionId = `product-${product.id}-description`;
          const ingredientsId = `product-${product.id}-ingredients`;
          return (
            <fieldset className="grid gap-3 rounded-3xl border border-line bg-card p-4" key={product.id}>
              <legend className="px-1 text-sm font-medium">{product.sourceName || "Ürün"}</legend>
              <CopyField
                canTranslate={canTranslate}
                defaultValue={product.name}
                id={nameId}
                label="Ad"
                maxLength={120}
                name={`product:${product.id}:name`}
                source={product.sourceName}
                sourceLocale={defaultLocale}
                targetLocale={language.code}
              />
              <CopyField
                canTranslate={canTranslate}
                defaultValue={product.description}
                id={descriptionId}
                label="Açıklama"
                maxLength={2000}
                multiline
                name={`product:${product.id}:description`}
                source={product.sourceDescription}
                sourceLocale={defaultLocale}
                targetLocale={language.code}
              />
              <CopyField
                canTranslate={canTranslate}
                defaultValue={product.ingredients}
                id={ingredientsId}
                label="İçindekiler"
                maxLength={2000}
                multiline
                name={`product:${product.id}:ingredients`}
                source={product.sourceIngredients}
                sourceLocale={defaultLocale}
                targetLocale={language.code}
              />
            </fieldset>
          );
        })}
      </section>

      <section className="grid gap-4">
        <h2 className="font-serif text-2xl">Özellikler</h2>
        {workspace.features.length === 0 ? <p className="text-sm text-muted">Henüz özellik yok.</p> : null}
        {workspace.features.map((feature) => {
          const id = `feature-${feature.id}`;
          return (
            <div className="grid gap-2 rounded-3xl border border-line bg-card p-4" key={feature.id}>
              <div className="flex items-start justify-between gap-3">
                <label className="text-sm font-medium" htmlFor={id}>
                  {feature.categoryName ? `${feature.categoryName} · ` : ""}
                  {feature.sourceName || "Özellik"}
                </label>
                {canTranslate ? (
                  <TranslateButton sourceLocale={defaultLocale} targetId={id} targetLocale={language.code} text={feature.sourceName} />
                ) : null}
              </div>
              <input className="field" defaultValue={feature.name} id={id} maxLength={80} name={`feature:${feature.id}`} />
            </div>
          );
        })}
      </section>

      <section className="grid gap-4">
        <h2 className="font-serif text-2xl">Seçenekler</h2>
        {workspace.options.length === 0 ? <p className="text-sm text-muted">Henüz seçenek yok.</p> : null}
        {workspace.options.map((option) => {
          const id = `option-${option.id}`;
          return (
            <div className="grid gap-2 rounded-3xl border border-line bg-card p-4" key={option.id}>
              <div className="flex items-start justify-between gap-3">
                <label className="text-sm font-medium" htmlFor={id}>
                  {option.productName || "Ürün"} · {option.featureName || "Özellik"}
                </label>
                {canTranslate ? (
                  <TranslateButton sourceLocale={defaultLocale} targetId={id} targetLocale={language.code} text={option.sourceName} />
                ) : null}
              </div>
              {canTranslate ? <p className="text-xs text-muted">Türkçe: {option.sourceName || "—"}</p> : null}
              <input className="field" defaultValue={option.name} id={id} maxLength={80} name={`option:${option.id}`} />
            </div>
          );
        })}
      </section>

      <section className="grid gap-4">
        <h2 className="font-serif text-2xl">Alerjenler</h2>
        {workspace.allergens.map((allergen) => {
          const id = `allergen-${allergen.code}`;
          return (
            <div className="grid gap-2 rounded-3xl border border-line bg-card p-4" key={allergen.code}>
              <div className="flex items-start justify-between gap-3">
                <label className="text-sm font-medium" htmlFor={id}>
                  {allergen.sourceName}
                </label>
                {canTranslate ? (
                  <TranslateButton sourceLocale={defaultLocale} targetId={id} targetLocale={language.code} text={allergen.sourceName} />
                ) : null}
              </div>
              <input className="field" defaultValue={allergen.name} id={id} maxLength={80} name={`allergen:${allergen.code}`} />
            </div>
          );
        })}
      </section>

      <div className="sticky bottom-4">
        <SubmitButton>Çevirileri kaydet</SubmitButton>
      </div>
    </form>
  );
}

function CopyField({
  id,
  name,
  label,
  source,
  defaultValue,
  maxLength,
  multiline,
  canTranslate,
  sourceLocale,
  targetLocale,
}: {
  id: string;
  name: string;
  label: string;
  source: string;
  defaultValue: string;
  maxLength: number;
  multiline?: boolean;
  canTranslate: boolean;
  sourceLocale: string;
  targetLocale: string;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-start justify-between gap-3">
        <label className="text-sm font-medium" htmlFor={id}>
          {label}
        </label>
        {canTranslate ? (
          <TranslateButton sourceLocale={sourceLocale} targetId={id} targetLocale={targetLocale} text={source} />
        ) : null}
      </div>
      {canTranslate ? <p className="text-xs text-muted">Türkçe: {source || "—"}</p> : null}
      {multiline ? (
        <textarea className="field min-h-24" defaultValue={defaultValue} id={id} maxLength={maxLength} name={name} />
      ) : (
        <input className="field" defaultValue={defaultValue} id={id} maxLength={maxLength} name={name} />
      )}
    </div>
  );
}
