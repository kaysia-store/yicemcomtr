"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveProductImage } from "@/app/admin/actions/photos";
import { Notice } from "@/components/notice";

type PhotoProduct = {
  id: string;
  name: string;
  categoryName: string;
  imageUrl: string | null;
};

type PendingFile = {
  key: string;
  file: File;
  url: string;
};

const accepted = new Set(["image/jpeg", "image/png", "image/webp"]);

function fold(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

export function PhotoBoard({ products }: { products: PhotoProduct[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [assigned, setAssigned] = useState<Record<string, PendingFile>>({});
  const [loose, setLoose] = useState<PendingFile[]>([]);
  const [matching, setMatching] = useState<PendingFile | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [finder, setFinder] = useState("");
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [message, setMessage] = useState<{ tone: "error" | "ok"; text: string } | null>(null);

  const byName = useMemo(() => {
    const groups = new Map<string, PhotoProduct[]>();
    for (const product of products) {
      const key = fold(product.name);
      const list = groups.get(key) ?? [];
      list.push(product);
      groups.set(key, list);
    }
    return groups;
  }, [products]);

  const groups = useMemo(() => {
    const map = new Map<string, PhotoProduct[]>();
    for (const product of products) {
      const list = map.get(product.categoryName) ?? [];
      list.push(product);
      map.set(product.categoryName, list);
    }
    return [...map.entries()];
  }, [products]);

  const pendingCount = Object.keys(assigned).length;
  const finderNeedle = fold(finder.trim());
  const finderResults = useMemo(() => {
    if (!finderNeedle) return products;
    return products.filter((product) => fold(`${product.name} ${product.categoryName}`).includes(finderNeedle));
  }, [finderNeedle, products]);

  useEffect(() => {
    if (!matching) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMatching(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [matching]);

  function remember(file: File): PendingFile | null {
    if (!accepted.has(file.type)) return null;
    if (file.size > 5 * 1024 * 1024) return null;
    return { key: fileKey(file), file, url: URL.createObjectURL(file) };
  }

  function takeFiles(files: FileList | File[]) {
    const nextAssigned = { ...assigned };
    const nextLoose = [...loose];
    const used = new Set(Object.values(nextAssigned).map((item) => item.key));
    let rejected = 0;
    for (const file of files) {
      const pending = remember(file);
      if (!pending) {
        rejected += 1;
        continue;
      }
      if (used.has(pending.key)) continue;
      const stem = file.name.replace(/\.[^.]+$/, "");
      const matches = byName.get(fold(stem)) ?? [];
      const open = matches.find((product) => !nextAssigned[product.id]);
      if (matches.length === 1 && open) {
        const previous = nextAssigned[open.id];
        nextAssigned[open.id] = pending;
        if (previous && previous.key !== pending.key && !Object.values(nextAssigned).some((item) => item.key === previous.key)) {
          URL.revokeObjectURL(previous.url);
        }
      } else {
        nextLoose.push(pending);
      }
      used.add(pending.key);
    }
    setAssigned(nextAssigned);
    setLoose(nextLoose);
    setMessage(rejected > 0 ? { tone: "error", text: "Bazı dosyalar alınmadı. Yalnızca JPEG, PNG veya WebP, en fazla 5 MB." } : null);
  }

  function releaseIfUnused(next: Record<string, PendingFile>, pending: PendingFile) {
    if (Object.values(next).some((item) => item.key === pending.key)) return;
    URL.revokeObjectURL(pending.url);
  }

  function assignMany(ids: string[], pending: PendingFile) {
    setAssigned((current) => {
      const next = { ...current };
      for (const id of ids) {
        const previous = next[id];
        next[id] = pending;
        if (previous && previous.key !== pending.key) releaseIfUnused(next, previous);
      }
      return next;
    });
    setLoose((current) => current.filter((item) => item.key !== pending.key));
    setMatching(null);
    setPicked([]);
    setFinder("");
  }

  function clearProduct(productId: string) {
    setAssigned((current) => {
      const previous = current[productId];
      if (!previous) return current;
      const next = { ...current };
      delete next[productId];
      releaseIfUnused(next, previous);
      return next;
    });
  }

  async function saveAll() {
    const entries = Object.entries(assigned);
    if (entries.length === 0 || saving) return;
    setSaving(true);
    setProgress({ done: 0, total: entries.length });
    setMessage(null);
    const failed: string[] = [];
    const saved = new Set<string>();
    for (const [id, pending] of entries) {
      const body = new FormData();
      body.set("id", id);
      body.set("image", pending.file);
      const result = await saveProductImage(body);
      if (result.ok) saved.add(id);
      else {
        const product = products.find((item) => item.id === id);
        failed.push(`${product?.name ?? "Ürün"}: ${result.message}`);
      }
      setProgress({ done: saved.size + failed.length, total: entries.length });
    }
    setAssigned((current) => {
      const next = { ...current };
      for (const id of saved) {
        const pending = next[id];
        delete next[id];
        if (pending) releaseIfUnused(next, pending);
      }
      return next;
    });
    setSaving(false);
    if (failed.length === 0) {
      setMessage({ tone: "ok", text: "Görseller kaydedildi." });
      router.refresh();
    } else {
      setMessage({ tone: "error", text: failed.slice(0, 4).join(" ") });
    }
  }

  return (
    <div className="grid gap-6">
      <div
        className="grid gap-3 rounded-3xl border border-dashed border-line bg-card px-5 py-8 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (event.dataTransfer.files.length > 0) takeFiles(event.dataTransfer.files);
        }}
      >
        <p className="font-medium">Görselleri buraya bırakın</p>
        <p className="text-sm leading-6 text-muted">
          Dosya adı ürün adıyla aynıysa kartına yerleşir. Tutmayan görsele tıklayıp ürün arayın. JPEG, PNG veya WebP, en fazla 5 MB.
        </p>
        <div>
          <button className="btn btn-secondary" onClick={() => inputRef.current?.click()} type="button">
            Dosya seç
          </button>
          <input
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            multiple
            onChange={(event) => {
              if (event.target.files) takeFiles(event.target.files);
              event.target.value = "";
            }}
            ref={inputRef}
            type="file"
          />
        </div>
      </div>

      {loose.length > 0 ? (
        <div>
          <h2 className="mb-3 text-sm font-medium">Eşleşmeyen görseller</h2>
          <ul className="flex gap-3 overflow-x-auto pb-1">
            {loose.map((item) => (
              <li key={item.key}>
                <button
                  className="grid w-28 gap-2 rounded-2xl border border-line bg-card p-2 text-start"
                  onClick={() => {
                    setMatching(item);
                    setPicked([]);
                    setFinder("");
                  }}
                  type="button"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="h-20 w-full rounded-xl object-cover" src={item.url} />
                  <span className="truncate text-xs text-muted">{item.file.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}

      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper/95 px-3 py-3 backdrop-blur">
        <p className="text-sm text-muted">
          {saving ? `${progress.done} / ${progress.total} kaydediliyor` : pendingCount === 0 ? "Henüz görsel seçilmedi" : `${pendingCount} görsel kaydedilmeyi bekliyor`}
        </p>
        <button className="btn btn-primary" disabled={pendingCount === 0 || saving} onClick={saveAll} type="button">
          {saving ? "Kaydediliyor…" : "Tümünü kaydet"}
        </button>
      </div>

      {groups.map(([categoryName, items]) => (
        <section key={categoryName}>
          <h2 className="mb-3 font-serif text-2xl">{categoryName}</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((product) => {
              const pending = assigned[product.id];
              const preview = pending?.url ?? product.imageUrl;
              return (
                <li key={product.id}>
                  <div className="grid gap-2 rounded-3xl border border-line bg-card p-2">
                    <div className="relative h-28 overflow-hidden rounded-2xl bg-paper">
                      {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt="" className="h-full w-full object-cover" src={preview} />
                      ) : (
                        <span className="flex h-full items-center justify-center px-2 text-center text-xs text-muted">Görsel yok</span>
                      )}
                    </div>
                    <p className="min-h-10 px-1 text-sm leading-5">{product.name}</p>
                    {pending ? (
                      <button className="px-1 text-start text-xs text-danger" onClick={() => clearProduct(product.id)} type="button">
                        Seçimi kaldır
                      </button>
                    ) : preview ? (
                      <p className="px-1 text-xs text-muted">Kayıtlı</p>
                    ) : (
                      <p className="px-1 text-xs text-muted">Görsel yok</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {matching ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
          <button aria-label="Kapat" className="absolute inset-0 bg-black/40" onClick={() => setMatching(null)} type="button" />
          <div
            aria-labelledby="match-title"
            aria-modal="true"
            className="relative z-10 flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-3xl bg-card p-4 sm:rounded-3xl"
            role="dialog"
          >
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" src={matching.url} />
              <div className="min-w-0">
                <h2 className="truncate font-medium" id="match-title">
                  {matching.file.name}
                </h2>
                <p className="text-sm text-muted">Aynı görseli bir veya birden fazla ürüne bağlayın.</p>
              </div>
            </div>
            <input
              aria-label="Ürün ara"
              autoFocus
              className="field mt-4"
              onChange={(event) => setFinder(event.target.value)}
              placeholder="Ürün ara"
              value={finder}
            />
            <ul className="mt-3 min-h-0 flex-1 overflow-y-auto">
              {finderResults.length === 0 ? (
                <li className="px-1 py-6 text-center text-sm text-muted">Bu aramaya uyan ürün yok.</li>
              ) : (
                finderResults.map((product) => {
                  const checked = picked.includes(product.id);
                  return (
                    <li key={product.id}>
                      <label className="flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-2 hover:bg-paper">
                        <input
                          checked={checked}
                          className="size-4"
                          onChange={() => {
                            setPicked((current) =>
                              current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id],
                            );
                          }}
                          type="checkbox"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm">{product.name}</span>
                          <span className="block truncate text-xs text-muted">{product.categoryName}</span>
                        </span>
                      </label>
                    </li>
                  );
                })
              )}
            </ul>
            <button
              className="btn btn-primary mt-3"
              disabled={picked.length === 0}
              onClick={() => assignMany(picked, matching)}
              type="button"
            >
              {picked.length === 0 ? "Ürün seçin" : `${picked.length} ürüne eşle`}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
