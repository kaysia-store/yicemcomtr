import type { SupabaseClient } from "@supabase/supabase-js";
import { asPrice, menuImageUrl } from "@/lib/format";
import {
  previewCategoryEditor,
  previewCategoryList,
  previewDashboard,
  previewLanguages,
  previewProductEditor,
  previewProductList,
  previewProductOptions,
  previewWorkspace,
  previewPriceBoard,
} from "@/lib/preview";
import { loadRestaurantSettings } from "@/lib/restaurant-settings";
import { loadFailure } from "@/lib/schema-error";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type {
  CategoryFeature,
  CategoryListItem,
  LanguageItem,
  LoadFailure,
  ProductChoice,
  ProductListItem,
  TranslationWorkspace,
} from "@/lib/types";

type NameRow = { locale: string; name: string };
type ProductCopy = NameRow & { description: string; ingredients: string };

function pick<T extends { locale: string }>(rows: T[] | null | undefined, locale: string, fallback: string) {
  const list = rows ?? [];
  return list.find((row) => row.locale === locale) ?? list.find((row) => row.locale === fallback);
}

async function clientOrSetup() {
  if (!getSupabaseEnv()) return { ok: false as const, reason: "setup" as const };
  const supabase = await createClient();
  return { ok: true as const, supabase };
}

export async function getDefaultLocale(supabase: SupabaseClient) {
  const { data } = await supabase.from("restaurant_settings").select("default_locale").eq("id", 1).maybeSingle();
  return (data?.default_locale as string | undefined) ?? "tr";
}

export async function nextSortOrder(
  supabase: SupabaseClient,
  table: "categories" | "languages" | "products",
  categoryId?: string,
) {
  let query = supabase.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
  if (table === "products" && categoryId) {
    query = query.eq("category_id", categoryId);
  }
  const { data } = await query.maybeSingle();
  return ((data?.sort_order as number | undefined) ?? -1) + 1;
}

export async function getDashboard(): Promise<
  | {
      ok: true;
      name: string;
      showTitle: boolean;
      defaultLocale: string;
      counts: { categories: number; products: number; languages: number };
    }
  | LoadFailure
> {
  if (!getSupabaseEnv()) return previewDashboard();
  const client = await clientOrSetup();
  if (!client.ok) return client;

  const [settings, categories, products, languages] = await Promise.all([
    loadRestaurantSettings(client.supabase),
    client.supabase.from("categories").select("id", { count: "exact", head: true }),
    client.supabase.from("products").select("id", { count: "exact", head: true }),
    client.supabase.from("languages").select("code", { count: "exact", head: true }),
  ]);

  const error = settings.error ?? categories.error ?? products.error ?? languages.error;
  if (error) return loadFailure(error);

  return {
    ok: true,
    name: settings.data?.name ?? "Restoran",
    showTitle: settings.data?.show_title === true,
    defaultLocale: settings.data?.default_locale ?? "tr",
    counts: {
      categories: categories.count ?? 0,
      products: products.count ?? 0,
      languages: languages.count ?? 0,
    },
  };
}

export async function getCategoryList(): Promise<{ ok: true; categories: CategoryListItem[] } | LoadFailure> {
  if (!getSupabaseEnv()) return previewCategoryList();
  const client = await clientOrSetup();
  if (!client.ok) return client;

  const [settings, categories] = await Promise.all([
    client.supabase.from("restaurant_settings").select("default_locale").eq("id", 1).maybeSingle(),
    client.supabase
      .from("categories")
      .select("id, sort_order, is_published, category_translations(locale, name)")
      .order("sort_order"),
  ]);
  const error = settings.error ?? categories.error;
  if (error) return loadFailure(error);

  const locale = settings.data?.default_locale ?? "tr";
  const items = ((categories.data ?? []) as {
    id: string;
    sort_order: number;
    is_published: boolean;
    category_translations: NameRow[] | null;
  }[]).map((category) => ({
    id: category.id,
    name: pick(category.category_translations, locale, locale)?.name ?? "Adsız",
    sortOrder: category.sort_order,
    isPublished: category.is_published,
  }));

  return { ok: true, categories: items };
}

export async function getCategoryEditor(id: string): Promise<
  | {
      ok: true;
      category: { id: string; name: string; isPublished: boolean; features: CategoryFeature[] } | null;
    }
  | LoadFailure
> {
  if (!getSupabaseEnv()) return previewCategoryEditor(id);
  const client = await clientOrSetup();
  if (!client.ok) return client;

  const locale = await getDefaultLocale(client.supabase);
  const { data, error } = await client.supabase
    .from("categories")
    .select(
      "id, is_published, category_translations(locale, name), category_features(id, selection, is_required, sort_order, category_feature_translations(locale, name))",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) return loadFailure(error);
  if (!data) return { ok: true, category: null };

  const row = data as {
    id: string;
    is_published: boolean;
    category_translations: NameRow[] | null;
    category_features:
      | {
          id: string;
          selection: "single" | "multiple";
          is_required: boolean;
          sort_order: number;
          category_feature_translations: NameRow[] | null;
        }[]
      | null;
  };

  return {
    ok: true,
    category: {
      id: row.id,
      name: pick(row.category_translations, locale, locale)?.name ?? "",
      isPublished: row.is_published,
      features: (row.category_features ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((feature) => ({
          id: feature.id,
          name: pick(feature.category_feature_translations, locale, locale)?.name ?? "",
          selection: feature.selection === "multiple" ? "multiple" : "single",
          required: feature.is_required,
        })),
    },
  };
}

export async function getProductList(): Promise<{ ok: true; products: ProductListItem[] } | LoadFailure> {
  if (!getSupabaseEnv()) return previewProductList();
  const client = await clientOrSetup();
  if (!client.ok) return client;

  const locale = await getDefaultLocale(client.supabase);
  const { data, error } = await client.supabase
    .from("products")
    .select(
      "id, price, image_path, sort_order, is_published, category_id, categories(id, sort_order, category_translations(locale, name)), product_translations(locale, name, ingredients)",
    );

  if (error) return loadFailure(error);

  const products = ((data ?? []) as {
    id: string;
    price: number | string;
    image_path: string | null;
    sort_order: number;
    is_published: boolean;
    category_id: string;
    categories:
      | { id: string; sort_order: number; category_translations: NameRow[] | null }
      | { id: string; sort_order: number; category_translations: NameRow[] | null }[]
      | null;
    product_translations: (NameRow & { ingredients: string })[] | null;
  }[])
    .map((product) => {
      const category = Array.isArray(product.categories) ? product.categories[0] : product.categories;
      const copy = pick(product.product_translations, locale, locale);
      return {
        id: product.id,
        name: copy?.name ?? "Adsız",
        ingredients: copy?.ingredients ?? "",
        categoryId: product.category_id,
        categoryName: pick(category?.category_translations, locale, locale)?.name ?? "Kategori",
        categorySort: category?.sort_order ?? 0,
        sortOrder: product.sort_order,
        price: asPrice(product.price),
        isPublished: product.is_published,
        imageUrl: menuImageUrl(product.image_path),
      };
    })
    .sort((a, b) => a.categorySort - b.categorySort || a.sortOrder - b.sortOrder)
    .map((product) => ({
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      price: product.price,
      isPublished: product.isPublished,
      imageUrl: product.imageUrl,
      ingredients: product.ingredients,
    }));

  return { ok: true, products };
}

export async function getProductOptions(): Promise<
  | {
      ok: true;
      categories: { id: string; name: string; features: CategoryFeature[] }[];
      allergens: { code: string; name: string }[];
    }
  | LoadFailure
> {
  if (!getSupabaseEnv()) return previewProductOptions();
  const client = await clientOrSetup();
  if (!client.ok) return client;
  const locale = await getDefaultLocale(client.supabase);

  const [categories, allergens] = await Promise.all([
    client.supabase
      .from("categories")
      .select(
        "id, sort_order, category_translations(locale, name), category_features(id, selection, is_required, sort_order, category_feature_translations(locale, name))",
      )
      .order("sort_order"),
    client.supabase
      .from("allergens")
      .select("code, sort_order, allergen_translations(locale, name)")
      .order("sort_order"),
  ]);
  const error = categories.error ?? allergens.error;
  if (error) return loadFailure(error);

  return {
    ok: true,
    categories: ((categories.data ?? []) as {
      id: string;
      category_translations: NameRow[] | null;
      category_features:
        | {
            id: string;
            selection: "single" | "multiple";
            is_required: boolean;
            sort_order: number;
            category_feature_translations: NameRow[] | null;
          }[]
        | null;
    }[]).map((category) => ({
      id: category.id,
      name: pick(category.category_translations, locale, locale)?.name ?? "Adsız",
      features: (category.category_features ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((feature) => ({
          id: feature.id,
          name: pick(feature.category_feature_translations, locale, locale)?.name ?? "Özellik",
          selection: feature.selection === "multiple" ? "multiple" : "single",
          required: feature.is_required,
        })),
    })),
    allergens: ((allergens.data ?? []) as { code: string; allergen_translations: NameRow[] | null }[]).map(
      (allergen) => ({
        code: allergen.code,
        name: pick(allergen.allergen_translations, locale, locale)?.name ?? allergen.code,
      }),
    ),
  };
}

export async function getProductEditor(id: string): Promise<
  | {
      ok: true;
      product: {
        id: string;
        categoryId: string;
        name: string;
        description: string;
        ingredients: string;
        price: number;
        isPublished: boolean;
        imageUrl: string | null;
        allergenCodes: string[];
        options: ProductChoice[];
      } | null;
    }
  | LoadFailure
> {
  if (!getSupabaseEnv()) return previewProductEditor(id);
  const client = await clientOrSetup();
  if (!client.ok) return client;
  const locale = await getDefaultLocale(client.supabase);
  const { data, error } = await client.supabase
    .from("products")
    .select(
      "id, category_id, price, image_path, is_published, product_translations(locale, name, description, ingredients), product_allergens(allergen_code), product_options(id, feature_id, price_delta, is_default, sort_order, product_option_translations(locale, name))",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) return loadFailure(error);
  if (!data) return { ok: true, product: null };

  const row = data as {
    id: string;
    category_id: string;
    price: number | string;
    image_path: string | null;
    is_published: boolean;
    product_translations: ProductCopy[] | null;
    product_allergens: { allergen_code: string }[] | null;
    product_options:
      | {
          id: string;
          feature_id: string;
          price_delta: number | string;
          is_default: boolean;
          sort_order: number;
          product_option_translations: NameRow[] | null;
        }[]
      | null;
  };
  const copy = pick(row.product_translations, locale, locale);

  return {
    ok: true,
    product: {
      id: row.id,
      categoryId: row.category_id,
      name: copy?.name ?? "",
      description: copy?.description ?? "",
      ingredients: copy?.ingredients ?? "",
      price: asPrice(row.price),
      isPublished: row.is_published,
      imageUrl: menuImageUrl(row.image_path),
      allergenCodes: (row.product_allergens ?? []).map((item) => item.allergen_code),
      options: (row.product_options ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((option) => ({
          id: option.id,
          featureId: option.feature_id,
          name: pick(option.product_option_translations, locale, locale)?.name ?? "",
          priceDelta: asPrice(option.price_delta),
          isDefault: option.is_default,
        })),
    },
  };
}

export async function getLanguages(): Promise<{ ok: true; languages: LanguageItem[] } | LoadFailure> {
  if (!getSupabaseEnv()) return previewLanguages();
  const client = await clientOrSetup();
  if (!client.ok) return client;
  const { data, error } = await client.supabase
    .from("languages")
    .select("code, name, is_default, is_active, sort_order")
    .order("sort_order");
  if (error) return loadFailure(error);

  return {
    ok: true,
    languages: ((data ?? []) as {
      code: string;
      name: string;
      is_default: boolean;
      is_active: boolean;
    }[]).map((language) => ({
      code: language.code,
      name: language.name,
      isDefault: language.is_default,
      isActive: language.is_active,
    })),
  };
}

export async function getTranslationWorkspace(
  code: string,
): Promise<{ ok: true; workspace: TranslationWorkspace | null } | LoadFailure> {
  if (!getSupabaseEnv()) return previewWorkspace(code);
  const client = await clientOrSetup();
  if (!client.ok) return client;

  const [languageResult, settingsResult, categoriesResult, productsResult, allergensResult, featuresResult, optionsResult] =
    await Promise.all([
      client.supabase.from("languages").select("code, name, is_default, is_active").eq("code", code).maybeSingle(),
      client.supabase.from("restaurant_settings").select("default_locale").eq("id", 1).maybeSingle(),
      client.supabase.from("categories").select("id, sort_order, category_translations(locale, name)").order("sort_order"),
      client.supabase
        .from("products")
        .select("id, sort_order, category_id, product_translations(locale, name, description, ingredients)"),
      client.supabase.from("allergens").select("code, sort_order, allergen_translations(locale, name)").order("sort_order"),
      client.supabase
        .from("category_features")
        .select("id, category_id, sort_order, category_feature_translations(locale, name), categories(category_translations(locale, name))")
        .order("sort_order"),
      client.supabase
        .from("product_options")
        .select(
          "id, sort_order, product_option_translations(locale, name), products(product_translations(locale, name)), category_features(category_feature_translations(locale, name))",
        )
        .order("sort_order"),
    ]);

  const error =
    languageResult.error ??
    settingsResult.error ??
    categoriesResult.error ??
    productsResult.error ??
    allergensResult.error ??
    featuresResult.error ??
    optionsResult.error;
  if (error) return loadFailure(error);
  if (!languageResult.data) return { ok: true, workspace: null };

  const defaultLocale = settingsResult.data?.default_locale ?? "tr";
  const language = languageResult.data as {
    code: string;
    name: string;
    is_default: boolean;
    is_active: boolean;
  };

  const categories = ((categoriesResult.data ?? []) as {
    id: string;
    category_translations: NameRow[] | null;
  }[]).map((category) => ({
    id: category.id,
    sourceName: pick(category.category_translations, defaultLocale, defaultLocale)?.name ?? "",
    name: category.category_translations?.find((item) => item.locale === code)?.name ?? "",
  }));

  const products = ((productsResult.data ?? []) as {
    id: string;
    sort_order: number;
    product_translations: ProductCopy[] | null;
  }[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((product) => {
      const source = pick(product.product_translations, defaultLocale, defaultLocale);
      const current = product.product_translations?.find((item) => item.locale === code);
      return {
        id: product.id,
        sourceName: source?.name ?? "",
        sourceDescription: source?.description ?? "",
        sourceIngredients: source?.ingredients ?? "",
        name: current?.name ?? "",
        description: current?.description ?? "",
        ingredients: current?.ingredients ?? "",
      };
    });

  const allergens = ((allergensResult.data ?? []) as {
    code: string;
    allergen_translations: NameRow[] | null;
  }[]).map((allergen) => ({
    code: allergen.code,
    sourceName: pick(allergen.allergen_translations, defaultLocale, defaultLocale)?.name ?? allergen.code,
    name: allergen.allergen_translations?.find((item) => item.locale === code)?.name ?? "",
  }));

  const features = ((featuresResult.data ?? []) as {
    id: string;
    sort_order: number;
    category_feature_translations: NameRow[] | null;
    categories:
      | { category_translations: NameRow[] | null }
      | { category_translations: NameRow[] | null }[]
      | null;
  }[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((feature) => {
      const category = Array.isArray(feature.categories) ? feature.categories[0] : feature.categories;
      return {
        id: feature.id,
        categoryName: pick(category?.category_translations, defaultLocale, defaultLocale)?.name ?? "",
        sourceName: pick(feature.category_feature_translations, defaultLocale, defaultLocale)?.name ?? "",
        name: feature.category_feature_translations?.find((item) => item.locale === code)?.name ?? "",
      };
    });

  const options = ((optionsResult.data ?? []) as {
    id: string;
    sort_order: number;
    product_option_translations: NameRow[] | null;
    products:
      | { product_translations: NameRow[] | null }
      | { product_translations: NameRow[] | null }[]
      | null;
    category_features:
      | { category_feature_translations: NameRow[] | null }
      | { category_feature_translations: NameRow[] | null }[]
      | null;
  }[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((option) => {
      const product = Array.isArray(option.products) ? option.products[0] : option.products;
      const feature = Array.isArray(option.category_features) ? option.category_features[0] : option.category_features;
      return {
        id: option.id,
        productName: pick(product?.product_translations, defaultLocale, defaultLocale)?.name ?? "",
        featureName: pick(feature?.category_feature_translations, defaultLocale, defaultLocale)?.name ?? "",
        sourceName: pick(option.product_option_translations, defaultLocale, defaultLocale)?.name ?? "",
        name: option.product_option_translations?.find((item) => item.locale === code)?.name ?? "",
      };
    });

  return {
    ok: true,
    workspace: {
      language: {
        code: language.code,
        name: language.name,
        isDefault: language.is_default,
        isActive: language.is_active,
      },
      defaultLocale,
      categories,
      products,
      allergens,
      features,
      options,
    },
  };
}

export type PriceOption = { id: string; featureName: string; name: string; price: number };
export type PriceProduct = { id: string; name: string; price: number; isPublished: boolean; options: PriceOption[] };
export type PriceGroup = { id: string; name: string; products: PriceProduct[] };

export async function getPriceBoard(): Promise<{ ok: true; groups: PriceGroup[] } | LoadFailure> {
  if (!getSupabaseEnv()) return previewPriceBoard();
  const client = await clientOrSetup();
  if (!client.ok) return client;
  const [listed, locale] = await Promise.all([getProductList(), getDefaultLocale(client.supabase)]);
  if (!listed.ok) return listed;

  const { data, error } = await client.supabase
    .from("product_options")
    .select(
      "id, product_id, price_delta, sort_order, product_option_translations(locale, name), category_features(sort_order, category_feature_translations(locale, name))",
    );
  if (error) return loadFailure(error);

  const optionsByProduct = new Map<string, PriceOption[]>();
  const rows = ((data ?? []) as {
    id: string;
    product_id: string;
    price_delta: number | string;
    sort_order: number;
    product_option_translations: NameRow[] | null;
    category_features:
      | { sort_order: number; category_feature_translations: NameRow[] | null }
      | { sort_order: number; category_feature_translations: NameRow[] | null }[]
      | null;
  }[])
    .map((option) => {
      const feature = Array.isArray(option.category_features) ? option.category_features[0] : option.category_features;
      return {
        productId: option.product_id,
        sortOrder: option.sort_order,
        featureSort: feature?.sort_order ?? 0,
        option: {
          id: option.id,
          featureName: pick(feature?.category_feature_translations, locale, locale)?.name ?? "Özellik",
          name: pick(option.product_option_translations, locale, locale)?.name ?? "Seçenek",
          price: asPrice(option.price_delta),
        },
      };
    })
    .sort((a, b) => a.featureSort - b.featureSort || a.sortOrder - b.sortOrder);
  for (const row of rows) {
    const list = optionsByProduct.get(row.productId) ?? [];
    list.push(row.option);
    optionsByProduct.set(row.productId, list);
  }

  const groups: PriceGroup[] = [];
  for (const product of listed.products) {
    const current = groups.find((group) => group.id === product.categoryId);
    const item: PriceProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      isPublished: product.isPublished,
      options: optionsByProduct.get(product.id) ?? [],
    };
    if (current) current.products.push(item);
    else groups.push({ id: product.categoryId, name: product.categoryName, products: [item] });
  }
  return { ok: true, groups };
}
