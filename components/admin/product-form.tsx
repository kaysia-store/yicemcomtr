"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { ImageField } from "@/components/admin/image-field";
import { Notice } from "@/components/notice";
import { SubmitButton } from "@/components/submit-button";
import { idleActionState, type ActionState, type CategoryFeature, type ProductChoice } from "@/lib/types";

type OptionRow = {
  key: string;
  id: string;
  name: string;
  price: string;
  isDefault: boolean;
};

type ProductFormValues = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  ingredients: string;
  price: string;
  isPublished: boolean;
  imageUrl: string | null;
  allergenCodes: string[];
  options: ProductChoice[];
};

export function ProductForm({
  action,
  categories,
  allergens,
  product,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  categories: { id: string; name: string; features: CategoryFeature[] }[];
  allergens: { code: string; name: string }[];
  product?: ProductFormValues;
}) {
  const [state, formAction] = useActionState(action, idleActionState);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [rows, setRows] = useState<Record<string, OptionRow[]>>(() => {
    const initial: Record<string, OptionRow[]> = {};
    for (const option of product?.options ?? []) {
      const list = initial[option.featureId] ?? [];
      list.push({
        key: option.id,
        id: option.id,
        name: option.name,
        price: String(option.priceDelta),
        isDefault: option.isDefault,
      });
      initial[option.featureId] = list;
    }
    return initial;
  });

  const features = useMemo(
    () => categories.find((category) => category.id === categoryId)?.features ?? [],
    [categories, categoryId],
  );
  const categoryChanged = Boolean(product && product.categoryId !== categoryId);
  const optionsJson = JSON.stringify(
    features.flatMap((feature) =>
      (rows[feature.id] ?? []).map((row) => ({
        id: row.id,
        featureId: feature.id,
        name: row.name,
        priceDelta: row.price,
        isDefault: row.isDefault,
      })),
    ),
  );

  function updateRow(featureId: string, key: string, patch: Partial<OptionRow>) {
    setRows((current) => ({
      ...current,
      [featureId]: (current[featureId] ?? []).map((row) => (row.key === key ? { ...row, ...patch } : row)),
    }));
  }

  function toggleDefault(feature: CategoryFeature, key: string) {
    setRows((current) => ({
      ...current,
      [feature.id]: (current[feature.id] ?? []).map((row) => {
        if (feature.selection === "single") {
          return { ...row, isDefault: row.key === key ? !row.isDefault : false };
        }
        return row.key === key ? { ...row, isDefault: !row.isDefault } : row;
      }),
    }));
  }

  return (
    <form action={formAction} className="grid max-w-2xl gap-5">
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input name="optionsJson" type="hidden" value={optionsJson} />
      <ImageField currentUrl={product?.imageUrl ?? null} />
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="product-category">
        Kategori
        <select
          className="field"
          id="product-category"
          name="categoryId"
          onChange={(event) => setCategoryId(event.target.value)}
          required
          value={categoryId}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      {categoryChanged ? (
        <Notice tone="info">Kategori değişince önceki özelliklerin seçenekleri kayda girmez.</Notice>
      ) : null}
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="product-name">
        Ad
        <input className="field" defaultValue={product?.name ?? ""} id="product-name" maxLength={120} name="name" required />
      </label>
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="product-price">
        Fiyat (TRY)
        <input
          className="field"
          defaultValue={product?.price ?? ""}
          id="product-price"
          inputMode="decimal"
          name="price"
          required
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="product-description">
        Açıklama
        <textarea className="field min-h-28" defaultValue={product?.description ?? ""} id="product-description" maxLength={2000} name="description" />
      </label>
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="product-ingredients">
        İçindekiler
        <textarea className="field min-h-28" defaultValue={product?.ingredients ?? ""} id="product-ingredients" maxLength={2000} name="ingredients" />
      </label>
      <section className="grid gap-4">
        <div>
          <h2 className="font-medium">Seçenekler</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Ek ücret taban fiyata eklenir. 0 TL, seçeneğin fiyata dahil olduğu anlamına gelir. Sorular kategori
            sayfasından gelir.
          </p>
        </div>
        {features.length === 0 ? (
          <p className="text-sm text-muted">Bu kategoride ürün özelliği yok.</p>
        ) : (
          features.map((feature) => (
            <fieldset className="grid gap-3 rounded-3xl border border-line bg-card p-4" key={feature.id}>
              <legend className="px-1 text-sm font-medium">
                {feature.name} · {feature.selection === "single" ? "Tek seçim" : "Çoklu seçim"}
                {feature.required ? " · Zorunlu" : ""}
              </legend>
              {(rows[feature.id] ?? []).map((row) => (
                <div className="grid gap-2 rounded-2xl border border-line p-3" key={row.key}>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Seçenek
                    <input
                      className="field"
                      maxLength={80}
                      onChange={(event) => updateRow(feature.id, row.key, { name: event.target.value })}
                      value={row.name}
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Ek ücret (TRY)
                    <input
                      className="field"
                      inputMode="decimal"
                      onChange={(event) => updateRow(feature.id, row.key, { price: event.target.value })}
                      value={row.price}
                    />
                  </label>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input checked={row.isDefault} onChange={() => toggleDefault(feature, row.key)} type="checkbox" />
                      Varsayılan
                    </label>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        setRows((current) => ({
                          ...current,
                          [feature.id]: (current[feature.id] ?? []).filter((item) => item.key !== row.key),
                        }))
                      }
                      type="button"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setRows((current) => ({
                      ...current,
                      [feature.id]: [
                        ...(current[feature.id] ?? []),
                        { key: crypto.randomUUID(), id: "", name: "", price: "0", isDefault: false },
                      ],
                    }))
                  }
                  type="button"
                >
                  Seçenek ekle
                </button>
              </div>
            </fieldset>
          ))
        )}
      </section>
      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium">Alerjenler</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {allergens.map((allergen) => (
            <label className="flex items-center gap-2 rounded-2xl border border-line bg-card px-3 py-2 text-sm" key={allergen.code}>
              <input
                defaultChecked={product?.allergenCodes.includes(allergen.code)}
                name="allergens"
                type="checkbox"
                value={allergen.code}
              />
              {allergen.name}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex items-center gap-2 text-sm">
        <input defaultChecked={product?.isPublished ?? true} name="isPublished" type="checkbox" value="true" />
        Yayında
      </label>
      <p className="text-sm text-muted">Metinler varsayılan dil olan Türkçe için kaydedilir.</p>
      <div>
        <SubmitButton>{product ? "Güncelle" : "Ekle"}</SubmitButton>
      </div>
    </form>
  );
}
