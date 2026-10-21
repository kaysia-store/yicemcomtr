import { asPrice, menuImageUrl } from "@/lib/format";
import { previewPublicMenu } from "@/lib/preview";
import { loadRestaurantSettings } from "@/lib/restaurant-settings";
import { loadFailure } from "@/lib/schema-error";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { LoadFailure, MenuCategory, MenuPayload, MenuProduct } from "@/lib/types";

type LocaleName = { locale: string; name: string };

type ProductTranslation = {
  locale: string;
  name: string;
  description: string;
  ingredients: string;
};

type RawAllergen = {
  code: string;
  sort_order: number;
  allergen_translations: LocaleName[] | null;
};

type RawProduct = {
  id: string;
  price: number | string;
  image_path: string | null;
  sort_order: number;
  is_published: boolean;
  product_translations: ProductTranslation[] | null;
  product_allergens:
    | {
        allergen_code: string;
        allergens: RawAllergen | RawAllergen[] | null;
      }[]
    | null;
};

type RawOption = {
  id: string;
  product_id: string;
  price_delta: number | string;
  is_default: boolean;
  sort_order: number;
  product_option_translations: LocaleName[] | null;
};

type RawFeature = {
  id: string;
  selection: "single" | "multiple";
  is_required: boolean;
  sort_order: number;
  category_feature_translations: LocaleName[] | null;
  product_options: RawOption[] | null;
};

type RawCategory = {
  id: string;
  sort_order: number;
  is_published: boolean;
  category_translations: LocaleName[] | null;
  category_features: RawFeature[] | null;
  products: RawProduct[] | null;
};

function pick<T extends { locale: string }>(rows: T[] | null | undefined, locale: string, fallback: string) {
  const list = rows ?? [];
  return list.find((row) => row.locale === locale) ?? list.find((row) => row.locale === fallback);
}

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getPublicMenu(
  locale: string,
): Promise<{ ok: true; menu: MenuPayload } | LoadFailure | { ok: false; reason: "inactive" }> {
  if (!getSupabaseEnv()) return previewPublicMenu(locale);

  try {
    const supabase = await createClient();
    const [settingsResult, languagesResult, categoriesResult] = await Promise.all([
      loadRestaurantSettings(supabase),
      supabase.from("languages").select("code, name, is_active, sort_order").order("sort_order"),
      supabase
        .from("categories")
        .select(
          `
          id,
          sort_order,
          is_published,
          category_translations (locale, name),
          products (
            id,
            price,
            image_path,
            sort_order,
            is_published,
            product_translations (locale, name, description, ingredients),
            product_allergens (
              allergen_code,
              allergens (
                code,
                sort_order,
                allergen_translations (locale, name)
              )
            )
          ),
          category_features (
            id,
            selection,
            is_required,
            sort_order,
            category_feature_translations (locale, name),
            product_options (
              id,
              product_id,
              price_delta,
              is_default,
              sort_order,
              product_option_translations (locale, name)
            )
          )
        `,
        )
        .order("sort_order"),
    ]);

    const error = settingsResult.error ?? languagesResult.error ?? categoriesResult.error;
    if (error) return loadFailure(error);

    const defaultLocale = settingsResult.data?.default_locale ?? "tr";
    const languages = (languagesResult.data ?? []) as {
      code: string;
      name: string;
      is_active: boolean;
      sort_order: number;
    }[];
    const active = languages.filter((language) => language.is_active);
    if (!active.some((language) => language.code === locale)) {
      return { ok: false, reason: "inactive" };
    }

    const categories = ((categoriesResult.data ?? []) as RawCategory[])
      .filter((category) => category.is_published)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => {
        const categoryName = pick(category.category_translations, locale, defaultLocale)?.name;
        if (!categoryName) return null;

        const products = (category.products ?? [])
          .filter((product) => product.is_published)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((product) => toMenuProduct(product, category.category_features ?? [], locale, defaultLocale))
          .filter((product): product is MenuProduct => product !== null);

        if (products.length === 0) return null;
        return { id: category.id, name: categoryName, products } satisfies MenuCategory;
      })
      .filter((category): category is MenuCategory => category !== null);

    return {
      ok: true,
      menu: {
        restaurantName: settingsResult.data?.name ?? "Restoran",
        showTitle: settingsResult.data?.show_title === true,
        locale,
        languages: active.map((language) => ({ code: language.code, name: language.name })),
        categories,
      },
    };
  } catch {
    return { ok: false, reason: "error", message: "Menü yüklenemedi." };
  }
}

function toMenuProduct(product: RawProduct, features: RawFeature[], locale: string, fallback: string): MenuProduct | null {
  const translation = pick(product.product_translations, locale, fallback);
  if (!translation?.name) return null;

  const allergens = (product.product_allergens ?? [])
    .map((link) => {
      const allergen = one(link.allergens);
      if (!allergen) return null;
      const name = pick(allergen.allergen_translations, locale, fallback)?.name;
      if (!name) return null;
      return { code: allergen.code, name, sortOrder: allergen.sort_order };
    })
    .filter((item): item is { code: string; name: string; sortOrder: number } => item !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ code, name }) => ({ code, name }));

  return {
    id: product.id,
    name: translation.name,
    description: translation.description ?? "",
    ingredients: translation.ingredients ?? "",
    price: asPrice(product.price),
    imageUrl: menuImageUrl(product.image_path),
    allergens,
    features: features
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((feature) => {
        const name = pick(feature.category_feature_translations, locale, fallback)?.name;
        if (!name || (feature.selection !== "single" && feature.selection !== "multiple")) return null;
        const options = (feature.product_options ?? [])
          .filter((option) => option.product_id === product.id)
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
        if (options.length === 0) return null;
        return {
          id: feature.id,
          name,
          selection: feature.selection,
          required: feature.is_required,
          options,
        };
      })
      .filter((feature): feature is NonNullable<typeof feature> => feature !== null),
  };
}
