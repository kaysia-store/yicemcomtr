"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  loadAdminPriceData,
  saveModifierPrice,
  saveProductPrice,
  type AdminCategory,
  type AdminProduct,
} from "@/lib/admin/price-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type SaveState = "idle" | "saving" | "saved" | "error";

function parsePrice(value: string): number | null {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed * 100) / 100;
}

export default function PriceAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [productPrices, setProductPrices] = useState<Record<string, string>>({});
  const [modifierPrices, setModifierPrices] = useState<Record<string, string>>({});
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});

  const loadData = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await loadAdminPriceData(supabase);
      setCategories(data.categories);
      setProducts(data.products);
      setProductPrices(Object.fromEntries(data.products.map((product) => [product.id, String(product.price)])));

      const modifierMap: Record<string, string> = {};
      for (const product of data.products) {
        for (const modifier of product.modifiers) {
          modifierMap[`${modifier.productId}::${modifier.modifierId}`] = String(modifier.price);
        }
      }
      setModifierPrices(modifierMap);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((product) => product.categoryId === activeCategory);
  }, [products, activeCategory]);

  const setSaveState = (key: string, state: SaveState) => {
    setSaveStates((current) => ({ ...current, [key]: state }));
  };

  const handleProductSave = async (productId: string) => {
    const parsed = parsePrice(productPrices[productId] ?? "");
    if (parsed === null) {
      setSaveState(`product:${productId}`, "error");
      return;
    }

    setSaveState(`product:${productId}`, "saving");

    try {
      const supabase = getSupabaseBrowserClient();
      await saveProductPrice(supabase, productId, parsed);
      setProducts((current) =>
        current.map((product) => (product.id === productId ? { ...product, price: parsed } : product)),
      );
      setSaveState(`product:${productId}`, "saved");
      window.setTimeout(() => setSaveState(`product:${productId}`, "idle"), 1500);
    } catch {
      setSaveState(`product:${productId}`, "error");
    }
  };

  const handleModifierSave = async (productId: string, modifierId: string) => {
    const key = `${productId}::${modifierId}`;
    const parsed = parsePrice(modifierPrices[key] ?? "");
    if (parsed === null) {
      setSaveState(`modifier:${key}`, "error");
      return;
    }

    setSaveState(`modifier:${key}`, "saving");

    try {
      const supabase = getSupabaseBrowserClient();
      await saveModifierPrice(supabase, productId, modifierId, parsed);
      setProducts((current) =>
        current.map((product) =>
          product.id !== productId
            ? product
            : {
                ...product,
                modifiers: product.modifiers.map((modifier) =>
                  modifier.modifierId === modifierId ? { ...modifier, price: parsed } : modifier,
                ),
              },
        ),
      );
      setSaveState(`modifier:${key}`, "saved");
      window.setTimeout(() => setSaveState(`modifier:${key}`, "idle"), 1500);
    } catch {
      setSaveState(`modifier:${key}`, "error");
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (loading) {
    return (
      <main className="admin-page">
        <p className="admin-muted">Fiyatlar yükleniyor…</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Fiyat Yönetimi</h1>
          <p className="admin-muted">{products.length} ürün · Supabase</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/" className="admin-link">
            Menüye Dön
          </Link>
          <button type="button" className="admin-button admin-button-secondary" onClick={() => void loadData()}>
            Yenile
          </button>
          <button type="button" className="admin-button admin-button-secondary" onClick={() => void handleLogout()}>
            Çıkış
          </button>
        </div>
      </header>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-filters">
        <button
          type="button"
          className={`admin-filter-btn ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          Tümü
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`admin-filter-btn ${activeCategory === category.id ? "active" : ""}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ürün</th>
              <th>Kategori</th>
              <th>Fiyat (₺)</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <Fragment key={product.id}>
                <tr>
                  <td className="admin-mono">{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.categoryName}</td>
                  <td>
                    <input
                      className="admin-input admin-input-price"
                      type="text"
                      inputMode="decimal"
                      value={productPrices[product.id] ?? ""}
                      onChange={(event) =>
                        setProductPrices((current) => ({ ...current, [product.id]: event.target.value }))
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-button admin-button-small"
                      onClick={() => void handleProductSave(product.id)}
                    >
                      {saveStates[`product:${product.id}`] === "saving"
                        ? "…"
                        : saveStates[`product:${product.id}`] === "saved"
                          ? "✓"
                          : saveStates[`product:${product.id}`] === "error"
                            ? "!"
                            : "Kaydet"}
                    </button>
                  </td>
                </tr>
                {product.modifiers.map((modifier) => {
                  const modifierKey = `${modifier.productId}::${modifier.modifierId}`;
                  return (
                    <tr key={modifierKey} className="admin-modifier-row">
                      <td className="admin-mono">{modifier.modifierId}</td>
                      <td colSpan={2}>
                        <span className="admin-modifier-type">{modifier.modifierType}</span> {modifier.label}
                      </td>
                      <td>
                        <input
                          className="admin-input admin-input-price"
                          type="text"
                          inputMode="decimal"
                          value={modifierPrices[modifierKey] ?? ""}
                          onChange={(event) =>
                            setModifierPrices((current) => ({ ...current, [modifierKey]: event.target.value }))
                          }
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-button admin-button-small"
                          onClick={() => void handleModifierSave(modifier.productId, modifier.modifierId)}
                        >
                          {saveStates[`modifier:${modifierKey}`] === "saving"
                            ? "…"
                            : saveStates[`modifier:${modifierKey}`] === "saved"
                              ? "✓"
                              : saveStates[`modifier:${modifierKey}`] === "error"
                                ? "!"
                                : "Kaydet"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
