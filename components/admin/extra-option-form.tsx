"use client";

import { useActionState, useState } from "react";
import { Notice } from "@/components/notice";
import { SubmitButton } from "@/components/submit-button";
import { idleActionState, type ActionState, type ExtraOptionEditor, type ExtraOptionKind } from "@/lib/types";

type ChoiceRow = {
  key: string;
  id: string;
  name: string;
  price: string;
  isDefault: boolean;
};

export function ExtraOptionForm({
  action,
  categories,
  products = [],
  extra,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  categories: { id: string; name: string }[];
  products?: { id: string; name: string; categoryId: string; categoryName: string }[];
  extra?: ExtraOptionEditor;
}) {
  const [state, formAction] = useActionState(action, idleActionState);
  const [kind, setKind] = useState<ExtraOptionKind>(extra?.kind ?? "fixed");
  const [selection, setSelection] = useState<"single" | "multiple">(extra?.selection ?? "single");
  const [boundProducts, setBoundProducts] = useState<string[]>(() => extra?.productIds ?? []);
  const [choices, setChoices] = useState<ChoiceRow[]>(
    () =>
      extra?.choices.map((choice) => ({
        key: choice.id,
        id: choice.id,
        name: choice.name,
        price: String(choice.priceDelta),
        isDefault: choice.isDefault,
      })) ?? [],
  );

  const choicesJson = JSON.stringify(
    choices.map((row) => ({
      id: row.id,
      name: row.name,
      priceDelta: row.price,
      isDefault: row.isDefault,
    })),
  );

  function updateChoice(key: string, patch: Partial<ChoiceRow>) {
    setChoices((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function toggleDefault(key: string) {
    setChoices((current) =>
      current.map((row) => {
        if (selection === "single") {
          return { ...row, isDefault: row.key === key ? !row.isDefault : false };
        }
        return row.key === key ? { ...row, isDefault: !row.isDefault } : row;
      }),
    );
  }

  return (
    <form action={formAction} className="grid max-w-2xl gap-5">
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
      {extra ? <input type="hidden" name="id" value={extra.id} /> : null}
      <input name="choicesJson" type="hidden" value={choicesJson} />
      <input name="productIdsJson" type="hidden" value={JSON.stringify(boundProducts)} />
      <input name="kind" type="hidden" value={kind} />
      <input name="selection" type="hidden" value={selection} />

      <label className="grid gap-1.5 text-sm font-medium" htmlFor="extra-name">
        Ad
        <input className="field" defaultValue={extra?.name ?? ""} id="extra-name" maxLength={80} name="name" required />
      </label>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium">Tür</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              { value: "fixed", label: "Sabit", hint: "Tek satır, sadece fiyat" },
              { value: "menu", label: "Menüden", hint: "Kategori ürünlerinden seçim" },
              { value: "list", label: "Liste", hint: "Kendi seçeneklerin (ekmek vb.)" },
            ] as const
          ).map((item) => (
            <label
              className={`grid cursor-pointer gap-1 rounded-2xl border px-3 py-3 text-sm ${
                kind === item.value ? "border-accent bg-paper" : "border-line bg-card"
              }`}
              key={item.value}
            >
              <span className="flex items-center gap-2 font-medium">
                <input
                  checked={kind === item.value}
                  name="kindRadio"
                  onChange={() => setKind(item.value)}
                  type="radio"
                  value={item.value}
                />
                {item.label}
              </span>
              <span className="text-xs text-muted">{item.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium" htmlFor="extra-selection">
          Seçim
          <select
            className="field"
            id="extra-selection"
            onChange={(event) => setSelection(event.target.value === "multiple" ? "multiple" : "single")}
            value={selection}
          >
            <option value="single">Tek seçim (radio)</option>
            <option value="multiple">Çoklu seçim (checkbox)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 pt-6 text-sm">
          <input defaultChecked={extra?.required ?? false} name="isRequired" type="checkbox" value="true" />
          Zorunlu
        </label>
      </div>

      {kind !== "list" ? (
        <label className="grid gap-1.5 text-sm font-medium" htmlFor="extra-price">
          {kind === "menu" ? "Paket fiyatı (TRY)" : "Fiyat (TRY)"}
          <input
            className="field"
            defaultValue={extra ? String(extra.price) : "0"}
            id="extra-price"
            inputMode="decimal"
            name="price"
            required
          />
        </label>
      ) : null}

      {kind === "menu" ? (
        <label className="grid gap-1.5 text-sm font-medium" htmlFor="extra-menu-category">
          Menü kategorisi
          <select
            className="field"
            defaultValue={extra?.menuCategoryId ?? ""}
            id="extra-menu-category"
            name="menuCategoryId"
            required
          >
            <option value="">Seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {kind === "list" ? (
        <section className="grid gap-3 rounded-3xl border border-line bg-card p-4">
          <div>
            <h2 className="font-medium">Seçenekler</h2>
            <p className="mt-1 text-sm text-muted">Örn. dürüm, gobit, taş fırın. Ek ücret 0 olabilir.</p>
          </div>
          {choices.map((row) => (
            <div className="grid gap-2 rounded-2xl border border-line p-3" key={row.key}>
              <label className="grid gap-1.5 text-sm font-medium">
                Ad
                <input
                  className="field"
                  maxLength={80}
                  onChange={(event) => updateChoice(row.key, { name: event.target.value })}
                  value={row.name}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Ek ücret (TRY)
                <input
                  className="field"
                  inputMode="decimal"
                  onChange={(event) => updateChoice(row.key, { price: event.target.value })}
                  value={row.price}
                />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input checked={row.isDefault} onChange={() => toggleDefault(row.key)} type="checkbox" />
                  Varsayılan
                </label>
                <button
                  className="btn btn-danger"
                  onClick={() => setChoices((current) => current.filter((item) => item.key !== row.key))}
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
                setChoices((current) => [
                  ...current,
                  { key: crypto.randomUUID(), id: "", name: "", price: "0", isDefault: false },
                ])
              }
              type="button"
            >
              Seçenek ekle
            </button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-3 rounded-3xl border border-line bg-card p-4">
        <div>
          <h2 className="font-medium">Ürünlere bağla</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Tek ürüne veya birden fazla ürüne işaretleyin. Farklı kategorilerdeki ürünler aynı ek seçeneği
            paylaşabilir. Kategori bağını da kategori sayfasından kullanabilirsiniz.
          </p>
        </div>
        {products.length === 0 ? (
          <p className="text-sm text-muted">Henüz ürün yok.</p>
        ) : (
          <div className="grid max-h-80 gap-3 overflow-y-auto pr-1">
            {[...new Set(products.map((item) => item.categoryName))].map((categoryName) => (
              <div key={categoryName}>
                <p className="mb-1 text-xs font-medium tracking-wide text-muted uppercase">{categoryName}</p>
                <ul className="grid gap-1">
                  {products
                    .filter((item) => item.categoryName === categoryName)
                    .map((item) => (
                      <li key={item.id}>
                        <label className="flex items-center gap-2 rounded-2xl border border-line px-3 py-2 text-sm">
                          <input
                            checked={boundProducts.includes(item.id)}
                            onChange={() =>
                              setBoundProducts((current) =>
                                current.includes(item.id)
                                  ? current.filter((id) => id !== item.id)
                                  : [...current, item.id],
                              )
                            }
                            type="checkbox"
                          />
                          {item.name}
                        </label>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-sm text-muted">Ad varsayılan dil olan Türkçe için kaydedilir.</p>
      <div>
        <SubmitButton>{extra ? "Güncelle" : "Ekle"}</SubmitButton>
      </div>
    </form>
  );
}
