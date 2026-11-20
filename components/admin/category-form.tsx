"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Notice } from "@/components/notice";
import { SubmitButton } from "@/components/submit-button";
import { idleActionState, type ActionState, type CategoryFeature } from "@/lib/types";

type FeatureRow = CategoryFeature & { key: string };

export function CategoryForm({
  action,
  category,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  category?: { id: string; name: string; isPublished: boolean; features: CategoryFeature[] };
}) {
  const [state, formAction] = useActionState(action, idleActionState);
  const [features, setFeatures] = useState<FeatureRow[]>(
    () => category?.features.map((feature) => ({ ...feature, key: feature.id })) ?? [],
  );

  function update(key: string, patch: Partial<FeatureRow>) {
    setFeatures((current) => current.map((feature) => (feature.key === key ? { ...feature, ...patch } : feature)));
  }

  function move(key: string, direction: -1 | 1) {
    setFeatures((current) => {
      const index = current.findIndex((feature) => feature.key === key);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = current.slice();
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }

  return (
    <form action={formAction} className="grid max-w-2xl gap-4">
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <input name="featuresJson" type="hidden" value={JSON.stringify(features.map(({ id, name, selection, required }) => ({ id, name, selection, required })))} />
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="category-name">
        Ad
        <input
          className="field"
          defaultValue={category?.name ?? ""}
          id="category-name"
          maxLength={80}
          name="name"
          required
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input defaultChecked={category?.isPublished ?? true} name="isPublished" type="checkbox" value="true" />
        Yayında
      </label>
      <section className="grid gap-3 rounded-3xl border border-line bg-card p-4">
        <div>
          <h2 className="font-medium">Ürün özellikleri</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Burada yalnızca soru tanımlanır. Ekmek tek seçim, içindekiler çoklu seçim olabilir. Seçenek adları ve ek
            ücretler her ürünün kendi sayfasında yazılır. Özelliği silmek, ürünlerdeki seçeneklerini de siler.
          </p>
        </div>
        {features.map((feature, index) => (
          <div className="grid gap-3 rounded-2xl border border-line p-3" key={feature.key}>
            <label className="grid gap-1.5 text-sm font-medium">
              Özellik adı
              <input
                className="field"
                maxLength={80}
                onChange={(event) => update(feature.key, { name: event.target.value })}
                value={feature.name}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium">
                Seçim
                <select
                  className="field"
                  onChange={(event) => update(feature.key, { selection: event.target.value === "multiple" ? "multiple" : "single" })}
                  value={feature.selection}
                >
                  <option value="single">Tek seçim</option>
                  <option value="multiple">Çoklu seçim</option>
                </select>
              </label>
              <label className="flex items-center gap-2 pt-6 text-sm">
                <input
                  checked={feature.required}
                  onChange={(event) => update(feature.key, { required: event.target.checked })}
                  type="checkbox"
                />
                Zorunlu
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-secondary" disabled={index === 0} onClick={() => move(feature.key, -1)} type="button">
                Yukarı
              </button>
              <button
                className="btn btn-secondary"
                disabled={index === features.length - 1}
                onClick={() => move(feature.key, 1)}
                type="button"
              >
                Aşağı
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setFeatures((current) => current.filter((item) => item.key !== feature.key))}
                type="button"
              >
                Özelliği sil
              </button>
            </div>
          </div>
        ))}
        <div>
          <button
            className="btn btn-secondary"
            onClick={() =>
              setFeatures((current) => [
                ...current,
                { key: crypto.randomUUID(), id: "", name: "", selection: "single", required: false },
              ])
            }
            type="button"
          >
            Özellik ekle
          </button>
        </div>
      </section>
      <p className="text-sm text-muted">Bu ad varsayılan dil olan Türkçe için kaydedilir.</p>
      <div>
        <SubmitButton>{category ? "Güncelle" : "Ekle"}</SubmitButton>
      </div>
    </form>
  );
}
