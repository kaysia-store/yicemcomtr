import { logAudit } from "./audit";
import { notifyPublicMenuUpdated } from "./revalidate-public-menu";
import type { AdminProduct } from "./types";

type SupabaseClient = ReturnType<typeof import("@/lib/supabase/client").getSupabaseBrowserClient>;

export type ProductPriceUpdate = {
  productId: string;
  price: number;
};

export type ModifierPriceUpdate = {
  categoryId: string;
  modifierType: string;
  modifierId: string;
  price: number;
};

export async function bulkUpdateProductPrices(
  supabase: SupabaseClient,
  updates: ProductPriceUpdate[],
  products: AdminProduct[],
) {
  if (updates.length === 0) return;

  const now = new Date().toISOString();
  const results = await Promise.all(
    updates.map((update) =>
      supabase.from("products").update({ price: update.price, updated_at: now }).eq("id", update.productId),
    ),
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;

  const productMap = new Map(products.map((product) => [product.id, product]));
  const summaries = updates
    .slice(0, 3)
    .map((update) => {
      const product = productMap.get(update.productId);
      return `${product?.names.tr ?? update.productId}: ${update.price} ₺`;
    })
    .join(", ");

  await logAudit(supabase, {
    entityType: "price",
    entityId: "products",
    action: "update",
    summary: `${updates.length} ürün fiyatı güncellendi (${summaries}${updates.length > 3 ? "…" : ""})`,
    changes: { count: updates.length, updates },
  });

  await notifyPublicMenuUpdated();
}

export async function bulkUpdateModifierPrices(
  supabase: SupabaseClient,
  updates: ModifierPriceUpdate[],
  products: AdminProduct[],
) {
  if (updates.length === 0) return;

  const ops = [];

  for (const update of updates) {
    const categoryProducts = products.filter((product) => product.categoryId === update.categoryId);
    for (const product of categoryProducts) {
      const hasModifier = product.modifiers.some(
        (mod) => mod.modifierType === update.modifierType && mod.modifierId === update.modifierId,
      );
      if (!hasModifier) continue;

      ops.push(
        supabase
          .from("product_modifiers")
          .update({ price: update.price })
          .eq("product_id", product.id)
          .eq("modifier_id", update.modifierId),
      );
    }
  }

  const results = await Promise.all(ops);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;

  await logAudit(supabase, {
    entityType: "price",
    entityId: "modifiers",
    action: "update",
    summary: `${updates.length} ekstra fiyat grubu güncellendi`,
    changes: { count: updates.length, updates },
  });

  await notifyPublicMenuUpdated();
}
