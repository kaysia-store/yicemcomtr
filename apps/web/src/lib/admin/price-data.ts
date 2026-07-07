export type AdminCategory = {
  id: string;
  slug: string;
  name: string;
};

export type AdminModifier = {
  productId: string;
  modifierId: string;
  modifierType: string;
  label: string;
  price: number;
};

export type AdminProduct = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  price: number;
  modifiers: AdminModifier[];
};

type TranslationRow = { lang: string; name?: string; label?: string };

function pickTrName(rows: TranslationRow[] | null | undefined, fallback: string): string {
  if (!rows?.length) return fallback;
  return rows.find((row) => row.lang === "tr")?.name ?? rows[0]?.name ?? fallback;
}

function pickTrLabel(rows: TranslationRow[] | null | undefined, fallback: string): string {
  if (!rows?.length) return fallback;
  return rows.find((row) => row.lang === "tr")?.label ?? rows[0]?.label ?? fallback;
}

export async function loadAdminPriceData(supabase: ReturnType<typeof import("@/lib/supabase/client").getSupabaseBrowserClient>) {
  const [
    { data: categories, error: catError },
    { data: products, error: prodError },
    { data: modifiers, error: modError },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, slug, category_translations(lang, name)")
      .order("sort_order"),
    supabase
      .from("products")
      .select("id, category_id, price, sort_order, product_translations(lang, name)")
      .order("sort_order"),
    supabase
      .from("product_modifiers")
      .select(
        "product_id, modifier_id, modifier_type, price, sort_order, product_modifier_translations(lang, label)",
      )
      .order("sort_order"),
  ]);

  if (catError) throw catError;
  if (prodError) throw prodError;
  if (modError) throw modError;

  const categoryMap = new Map<string, AdminCategory>();
  for (const category of categories ?? []) {
    categoryMap.set(category.id, {
      id: category.id,
      slug: category.slug,
      name: pickTrName(category.category_translations as TranslationRow[], category.id),
    });
  }

  const modifiersByProduct = new Map<string, AdminModifier[]>();
  for (const modifier of modifiers ?? []) {
    const list = modifiersByProduct.get(modifier.product_id) ?? [];
    list.push({
      productId: modifier.product_id,
      modifierId: modifier.modifier_id,
      modifierType: modifier.modifier_type,
      label: pickTrLabel(
        modifier.product_modifier_translations as TranslationRow[],
        modifier.modifier_id,
      ),
      price: Number(modifier.price),
    });
    modifiersByProduct.set(modifier.product_id, list);
  }

  const adminProducts: AdminProduct[] = (products ?? []).map((product) => {
    const category = categoryMap.get(product.category_id);
    return {
      id: product.id,
      categoryId: product.category_id,
      categoryName: category?.name ?? product.category_id,
      name: pickTrName(product.product_translations as TranslationRow[], product.id),
      price: Number(product.price),
      modifiers: modifiersByProduct.get(product.id) ?? [],
    };
  });

  return {
    categories: [...categoryMap.values()],
    products: adminProducts,
  };
}

export async function saveProductPrice(
  supabase: ReturnType<typeof import("@/lib/supabase/client").getSupabaseBrowserClient>,
  productId: string,
  price: number,
) {
  const { error } = await supabase
    .from("products")
    .update({ price, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (error) throw error;
}

export async function saveModifierPrice(
  supabase: ReturnType<typeof import("@/lib/supabase/client").getSupabaseBrowserClient>,
  productId: string,
  modifierId: string,
  price: number,
) {
  const { error } = await supabase
    .from("product_modifiers")
    .update({ price })
    .eq("product_id", productId)
    .eq("modifier_id", modifierId);

  if (error) throw error;
}
