import { asPrice } from "@/lib/format";
import type { MenuCategory, MenuExtra, MenuExtraMenuProduct, MenuFeature, MenuProduct } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type LocaleName = { locale: string; name: string };

function pick<T extends { locale: string }>(rows: T[] | null | undefined, locale: string, fallback: string) {
  const list = rows ?? [];
  return list.find((row) => row.locale === locale) ?? list.find((row) => row.locale === fallback);
}

type RawCategoryBind = {
  category_id: string;
  sort_order: number;
  extra_options: RawExtra | RawExtra[] | null;
};

type RawProductBind = {
  product_id: string;
  sort_order: number;
  extra_options: RawExtra | RawExtra[] | null;
};

type RawExtra = {
  id: string;
  kind: "fixed" | "menu" | "list";
  selection: "single" | "multiple";
  is_required: boolean;
  price: number | string;
  menu_category_id: string | null;
  extra_option_translations: LocaleName[] | null;
  extra_option_choices:
    | {
        id: string;
        price_delta: number | string;
        is_default: boolean;
        sort_order: number;
        extra_option_choice_translations: LocaleName[] | null;
      }[]
    | null;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

const extraSelect = `
  id,
  kind,
  selection,
  is_required,
  price,
  menu_category_id,
  extra_option_translations (locale, name),
  extra_option_choices (
    id,
    price_delta,
    is_default,
    sort_order,
    extra_option_choice_translations (locale, name)
  )
`;

function mapRawExtra(
  raw: RawExtra,
  locale: string,
  fallback: string,
  productsByCategory: Map<string, MenuExtraMenuProduct[]>,
): MenuExtra | null {
  const name = pick(raw.extra_option_translations, locale, fallback)?.name;
  if (!name) return null;

  const choices = (raw.extra_option_choices ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((choice) => {
      const choiceName = pick(choice.extra_option_choice_translations, locale, fallback)?.name;
      if (!choiceName) return null;
      return {
        id: choice.id,
        name: choiceName,
        priceDelta: asPrice(choice.price_delta),
        isDefault: choice.is_default,
      };
    })
    .filter((choice): choice is NonNullable<typeof choice> => choice !== null);

  if (raw.kind === "list" && choices.length === 0) return null;
  if (raw.kind === "menu" && !(raw.menu_category_id && (productsByCategory.get(raw.menu_category_id)?.length ?? 0) > 0)) {
    return null;
  }

  return {
    id: raw.id,
    name,
    kind: raw.kind,
    selection: raw.selection === "multiple" ? "multiple" : "single",
    required: raw.is_required,
    price: asPrice(raw.price),
    choices,
    menuProducts: raw.kind === "menu" && raw.menu_category_id ? productsByCategory.get(raw.menu_category_id) ?? [] : [],
  };
}

function mergeExtras(primary: MenuExtra[], secondary: MenuExtra[]) {
  const seen = new Set(primary.map((item) => item.id));
  const merged = primary.slice();
  for (const item of secondary) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }
  return merged;
}

/** Kategori ve ürün bağlarını birleştirerek ek seçenekleri yazar. */
export async function attachExtrasToMenu(
  supabase: SupabaseClient,
  categories: MenuCategory[],
  locale: string,
  fallback: string,
): Promise<MenuCategory[]> {
  const categoryIds = categories.map((category) => category.id);
  const productIds = categories.flatMap((category) => category.products.map((product) => product.id));
  if (categoryIds.length === 0) return categories;

  const [categoryBindsResult, productBindsResult] = await Promise.all([
    supabase
      .from("category_extra_options")
      .select(`category_id, sort_order, extra_options ( ${extraSelect} )`)
      .in("category_id", categoryIds)
      .order("sort_order"),
    productIds.length > 0
      ? supabase
          .from("product_extra_options")
          .select(`product_id, sort_order, extra_options ( ${extraSelect} )`)
          .in("product_id", productIds)
          .order("sort_order")
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (categoryBindsResult.error && productBindsResult.error) return categories;

  const productCategory = new Map<string, string>();
  const productsByCategory = new Map<string, MenuExtraMenuProduct[]>();
  for (const category of categories) {
    productsByCategory.set(
      category.id,
      category.products.map((product) => {
        productCategory.set(product.id, category.id);
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          features: product.features,
          extras: [],
        };
      }),
    );
  }

  const menuCategoryIds = new Set<string>();
  const categoryBinds = (categoryBindsResult.error ? [] : categoryBindsResult.data ?? []) as RawCategoryBind[];
  let productBinds = (
    productBindsResult.error && /product_extra_options/i.test(productBindsResult.error.message)
      ? []
      : productBindsResult.error
        ? []
        : productBindsResult.data ?? []
  ) as RawProductBind[];

  for (const row of [...categoryBinds, ...productBinds]) {
    const extra = one(row.extra_options);
    if (extra?.kind === "menu" && extra.menu_category_id) menuCategoryIds.add(extra.menu_category_id);
  }

  const missing = [...menuCategoryIds].filter((id) => !productsByCategory.has(id));
  if (missing.length > 0) {
    const loaded = await loadMenuProductsForCategories(supabase, missing, locale, fallback);
    for (const [id, products] of loaded) {
      productsByCategory.set(id, products);
      for (const product of products) productCategory.set(product.id, id);
    }
    const extraProductIds = [...loaded.values()].flat().map((product) => product.id);
    const needBinds = extraProductIds.filter((id) => !productIds.includes(id));
    if (needBinds.length > 0) {
      const more = await supabase
        .from("product_extra_options")
        .select(`product_id, sort_order, extra_options ( ${extraSelect} )`)
        .in("product_id", needBinds)
        .order("sort_order");
      if (!more.error && more.data) {
        productBinds = [...productBinds, ...(more.data as RawProductBind[])];
      }
    }
  }

  // Menü ürün listeleri features ile; nested extras sonra doldurulur
  const byCategory = new Map<string, MenuExtra[]>();
  for (const row of categoryBinds) {
    const raw = one(row.extra_options);
    if (!raw) continue;
    const extra = mapRawExtra(raw, locale, fallback, productsByCategory);
    if (!extra) continue;
    const list = byCategory.get(row.category_id) ?? [];
    list.push(extra);
    byCategory.set(row.category_id, list);
  }

  const byProduct = new Map<string, MenuExtra[]>();
  for (const row of productBinds) {
    const raw = one(row.extra_options);
    if (!raw) continue;
    const extra = mapRawExtra(raw, locale, fallback, productsByCategory);
    if (!extra) continue;
    const list = byProduct.get(row.product_id) ?? [];
    list.push(extra);
    byProduct.set(row.product_id, list);
  }

  function nestedExtrasFor(productId: string) {
    const categoryId = productCategory.get(productId);
    return mergeExtras(byProduct.get(productId) ?? [], categoryId ? byCategory.get(categoryId) ?? [] : [])
      .filter((item) => item.kind !== "menu")
      .map((item) => ({ ...item, menuProducts: [] }));
  }

  function withNestedMenuExtras(extras: MenuExtra[]) {
    return extras.map((extra) => {
      if (extra.kind !== "menu") return { ...extra, menuProducts: [] };
      return {
        ...extra,
        menuProducts: extra.menuProducts.map((menuProduct) => ({
          ...menuProduct,
          extras: nestedExtrasFor(menuProduct.id),
        })),
      };
    });
  }

  return categories.map((category) => ({
    ...category,
    products: category.products.map((product) => ({
      ...product,
      extras: withNestedMenuExtras(mergeExtras(byProduct.get(product.id) ?? [], byCategory.get(category.id) ?? [])),
    })),
  }));
}

async function loadMenuProductsForCategories(
  supabase: SupabaseClient,
  categoryIds: string[],
  locale: string,
  fallback: string,
) {
  const result = new Map<string, MenuExtraMenuProduct[]>();
  const { data, error } = await supabase
    .from("products")
    .select("id, category_id, price, sort_order, product_translations(locale, name)")
    .in("category_id", categoryIds)
    .eq("is_published", true)
    .order("sort_order");
  if (error || !data) return result;

  const rows = data as {
    id: string;
    category_id: string;
    price: number | string;
    product_translations: LocaleName[] | null;
  }[];
  const productIds = rows.map((row) => row.id);
  const featuresByProduct = await loadFeaturesForProducts(supabase, categoryIds, productIds, locale, fallback);

  for (const row of rows) {
    const name = pick(row.product_translations, locale, fallback)?.name;
    if (!name) continue;
    const list = result.get(row.category_id) ?? [];
    list.push({
      id: row.id,
      name,
      price: asPrice(row.price),
      features: featuresByProduct.get(row.id) ?? [],
      extras: [],
    });
    result.set(row.category_id, list);
  }
  return result;
}

async function loadFeaturesForProducts(
  supabase: SupabaseClient,
  categoryIds: string[],
  productIds: string[],
  locale: string,
  fallback: string,
) {
  const map = new Map<string, MenuFeature[]>();
  if (productIds.length === 0) return map;

  const { data: features, error } = await supabase
    .from("category_features")
    .select(
      `
      id,
      category_id,
      selection,
      is_required,
      sort_order,
      category_feature_translations (locale, name),
      product_options!product_options_feature_id_fkey (
        id,
        product_id,
        price_delta,
        is_default,
        sort_order,
        product_option_translations (locale, name)
      )
    `,
    )
    .in("category_id", categoryIds)
    .order("sort_order");

  if (error || !features) return map;

  const featureRows = features as {
    id: string;
    selection: string;
    is_required: boolean;
    sort_order: number;
    category_feature_translations: LocaleName[] | null;
    product_options:
      | {
          id: string;
          product_id: string;
          price_delta: number | string;
          is_default: boolean;
          sort_order: number;
          product_option_translations: LocaleName[] | null;
        }[]
      | null;
  }[];

  for (const productId of productIds) {
    const productFeatures: MenuFeature[] = [];
    for (const feature of featureRows) {
      const name = pick(feature.category_feature_translations, locale, fallback)?.name;
      if (!name || (feature.selection !== "single" && feature.selection !== "multiple")) continue;
      const options = (feature.product_options ?? [])
        .filter((option) => option.product_id === productId)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((option) => {
          const optionName = pick(option.product_option_translations, locale, fallback)?.name;
          if (!optionName) return null;
          return {
            id: option.id,
            name: optionName,
            priceDelta: asPrice(option.price_delta),
            isDefault: option.is_default,
          };
        })
        .filter((option): option is NonNullable<typeof option> => option !== null);
      if (options.length === 0) continue;
      productFeatures.push({
        id: feature.id,
        name,
        selection: feature.selection,
        required: feature.is_required,
        options,
      });
    }
    map.set(productId, productFeatures);
  }
  return map;
}

export function productNeedsConfiguration(product: MenuProduct) {
  return product.features.length > 0 || product.extras.length > 0 || Boolean(product.ingredients.trim());
}
