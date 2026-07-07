"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loadAdminMenuData } from "@/lib/admin/menu-data";
import { loadAdminLanguages, type AdminLanguage } from "@/lib/admin/languages-data";
import { collectMissingTranslations, type MissingTranslationItem } from "@/lib/admin/translation-utils";
import type { AdminCategory, AdminMenuData, AdminProduct } from "@/lib/admin/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminDataContextValue = {
  categories: AdminCategory[];
  products: AdminProduct[];
  languages: AdminLanguage[];
  missingTranslations: MissingTranslationItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setMenuData: (data: AdminMenuData) => void;
  getCategoryName: (id: string) => string;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [menuData, setMenuData] = useState<AdminMenuData | null>(null);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const [menu, langs] = await Promise.all([loadAdminMenuData(supabase), loadAdminLanguages(supabase)]);
      setMenuData(menu);
      setLanguages(langs);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const missingTranslations = useMemo(
    () => (menuData ? collectMissingTranslations(menuData.categories, menuData.products) : []),
    [menuData],
  );

  const getCategoryName = useCallback(
    (id: string) => menuData?.categories.find((category) => category.id === id)?.names.tr ?? id,
    [menuData],
  );

  const value = useMemo<AdminDataContextValue>(
    () => ({
      categories: menuData?.categories ?? [],
      products: menuData?.products ?? [],
      languages,
      missingTranslations,
      loading,
      error,
      refresh,
      setMenuData: (data) => setMenuData(data),
      getCategoryName,
    }),
    [menuData, languages, missingTranslations, loading, error, refresh, getCategoryName],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) throw new Error("useAdminData must be used within AdminDataProvider");
  return context;
}
