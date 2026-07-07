import { loadAdminMenuData } from "./menu-data";
import { loadRecentAuditLogs } from "./audit";

type SupabaseClient = ReturnType<typeof import("@/lib/supabase/client").getSupabaseBrowserClient>;

export type DashboardStats = {
  categoryCount: number;
  productCount: number;
  activeProductCount: number;
  hiddenCategoryCount: number;
  modifierCount: number;
};

export async function loadDashboardData(supabase: SupabaseClient) {
  const [menu, auditLogs] = await Promise.all([loadAdminMenuData(supabase), loadRecentAuditLogs(supabase, 20)]);

  const stats: DashboardStats = {
    categoryCount: menu.categories.length,
    productCount: menu.products.length,
    activeProductCount: menu.products.filter((product) => product.isActive).length,
    hiddenCategoryCount: menu.categories.filter((category) => !category.isVisible).length,
    modifierCount: menu.products.reduce((sum, product) => sum + product.modifiers.length, 0),
  };

  return { stats, auditLogs };
}
