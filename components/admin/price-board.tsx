"use client";

import { useActionState, useMemo, useState } from "react";
import { savePrices } from "@/app/admin/actions/prices";
import { Notice } from "@/components/notice";
import { SubmitButton } from "@/components/submit-button";
import { formatPrice } from "@/lib/format";
import { nextPrice, parseLira, type PriceChange } from "@/lib/prices";
import { idleActionState } from "@/lib/types";
import type { PriceGroup } from "@/lib/admin-data";

type Scope = "all" | "category" | "selected";

export function PriceBoard({ groups }: { groups: PriceGroup[] }) {
  const [state, formAction] = useActionState(savePrices, idleActionState);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((group) => [group.id, true])),
  );
  const [openProducts, setOpenProducts] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [blocked, setBlocked] = useState<Record<string, number>>({});
  const [scope, setScope] = useState<Scope>("all");
  const [categoryId, setCategoryId] = useState(groups[0]?.id ?? "");
  const [kind, setKind] = useState<PriceChange["kind"]>("percent");
  const [direction, setDirection] = useState<PriceChange["direction"]>("up");
  const [amount, setAmount] = useState("15");
  const [hint, setHint] = useState("");

  const rows = useMemo(
    () =>
      groups.flatMap((group) =>
        group.products.flatMap((product) => [
          {
            id: product.id,
            kind: "product" as const,
            categoryId: group.id,
            categoryName: group.name,
            productName: product.name,
            label: product.name,
            price: product.price,
            isPublished: product.isPublished,
          },
          ...product.options.map((option) => ({
            id: option.id,
            kind: "option" as const,
            categoryId: group.id,
            categoryName: group.name,
            productName: product.name,
            label: `${option.featureName} · ${option.name}`,
            price: option.price,
            isPublished: product.isPublished,
          })),
        ]),
      ),
    [groups],
  );

  const changes = rows.flatMap((row) => {
    const next = parseLira(drafts[row.id] ?? "");
    if (next === null || next < 0 || next === Math.round(row.price)) return [];
    return [{ ...row, next }];
  });

  const blockedRows = rows.flatMap((row) => {
    const typed = parseLira(drafts[row.id] ?? "");
    if (typed !== null && typed < 0) return [{ ...row, next: typed }];
    if (blocked[row.id] === undefined) return [];
    return [{ ...row, next: blocked[row.id] }];
  });

  function targets() {
    if (scope === "category") return rows.filter((row) => row.categoryId === categoryId);
    if (scope === "selected") return rows.filter((row) => selected[row.id]);
    return rows;
  }

  function preview() {
    const value = Number(amount.trim().replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) {
      setHint(kind === "percent" ? "Sıfırdan büyük bir yüzde girin." : "Sıfırdan büyük bir tutar girin.");
      return;
    }
    const chosen = targets();
    if (chosen.length === 0) {
      setHint(scope === "selected" ? "Önce tablodan satır seçin." : "Bu kapsamda fiyat yok.");
      return;
    }

    const nextDrafts = { ...drafts };
    const nextBlocked = { ...blocked };
    for (const row of chosen) {
      const result = nextPrice(row.price, { kind, direction, value });
      if (result.ok) {
        if (result.price === Math.round(row.price)) delete nextDrafts[row.id];
        else nextDrafts[row.id] = String(result.price);
        delete nextBlocked[row.id];
      } else {
        delete nextDrafts[row.id];
        nextBlocked[row.id] = result.price;
      }
    }
    setDrafts(nextDrafts);
    setBlocked(nextBlocked);
    setHint("Önizleme kaydetmez. Aynı düğmeye tekrar basarsan hesap kayıtlı fiyattan yeniden yapılır.");
  }

  function setDraft(id: string, value: string) {
    setDrafts((current) => ({ ...current, [id]: value }));
    setBlocked((current) => {
      if (current[id] === undefined) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  const allCollapsed = groups.every((group) => collapsed[group.id]);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 rounded-3xl border border-line bg-card p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="grid gap-1.5 text-sm font-medium">
            Kapsam
            <select className="field" onChange={(event) => setScope(event.target.value as Scope)} value={scope}>
              <option value="all">Tüm menü</option>
              <option value="category">Bir kategori</option>
              <option value="selected">Seçili ürünler</option>
            </select>
          </label>
          {scope === "category" ? (
            <label className="grid gap-1.5 text-sm font-medium">
              Kategori
              <select className="field" onChange={(event) => setCategoryId(event.target.value)} value={categoryId}>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="grid gap-1.5 text-sm font-medium">
            İşlem
            <select className="field" onChange={(event) => setKind(event.target.value as PriceChange["kind"])} value={kind}>
              <option value="percent">Yüzde</option>
              <option value="fixed">Sabit tutar</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Yön
            <select
              className="field"
              onChange={(event) => setDirection(event.target.value as PriceChange["direction"])}
              value={direction}
            >
              <option value="up">Artır</option>
              <option value="down">Azalt</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            {kind === "percent" ? "Yüzde" : "Tutar (TL)"}
            <input
              className="field"
              inputMode="decimal"
              onChange={(event) => setAmount(event.target.value)}
              value={amount}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn btn-secondary" onClick={preview} type="button">
            Önizle
          </button>
          <p className="text-sm text-muted">
            Sonuç en yakın tam TL’ye yuvarlanır. Taban fiyat ve ek ücret birlikte hesaplanır. Boş yeni tutar, o satırı değiştirmez.
          </p>
        </div>
        {hint ? <Notice tone="info">{hint}</Notice> : null}
      </section>

      <div className="flex justify-end">
        <button
          className="text-sm text-muted underline-offset-4 hover:underline"
          onClick={() => setCollapsed(allCollapsed ? {} : Object.fromEntries(groups.map((group) => [group.id, true])))}
          type="button"
        >
          {allCollapsed ? "Tümünü aç" : "Tümünü kapat"}
        </button>
      </div>

      {groups.map((group) => {
        const open = !collapsed[group.id];
        const ids = group.products.flatMap((product) => [product.id, ...product.options.map((option) => option.id)]);
        const allSelected = ids.length > 0 && ids.every((id) => selected[id]);
        return (
          <section className="overflow-hidden rounded-3xl border border-line bg-card" key={group.id}>
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <input
                aria-label={`${group.name} ürünlerini seç`}
                checked={allSelected}
                className="size-4 accent-accent"
                onChange={() => {
                  setSelected((current) => {
                    const next = { ...current };
                    for (const id of ids) next[id] = !allSelected;
                    return next;
                  });
                }}
                type="checkbox"
              />
              <button
                aria-expanded={open}
                className="flex flex-1 items-center justify-between text-left"
                onClick={() => setCollapsed((current) => ({ ...current, [group.id]: open }))}
                type="button"
              >
                <span className="font-medium">{group.name}</span>
                <span className="text-sm text-muted">
                  {group.products.length} ürün {open ? "▴" : "▾"}
                </span>
              </button>
            </div>
            {open ? (
              <div className="divide-y divide-line">
                <div className="hidden grid-cols-[2.5rem_1fr_8rem_8rem] gap-3 px-4 py-2 text-xs tracking-wide text-muted uppercase md:grid">
                  <span />
                  <span>Ürün</span>
                  <span>Güncel</span>
                  <span>Yeni</span>
                </div>
                {group.products.map((product) => {
                  const hasOptions = product.options.length > 0;
                  const productOpen = Boolean(openProducts[product.id]);
                  return (
                  <div key={product.id}>
                    <div className="grid grid-cols-[2.5rem_1fr] items-center gap-3 px-4 py-3 md:grid-cols-[2.5rem_1fr_8rem_8rem]">
                      <input
                        aria-label={`${product.name} seç`}
                        checked={Boolean(selected[product.id])}
                        className="size-4 accent-accent"
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setSelected((current) => {
                            const next = { ...current, [product.id]: checked };
                            for (const option of product.options) next[option.id] = checked;
                            return next;
                          });
                        }}
                        type="checkbox"
                      />
                      <div>
                        {hasOptions ? (
                          <button
                            aria-expanded={productOpen}
                            className="flex w-full items-center justify-between gap-3 text-left"
                            onClick={() =>
                              setOpenProducts((current) => ({ ...current, [product.id]: !current[product.id] }))
                            }
                            type="button"
                          >
                            <span>
                              <span className="font-medium">{product.name}</span>
                              {product.isPublished ? null : <span className="mt-0.5 block text-xs text-muted">Gizli</span>}
                            </span>
                            <span className="text-sm text-muted">{productOpen ? "▴" : "▾"}</span>
                          </button>
                        ) : (
                          <>
                            <p className="font-medium">{product.name}</p>
                            {product.isPublished ? null : <p className="text-xs text-muted">Gizli</p>}
                          </>
                        )}
                        <p className="mt-1 text-sm text-muted md:hidden">{formatPrice(product.price)}</p>
                      </div>
                      <p className="hidden text-sm md:block">{formatPrice(product.price)}</p>
                      <label className="col-span-2 md:col-span-1">
                        <span className="sr-only">{product.name} yeni fiyat</span>
                        <input
                          className="field py-2"
                          inputMode="decimal"
                          onBlur={(event) => {
                            const next = parseLira(event.target.value);
                            if (next !== null && next >= 0) setDraft(product.id, String(next));
                          }}
                          onChange={(event) => setDraft(product.id, event.target.value)}
                          placeholder={String(Math.round(product.price))}
                          value={drafts[product.id] ?? ""}
                        />
                      </label>
                    </div>
                    {productOpen
                      ? product.options.map((option) => (
                      <div
                        className="grid grid-cols-[2.5rem_1fr] items-center gap-3 bg-paper/60 px-4 py-2 md:grid-cols-[2.5rem_1fr_8rem_8rem]"
                        key={option.id}
                      >
                        <input
                          aria-label={`${product.name} ${option.featureName} ${option.name} seç`}
                          checked={Boolean(selected[option.id])}
                          className="size-4 accent-accent"
                          onChange={(event) => setSelected((current) => ({ ...current, [option.id]: event.target.checked }))}
                          type="checkbox"
                        />
                        <div>
                          <p className="text-sm text-muted">
                            {option.featureName} · {option.name}
                          </p>
                          <p className="mt-1 text-sm text-muted md:hidden">{formatPrice(option.price)}</p>
                        </div>
                        <p className="hidden text-sm md:block">{formatPrice(option.price)}</p>
                        <label className="col-span-2 md:col-span-1">
                          <span className="sr-only">
                            {product.name} {option.name} yeni ek ücret
                          </span>
                          <input
                            className="field py-2"
                            inputMode="decimal"
                            onBlur={(event) => {
                              const next = parseLira(event.target.value);
                              if (next !== null && next >= 0) setDraft(option.id, String(next));
                            }}
                            onChange={(event) => setDraft(option.id, event.target.value)}
                            placeholder={String(Math.round(option.price))}
                            value={drafts[option.id] ?? ""}
                          />
                        </label>
                      </div>
                    ))
                      : null}
                  </div>
                  );
                })}
              </div>
            ) : null}
          </section>
        );
      })}

      <section className="grid gap-4 rounded-3xl border border-line bg-card p-4 md:p-5">
        <h2 className="font-serif text-2xl">Kaydetmeden önce</h2>
        {changes.length === 0 && blockedRows.length === 0 ? (
          <p className="text-sm text-muted">Henüz değişen fiyat yok. Önizle veya satıra yeni tutar yaz.</p>
        ) : null}
        {changes.length > 0 ? (
          <ul className="grid gap-2 text-sm">
            {changes.map((row) => (
              <li className="flex flex-wrap justify-between gap-2 border-b border-line pb-2" key={row.id}>
                <span>
                  {row.categoryName} · {row.productName}
                  {row.kind === "option" ? ` · ${row.label}` : ""}
                </span>
                <span>
                  {formatPrice(row.price)} → {formatPrice(row.next)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        {blockedRows.length > 0 ? (
          <Notice tone="error">
            {blockedRows.map((row) => `${row.kind === "option" ? row.label : row.productName} (${formatPrice(row.next)})`).join(", ")} 0 TL’nin altına
            indiği için kaydedilmeyecek.
          </Notice>
        ) : null}
        {changes.length > 0 ? (
          <p className="text-sm leading-6 text-muted">
            {changes.length} fiyat değişecek. Kaydettikten sonra aynı yüzdeyi veya tutarı yeniden uygularsan hesap yeni
            fiyattan yapılır ve tutar bir kez daha değişir.
          </p>
        ) : null}
        <form action={formAction} className="grid gap-3">
          {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
          {changes.map((row) =>
            row.kind === "product" ? (
              <span key={row.id}>
                <input name="id" type="hidden" value={row.id} />
                <input name="price" type="hidden" value={row.next} />
              </span>
            ) : (
              <span key={row.id}>
                <input name="optionId" type="hidden" value={row.id} />
                <input name="optionPrice" type="hidden" value={row.next} />
              </span>
            ),
          )}
          <div>
            {changes.length > 0 ? (
              <SubmitButton>{`${changes.length} fiyatı kaydet`}</SubmitButton>
            ) : (
              <button className="btn btn-primary" disabled type="button">
                Kaydet
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
