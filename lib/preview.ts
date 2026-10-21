import { randomUUID } from "crypto";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { redirect } from "next/navigation";
import { menuImageUrl } from "@/lib/format";
import { readFeatureDrafts, readOptionDrafts } from "@/lib/features";
import { revalidateMenu } from "@/lib/revalidate";
import type { ActionState, MenuPayload } from "@/lib/types";
import { allergenNames, menuLanguages } from "@/lib/menu-locales";
import { localePattern, readPrice, readText, uuidPattern } from "@/lib/validators";

type Translation = { locale: string; name: string; description: string; ingredients: string };

export type PreviewDb = {
  settings: { name: string; defaultLocale: string; showTitle: boolean };
  languages: { code: string; name: string; isDefault: boolean; isActive: boolean; sortOrder: number }[];
  categories: { id: string; sortOrder: number; isPublished: boolean }[];
  categoryTranslations: { categoryId: string; locale: string; name: string }[];
  products: { id: string; categoryId: string; price: number; imagePath: string | null; sortOrder: number; isPublished: boolean }[];
  productTranslations: { productId: string; locale: string; name: string; description: string; ingredients: string }[];
  allergens: { code: string; sortOrder: number }[];
  allergenTranslations: { code: string; locale: string; name: string }[];
  productAllergens: { productId: string; code: string }[];
  features: { id: string; categoryId: string; selection: "single" | "multiple"; isRequired: boolean; sortOrder: number }[];
  featureTranslations: { featureId: string; locale: string; name: string }[];
  options: { id: string; productId: string; featureId: string; priceDelta: number; isDefault: boolean; sortOrder: number }[];
  optionTranslations: { optionId: string; locale: string; name: string }[];
};

const filePath = path.join(process.cwd(), "data", "preview.json");

const allergens = Object.keys(allergenNames).map((code, index) => ({ code, sortOrder: index + 1 }));

function nid(prefix: "a" | "b" | "c" | "d", n: number) {
  return `${prefix}2000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
}

function line(tr: string, en: string, ru: string, de: string, fr: string, ar: string) {
  return { tr, en, ru, de, fr, ar };
}

function seed(): PreviewDb {
  const categoryId = nid("a", 1);
  const breadId = nid("c", 1);
  const menuId = nid("c", 2);
  const salad = line("Marul, domates", "Lettuce, tomato", "Салат, помидоры", "Salat, Tomaten", "Laitue, tomates", "خس، طماطم");
  const items: { price: number; choices: boolean; name: ReturnType<typeof line>; ingredients: ReturnType<typeof line> }[] = [
    { price: 150, choices: true, name: line("Tavuk Döner (70 gr)", "Chicken Döner (70 g)", "Куриный дёнер (70 г)", "Hähnchen-Döner (70 g)", "Döner au poulet (70 g)", "دونر دجاج (70 غ)"), ingredients: salad },
    { price: 200, choices: true, name: line("Tavuk Döner (100 gr)", "Chicken Döner (100 g)", "Куриный дёнер (100 г)", "Hähnchen-Döner (100 g)", "Döner au poulet (100 g)", "دونر دجاج (100 غ)"), ingredients: salad },
    {
      price: 230,
      choices: true,
      name: line("Kaşarlı Tavuk Dürüm (100 gr)", "Chicken Dürüm with Kashar (100 g)", "Куриный дюрюм с кашаром (100 г)", "Hähnchen-Dürüm mit Käse (100 g)", "Dürüm au poulet au kaşar (100 g)", "دوروم دجاج بالقشقوان (100 غ)"),
      ingredients: line("Marul, domates, kaşar", "Lettuce, tomato, kashar", "Салат, помидоры, кашар", "Salat, Tomaten, Kaschkawal", "Laitue, tomates, kaşar", "خس، طماطم، قشقوان"),
    },
    {
      price: 300,
      choices: true,
      name: line("Tavuk İskender (100 gr)", "Chicken Iskender (100 g)", "Куриный Искендер (100 г)", "Hähnchen-Iskender (100 g)", "Iskender au poulet (100 g)", "إسكندر دجاج (100 غ)"),
      ingredients: line("Pilav, tavuk, salata", "Rice, chicken, salad", "Рис, курица, салат", "Reis, Hähnchen, Salat", "Riz, poulet, salade", "أرز، دجاج، سلطة"),
    },
    { price: 300, choices: true, name: line("Tavuk Döner Beyti (100 gr)", "Chicken Döner Beyti (100 g)", "Куриный дёнер бейти (100 г)", "Hähnchen-Döner-Beyti (100 g)", "Beyti döner au poulet (100 g)", "بيتي دونر دجاج (100 غ)"), ingredients: line("", "", "", "", "", "") },
    {
      price: 230,
      choices: true,
      name: line("Tavuk Döner Porsiyon (100 gr)", "Chicken Döner Plate (100 g)", "Порция куриного дёнера (100 г)", "Hähnchen-Döner-Portion (100 g)", "Assiette de döner au poulet (100 g)", "صحن دونر دجاج (100 غ)"),
      ingredients: line("Lavaş, pilav, döner, salata", "Flatbread, rice, döner, salad", "Лаваш, рис, дёнер, салат", "Fladenbrot, Reis, Döner, Salat", "Pain lavash, riz, döner, salade", "خبز لافاش، أرز، دونر، سلطة"),
    },
    {
      price: 300,
      choices: true,
      name: line("Pilav Üstü Tavuk Döner (100 gr)", "Chicken Döner over Rice (100 g)", "Куриный дёнер на рисе (100 г)", "Hähnchen-Döner auf Reis (100 g)", "Döner au poulet sur riz (100 g)", "دونر دجاج على الأرز (100 غ)"),
      ingredients: line("Pilav, döner, salata", "Rice, döner, salad", "Рис, дёнер, салат", "Reis, Döner, Salat", "Riz, döner, salade", "أرز، دونر، سلطة"),
    },
    { price: 300, choices: false, name: line("Tavuk Döner 100 gr, Cips, İçecek", "Chicken Döner 100 g, Chips, Drink", "Куриный дёнер 100 г, чипсы, напиток", "Hähnchen-Döner 100 g, Chips, Getränk", "Döner au poulet 100 g, chips, boisson", "دونر دجاج 100 غ، رقائق، مشروب"), ingredients: line("", "", "", "", "", "") },
    {
      price: 750,
      choices: false,
      name: line("3 Adet Tavuk Döner, Büyük Boy Cips, Litrelik İçecek", "3 Chicken Döner, Large Chips, 1 Litre Drink", "3 куриных дёнера, большая порция чипсов, напиток 1 л", "3 Hähnchen-Döner, große Chips, 1-Liter-Getränk", "3 döner au poulet, grandes chips, boisson 1 litre", "3 دونر دجاج، رقائق كبيرة، مشروب 1 لتر"),
      ingredients: line("", "", "", "", "", ""),
    },
    { price: 330, choices: false, name: line("Kaşarlı Tavuk Döner, Cips, İçecek", "Chicken Döner with Kashar, Chips, Drink", "Куриный дёнер с кашаром, чипсы, напиток", "Hähnchen-Döner mit Käse, Chips, Getränk", "Döner au poulet au kaşar, chips, boisson", "دونر دجاج بالقشقوان، رقائق، مشروب"), ingredients: line("", "", "", "", "", "") },
    {
      price: 1250,
      choices: false,
      name: line("5 Adet Tavuk Döner, 2 Büyük Boy Cips, Litrelik İçecek", "5 Chicken Döner, 2 Large Chips, 1 Litre Drink", "5 куриных дёнеров, 2 большие порции чипсов, напиток 1 л", "5 Hähnchen-Döner, 2 große Chips, 1-Liter-Getränk", "5 döner au poulet, 2 grandes chips, boisson 1 litre", "5 دونر دجاج، رقائق كبيرة ×2، مشروب 1 لتر"),
      ingredients: line("", "", "", "", "", ""),
    },
  ];
  const breads = [
    { priceDelta: 0, isDefault: true, name: line("Dürüm", "Wrap", "Дюрюм", "Dürüm", "Dürüm", "دوروم") },
    { priceDelta: 0, isDefault: false, name: line("Gobit ekmeği", "Gobit bread", "Хлеб гобит", "Gobit-Brot", "Pain gobit", "خبز غوبيت") },
    { priceDelta: 0, isDefault: false, name: line("Taş fırın ekmeği", "Stone-oven bread", "Хлеб из каменной печи", "Steinofenbrot", "Pain au four de pierre", "خبز الفرن الحجري") },
    { priceDelta: 0, isDefault: false, name: line("Ayvalık tost ekmeği", "Ayvalık toast bread", "Тостовый хлеб Айвалык", "Ayvalık-Toastbrot", "Pain de mie d'Ayvalık", "خبز توست أيفاليك") },
  ];
  const menuChoice = line("Cips + içecek", "Chips + drink", "Чипсы + напиток", "Chips + Getränk", "Chips + boisson", "رقائق + مشروب");
  const products = items.map((item, index) => ({
    id: nid("b", index + 1),
    categoryId,
    price: item.price,
    imagePath: null,
    sortOrder: index,
    isPublished: true,
  }));
  const options: PreviewDb["options"] = [];
  const optionTranslations: PreviewDb["optionTranslations"] = [];
  let optionNo = 1;
  items.forEach((item, index) => {
    if (!item.choices) return;
    const productId = products[index].id;
    breads.forEach((bread, sortOrder) => {
      const id = nid("d", optionNo);
      optionNo += 1;
      options.push({ id, productId, featureId: breadId, priceDelta: bread.priceDelta, isDefault: bread.isDefault, sortOrder });
      menuLanguages.forEach((language) => {
        optionTranslations.push({ optionId: id, locale: language.code, name: bread.name[language.code] });
      });
    });
    const id = nid("d", optionNo);
    optionNo += 1;
    options.push({ id, productId, featureId: menuId, priceDelta: 100, isDefault: false, sortOrder: 0 });
    menuLanguages.forEach((language) => {
      optionTranslations.push({ optionId: id, locale: language.code, name: menuChoice[language.code] });
    });
  });

  return {
    settings: { name: "Köz Ocakbaşı", defaultLocale: "tr", showTitle: false },
    languages: menuLanguages.map((language) => ({ ...language, isActive: true })),
    categories: [{ id: categoryId, sortOrder: 0, isPublished: true }],
    categoryTranslations: menuLanguages.map((language) => ({
      categoryId,
      locale: language.code,
      name: line("Tavuk Döner", "Chicken Döner", "Куриный дёнер", "Hähnchen-Döner", "Döner au poulet", "دونر دجاج")[language.code],
    })),
    products,
    productTranslations: products.flatMap((product, index) =>
      menuLanguages.map((language) => copy(product.id, language.code, items[index].name[language.code], "", items[index].ingredients[language.code])),
    ),
    allergens: allergens.map(({ code, sortOrder }) => ({ code, sortOrder })),
    allergenTranslations: allergens.flatMap((item) =>
      Object.entries(allergenNames[item.code] ?? {}).map(([locale, name]) => ({ code: item.code, locale, name })),
    ),
    productAllergens: [],
    features: [
      { id: breadId, categoryId, selection: "single", isRequired: true, sortOrder: 0 },
      { id: menuId, categoryId, selection: "multiple", isRequired: false, sortOrder: 1 },
    ],
    featureTranslations: [
      ...menuLanguages.map((language) => ({
        featureId: breadId,
        locale: language.code,
        name: line("Ekmek", "Bread", "Хлеб", "Brot", "Pain", "الخبز")[language.code],
      })),
      ...menuLanguages.map((language) => ({
        featureId: menuId,
        locale: language.code,
        name: line("Menü", "Menu", "Меню", "Menü", "Menu", "قائمة")[language.code],
      })),
    ],
    options,
    optionTranslations,
  };
}

function copy(productId: string, locale: string, name: string, description: string, ingredients: string): PreviewDb["productTranslations"][number] {
  return { productId, locale, name, description, ingredients };
}

function ensureFeatures(db: PreviewDb) {
  if (!Array.isArray(db.features)) db.features = [];
  db.featureTranslations ??= [];
  db.options ??= [];
  db.optionTranslations ??= [];
  return db;
}

export function readPreview(): PreviewDb {
  try {
    const db = ensureMenuLocales(ensureFeatures(JSON.parse(readFileSync(filePath, "utf8")) as PreviewDb));
    if (typeof db.settings.showTitle !== "boolean") db.settings.showTitle = false;
    return db;
  } catch {
    const initial = seed();
    writePreview(initial);
    return initial;
  }
}

function ensureMenuLocales(db: PreviewDb) {
  let changed = false;
  for (const language of menuLanguages) {
    if (db.languages.some((item) => item.code === language.code)) continue;
    db.languages.push({ ...language, isActive: true });
    changed = true;
  }
  for (const allergen of db.allergens) {
    for (const [locale, name] of Object.entries(allergenNames[allergen.code] ?? {})) {
      if (db.allergenTranslations.some((item) => item.code === allergen.code && item.locale === locale)) continue;
      db.allergenTranslations.push({ code: allergen.code, locale, name });
      changed = true;
    }
  }
  if (changed) writePreview(db);
  return db;
}

function writePreview(db: PreviewDb) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(db, null, 2));
}

function updatePreview(change: (db: PreviewDb) => void) {
  const db = readPreview();
  change(db);
  writePreview(db);
  revalidateMenu();
  return db;
}

function pickName(rows: { locale: string; name: string }[], locale: string, fallback: string) {
  return rows.find((row) => row.locale === locale)?.name ?? rows.find((row) => row.locale === fallback)?.name;
}

function pickCopy(rows: Translation[], locale: string, fallback: string) {
  return rows.find((row) => row.locale === locale) ?? rows.find((row) => row.locale === fallback);
}

function menuFeatures(db: PreviewDb, productId: string, categoryId: string, locale: string, fallback: string) {
  return db.features
    .filter((feature) => feature.categoryId === categoryId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((feature) => {
      const name = pickName(
        db.featureTranslations.filter((item) => item.featureId === feature.id),
        locale,
        fallback,
      );
      if (!name) return null;
      const options = db.options
        .filter((option) => option.productId === productId && option.featureId === feature.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((option) => {
          const optionName = pickName(
            db.optionTranslations.filter((item) => item.optionId === option.id),
            locale,
            fallback,
          );
          if (!optionName) return null;
          return {
            id: option.id,
            name: optionName,
            priceDelta: option.priceDelta,
            isDefault: option.isDefault,
          };
        })
        .filter((option): option is NonNullable<typeof option> => option !== null);
      if (options.length === 0) return null;
      return {
        id: feature.id,
        name,
        selection: feature.selection,
        required: feature.isRequired,
        options,
      };
    })
    .filter((feature): feature is NonNullable<typeof feature> => feature !== null);
}

export function previewPublicMenu(locale: string): { ok: true; menu: MenuPayload } | { ok: false; reason: "inactive" } {
  const db = readPreview();
  const active = db.languages.filter((language) => language.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  if (!active.some((language) => language.code === locale)) return { ok: false, reason: "inactive" };
  const fallback = db.settings.defaultLocale;

  const categories = db.categories
    .filter((category) => category.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => {
      const name = pickName(
        db.categoryTranslations.filter((item) => item.categoryId === category.id),
        locale,
        fallback,
      );
      if (!name) return null;
      const products = db.products
        .filter((product) => product.categoryId === category.id && product.isPublished)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((product) => {
          const text = pickCopy(
            db.productTranslations.filter((item) => item.productId === product.id),
            locale,
            fallback,
          );
          if (!text?.name) return null;
          const allergens = db.productAllergens
            .filter((link) => link.productId === product.id)
            .map((link) => {
              const allergen = db.allergens.find((item) => item.code === link.code);
              const allergenName = pickName(
                db.allergenTranslations.filter((item) => item.code === link.code),
                locale,
                fallback,
              );
              if (!allergen || !allergenName) return null;
              return { code: link.code, name: allergenName, sortOrder: allergen.sortOrder };
            })
            .filter((item): item is { code: string; name: string; sortOrder: number } => item !== null)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(({ code, name: allergenName }) => ({ code, name: allergenName }));
          return {
            id: product.id,
            name: text.name,
            description: text.description,
            ingredients: text.ingredients,
            price: product.price,
            imageUrl: menuImageUrl(product.imagePath),
            allergens,
            features: menuFeatures(db, product.id, category.id, locale, fallback),
          };
        })
        .filter((product): product is NonNullable<typeof product> => product !== null);
      if (products.length === 0) return null;
      return { id: category.id, name, products };
    })
    .filter((category): category is NonNullable<typeof category> => category !== null);

  return {
    ok: true,
    menu: {
      restaurantName: db.settings.name,
      showTitle: db.settings.showTitle,
      locale,
      languages: active.map((language) => ({ code: language.code, name: language.name })),
      categories,
    },
  };
}

export function previewDashboard() {
  const db = readPreview();
  return {
    ok: true as const,
    name: db.settings.name,
    showTitle: db.settings.showTitle,
    defaultLocale: db.settings.defaultLocale,
    counts: {
      categories: db.categories.length,
      products: db.products.length,
      languages: db.languages.length,
    },
  };
}

export function previewCategoryList() {
  const db = readPreview();
  const locale = db.settings.defaultLocale;
  return {
    ok: true as const,
    categories: db.categories
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        id: category.id,
        name: pickName(
          db.categoryTranslations.filter((item) => item.categoryId === category.id),
          locale,
          locale,
        ) ?? "Adsız",
        sortOrder: category.sortOrder,
        isPublished: category.isPublished,
      })),
  };
}

export function previewCategoryEditor(id: string) {
  const db = readPreview();
  const category = db.categories.find((item) => item.id === id);
  if (!category) return { ok: true as const, category: null };
  const locale = db.settings.defaultLocale;
  return {
    ok: true as const,
    category: {
      id: category.id,
      name: pickName(
        db.categoryTranslations.filter((item) => item.categoryId === id),
        locale,
        locale,
      ) ?? "",
      isPublished: category.isPublished,
      features: db.features
        .filter((feature) => feature.categoryId === id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((feature) => ({
          id: feature.id,
          name: pickName(
            db.featureTranslations.filter((item) => item.featureId === feature.id),
            locale,
            locale,
          ) ?? "",
          selection: feature.selection,
          required: feature.isRequired,
        })),
    },
  };
}

export function previewProductList() {
  const db = readPreview();
  const locale = db.settings.defaultLocale;
  const products = db.products
    .map((product) => {
      const category = db.categories.find((item) => item.id === product.categoryId);
      return {
        id: product.id,
        name: pickName(
          db.productTranslations.filter((item) => item.productId === product.id).map((item) => ({ locale: item.locale, name: item.name })),
          locale,
          locale,
        ) ?? "Adsız",
        categoryId: product.categoryId,
        categoryName: pickName(
          db.categoryTranslations.filter((item) => item.categoryId === product.categoryId),
          locale,
          locale,
        ) ?? "Kategori",
        categorySort: category?.sortOrder ?? 0,
        sortOrder: product.sortOrder,
        price: product.price,
        isPublished: product.isPublished,
        imageUrl: menuImageUrl(product.imagePath),
        ingredients:
          pickCopy(
            db.productTranslations.filter((item) => item.productId === product.id),
            locale,
            locale,
          )?.ingredients ?? "",
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
  return { ok: true as const, products };
}

export function previewProductOptions() {
  const db = readPreview();
  const locale = db.settings.defaultLocale;
  return {
    ok: true as const,
    categories: db.categories
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        id: category.id,
        name: pickName(
          db.categoryTranslations.filter((item) => item.categoryId === category.id),
          locale,
          locale,
        ) ?? "Adsız",
        features: db.features
          .filter((feature) => feature.categoryId === category.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((feature) => ({
            id: feature.id,
            name: pickName(
              db.featureTranslations.filter((item) => item.featureId === feature.id),
              locale,
              locale,
            ) ?? "Özellik",
            selection: feature.selection,
            required: feature.isRequired,
          })),
      })),
    allergens: db.allergens
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((allergen) => ({
        code: allergen.code,
        name: pickName(
          db.allergenTranslations.filter((item) => item.code === allergen.code),
          locale,
          locale,
        ) ?? allergen.code,
      })),
  };
}

export function previewProductEditor(id: string) {
  const db = readPreview();
  const product = db.products.find((item) => item.id === id);
  if (!product) return { ok: true as const, product: null };
  const locale = db.settings.defaultLocale;
  const text = db.productTranslations.find((item) => item.productId === id && item.locale === locale);
  return {
    ok: true as const,
    product: {
      id: product.id,
      categoryId: product.categoryId,
      name: text?.name ?? "",
      description: text?.description ?? "",
      ingredients: text?.ingredients ?? "",
      price: product.price,
      isPublished: product.isPublished,
      imageUrl: menuImageUrl(product.imagePath),
      allergenCodes: db.productAllergens.filter((item) => item.productId === id).map((item) => item.code),
      options: db.options
        .filter((option) => option.productId === id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((option) => ({
          id: option.id,
          featureId: option.featureId,
          name: pickName(
            db.optionTranslations.filter((item) => item.optionId === option.id),
            locale,
            locale,
          ) ?? "",
          priceDelta: option.priceDelta,
          isDefault: option.isDefault,
        })),
    },
  };
}

export function previewLanguages() {
  const db = readPreview();
  return {
    ok: true as const,
    languages: db.languages
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((language) => ({
        code: language.code,
        name: language.name,
        isDefault: language.isDefault,
        isActive: language.isActive,
      })),
  };
}

export function previewWorkspace(code: string) {
  const db = readPreview();
  const language = db.languages.find((item) => item.code === code);
  if (!language) return { ok: true as const, workspace: null };
  const fallback = db.settings.defaultLocale;
  return {
    ok: true as const,
    workspace: {
      language: {
        code: language.code,
        name: language.name,
        isDefault: language.isDefault,
        isActive: language.isActive,
      },
      defaultLocale: fallback,
      categories: db.categories.map((category) => ({
        id: category.id,
        sourceName: pickName(
          db.categoryTranslations.filter((item) => item.categoryId === category.id),
          fallback,
          fallback,
        ) ?? "",
        name: db.categoryTranslations.find((item) => item.categoryId === category.id && item.locale === code)?.name ?? "",
      })),
      products: db.products
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((product) => {
          const source = db.productTranslations.find((item) => item.productId === product.id && item.locale === fallback);
          const current = db.productTranslations.find((item) => item.productId === product.id && item.locale === code);
          return {
            id: product.id,
            sourceName: source?.name ?? "",
            sourceDescription: source?.description ?? "",
            sourceIngredients: source?.ingredients ?? "",
            name: current?.name ?? "",
            description: current?.description ?? "",
            ingredients: current?.ingredients ?? "",
          };
        }),
      allergens: db.allergens.map((allergen) => ({
        code: allergen.code,
        sourceName: pickName(
          db.allergenTranslations.filter((item) => item.code === allergen.code),
          fallback,
          fallback,
        ) ?? allergen.code,
        name: db.allergenTranslations.find((item) => item.code === allergen.code && item.locale === code)?.name ?? "",
      })),
      features: db.features
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((feature) => ({
          id: feature.id,
          categoryName:
            pickName(
              db.categoryTranslations.filter((item) => item.categoryId === feature.categoryId),
              fallback,
              fallback,
            ) ?? "",
          sourceName:
            db.featureTranslations.find((item) => item.featureId === feature.id && item.locale === fallback)?.name ?? "",
          name: db.featureTranslations.find((item) => item.featureId === feature.id && item.locale === code)?.name ?? "",
        })),
      options: db.options
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((option) => ({
          id: option.id,
          productName:
            db.productTranslations.find((item) => item.productId === option.productId && item.locale === fallback)?.name ?? "",
          featureName:
            db.featureTranslations.find((item) => item.featureId === option.featureId && item.locale === fallback)?.name ?? "",
          sourceName:
            db.optionTranslations.find((item) => item.optionId === option.id && item.locale === fallback)?.name ?? "",
          name: db.optionTranslations.find((item) => item.optionId === option.id && item.locale === code)?.name ?? "",
        })),
    },
  };
}

function syncPreviewFeatures(db: PreviewDb, categoryId: string, drafts: { id: string; name: string; selection: "single" | "multiple"; required: boolean }[]) {
  const locale = db.settings.defaultLocale;
  const kept = new Set<string>();
  drafts.forEach((draft, index) => {
    const existing = draft.id ? db.features.find((feature) => feature.id === draft.id && feature.categoryId === categoryId) : undefined;
    const id = existing?.id ?? randomUUID();
    kept.add(id);
    if (existing) {
      existing.selection = draft.selection;
      existing.isRequired = draft.required;
      existing.sortOrder = index;
    } else {
      db.features.push({ id, categoryId, selection: draft.selection, isRequired: draft.required, sortOrder: index });
    }
    const text = db.featureTranslations.find((item) => item.featureId === id && item.locale === locale);
    if (text) text.name = draft.name;
    else db.featureTranslations.push({ featureId: id, locale, name: draft.name });
  });
  const removed = db.features.filter((feature) => feature.categoryId === categoryId && !kept.has(feature.id)).map((feature) => feature.id);
  const removedOptions = db.options.filter((option) => removed.includes(option.featureId)).map((option) => option.id);
  db.features = db.features.filter((feature) => !removed.includes(feature.id));
  db.featureTranslations = db.featureTranslations.filter((item) => !removed.includes(item.featureId));
  db.options = db.options.filter((option) => !removed.includes(option.featureId));
  db.optionTranslations = db.optionTranslations.filter((item) => !removedOptions.includes(item.optionId));
}

function syncPreviewOptions(
  db: PreviewDb,
  productId: string,
  categoryId: string,
  drafts: { id: string; featureId: string; name: string; priceDelta: number; isDefault: boolean }[],
) {
  const locale = db.settings.defaultLocale;
  const allowed = new Set(db.features.filter((feature) => feature.categoryId === categoryId).map((feature) => feature.id));
  const kept = new Set<string>();
  const sortByFeature = new Map<string, number>();
  for (const draft of drafts) {
    if (!allowed.has(draft.featureId)) continue;
    const existing = draft.id ? db.options.find((option) => option.id === draft.id && option.productId === productId) : undefined;
    const id = existing?.id ?? randomUUID();
    const sortOrder = sortByFeature.get(draft.featureId) ?? 0;
    sortByFeature.set(draft.featureId, sortOrder + 1);
    kept.add(id);
    if (existing) {
      existing.featureId = draft.featureId;
      existing.priceDelta = draft.priceDelta;
      existing.isDefault = draft.isDefault;
      existing.sortOrder = sortOrder;
    } else {
      db.options.push({
        id,
        productId,
        featureId: draft.featureId,
        priceDelta: draft.priceDelta,
        isDefault: draft.isDefault,
        sortOrder,
      });
    }
    const text = db.optionTranslations.find((item) => item.optionId === id && item.locale === locale);
    if (text) text.name = draft.name;
    else db.optionTranslations.push({ optionId: id, locale, name: draft.name });
  }
  const removed = db.options.filter((option) => option.productId === productId && !kept.has(option.id)).map((option) => option.id);
  db.options = db.options.filter((option) => !removed.includes(option.id));
  db.optionTranslations = db.optionTranslations.filter((item) => !removed.includes(item.optionId));
}

export async function previewSaveCategory(formData: FormData): Promise<ActionState> {
  const id = readText(formData, "id");
  const name = readText(formData, "name");
  const isPublished = formData.get("isPublished") === "true";
  if (id && !uuidPattern.test(id)) return { status: "error", message: "Kategori bulunamadı." };
  if (name.length < 1 || name.length > 80) {
    return { status: "error", message: "Kategori adı 1 ile 80 karakter arasında olmalı." };
  }
  const featureResult = readFeatureDrafts(typeof formData.get("featuresJson") === "string" ? String(formData.get("featuresJson")) : "[]");
  if (!featureResult.ok) return { status: "error", message: featureResult.message };
  updatePreview((db) => {
    const locale = db.settings.defaultLocale;
    const categoryId = id || randomUUID();
    if (!id) {
      db.categories.push({ id: categoryId, sortOrder: db.categories.length, isPublished });
    } else {
      const category = db.categories.find((item) => item.id === id);
      if (category) category.isPublished = isPublished;
    }
    const existing = db.categoryTranslations.find((item) => item.categoryId === categoryId && item.locale === locale);
    if (existing) existing.name = name;
    else db.categoryTranslations.push({ categoryId, locale, name });
    syncPreviewFeatures(db, categoryId, featureResult.features);
  });
  redirect("/admin/categories");
}

export function previewMoveCategory(formData: FormData) {
  const id = readText(formData, "id");
  const direction = formData.get("direction") === "down" ? 1 : -1;
  updatePreview((db) => {
    const rows = db.categories.slice().sort((a, b) => a.sortOrder - b.sortOrder);
    const index = rows.findIndex((row) => row.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= rows.length) return;
    const [item] = rows.splice(index, 1);
    rows.splice(target, 0, item);
    rows.forEach((row, sortOrder) => {
      row.sortOrder = sortOrder;
    });
    db.categories = rows;
  });
}

export function previewToggleCategory(formData: FormData) {
  const id = readText(formData, "id");
  const isPublished = formData.get("published") === "true";
  updatePreview((db) => {
    const category = db.categories.find((item) => item.id === id);
    if (category) category.isPublished = isPublished;
  });
}

export async function previewDeleteCategory(id: string): Promise<ActionState> {
  const db = readPreview();
  if (db.products.some((product) => product.categoryId === id)) {
    return { status: "error", message: "Bu kategoride ürün var. Önce ürünleri silin veya başka kategoriye taşıyın." };
  }
  updatePreview((next) => {
    const removedFeatures = next.features.filter((item) => item.categoryId === id).map((item) => item.id);
    const removedOptions = next.options.filter((item) => removedFeatures.includes(item.featureId)).map((item) => item.id);
    next.categories = next.categories.filter((item) => item.id !== id);
    next.categoryTranslations = next.categoryTranslations.filter((item) => item.categoryId !== id);
    next.features = next.features.filter((item) => item.categoryId !== id);
    next.featureTranslations = next.featureTranslations.filter((item) => !removedFeatures.includes(item.featureId));
    next.options = next.options.filter((item) => !removedFeatures.includes(item.featureId));
    next.optionTranslations = next.optionTranslations.filter((item) => !removedOptions.includes(item.optionId));
  });
  redirect("/admin/categories");
}

export async function previewSaveProduct(formData: FormData): Promise<ActionState> {
  const existingId = readText(formData, "id");
  const categoryId = readText(formData, "categoryId");
  const name = readText(formData, "name");
  const description = readText(formData, "description");
  const ingredients = readText(formData, "ingredients");
  const priceResult = readPrice(readText(formData, "price"));
  const isPublished = formData.get("isPublished") === "true";
  const removeImage = formData.get("removeImage") === "true";
  if (existingId && !uuidPattern.test(existingId)) return { status: "error", message: "Ürün bulunamadı." };
  if (!uuidPattern.test(categoryId)) return { status: "error", message: "Kategori seçin." };
  if (name.length < 1 || name.length > 120) {
    return { status: "error", message: "Ürün adı 1 ile 120 karakter arasında olmalı." };
  }
  if (description.length > 2000 || ingredients.length > 2000) {
    return { status: "error", message: "Açıklama ve içindekiler 2000 karakteri aşamaz." };
  }
  if (!priceResult.ok) return { status: "error", message: priceResult.message };

  const file = formData.get("image");
  let imageData: string | null | undefined;
  if (file instanceof File && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) return { status: "error", message: "Görsel 5 MB sınırını aşıyor." };
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return { status: "error", message: "Yalnızca JPEG, PNG veya WebP yüklenebilir." };
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    imageData = `data:${file.type};base64,${bytes.toString("base64")}`;
  } else if (removeImage) {
    imageData = null;
  }

  const db = readPreview();
  if (!db.categories.some((category) => category.id === categoryId)) {
    return { status: "error", message: "Kategori seçin." };
  }
  const allowed = new Set(db.allergens.map((item) => item.code));
  const allergenCodes = formData.getAll("allergens").map(String).filter((code) => allowed.has(code));
  const featureMeta = db.features
    .filter((feature) => feature.categoryId === categoryId)
    .map((feature) => ({ id: feature.id, selection: feature.selection, required: feature.isRequired }));
  const optionResult = readOptionDrafts(
    typeof formData.get("optionsJson") === "string" ? String(formData.get("optionsJson")) : "[]",
    featureMeta,
  );
  if (!optionResult.ok) return { status: "error", message: optionResult.message };

  updatePreview((next) => {
    const id = existingId || randomUUID();
    const current = next.products.find((item) => item.id === id);
    const sameCategory = current?.categoryId === categoryId;
    const sortOrder = current && sameCategory
      ? current.sortOrder
      : next.products.filter((item) => item.categoryId === categoryId).length;
    const imagePath = imageData === undefined ? current?.imagePath ?? null : imageData;
    if (current) {
      current.categoryId = categoryId;
      current.price = priceResult.price;
      current.imagePath = imagePath;
      current.sortOrder = sortOrder;
      current.isPublished = isPublished;
    } else {
      next.products.push({ id, categoryId, price: priceResult.price, imagePath, sortOrder, isPublished });
    }
    const locale = next.settings.defaultLocale;
    const text = next.productTranslations.find((item) => item.productId === id && item.locale === locale);
    if (text) {
      text.name = name;
      text.description = description;
      text.ingredients = ingredients;
    } else {
      next.productTranslations.push({ productId: id, locale, name, description, ingredients });
    }
    next.productAllergens = next.productAllergens.filter((item) => item.productId !== id);
    allergenCodes.forEach((code) => next.productAllergens.push({ productId: id, code }));
    syncPreviewOptions(next, id, categoryId, optionResult.options);
  });
  redirect("/admin/products");
}

export function previewMoveProduct(formData: FormData) {
  const id = readText(formData, "id");
  const categoryId = readText(formData, "categoryId");
  const direction = formData.get("direction") === "down" ? 1 : -1;
  updatePreview((db) => {
    const rows = db.products.filter((item) => item.categoryId === categoryId).sort((a, b) => a.sortOrder - b.sortOrder);
    const index = rows.findIndex((row) => row.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= rows.length) return;
    const [item] = rows.splice(index, 1);
    rows.splice(target, 0, item);
    rows.forEach((row, sortOrder) => {
      row.sortOrder = sortOrder;
    });
  });
}

export function previewToggleProduct(formData: FormData) {
  const id = readText(formData, "id");
  const isPublished = formData.get("published") === "true";
  updatePreview((db) => {
    const product = db.products.find((item) => item.id === id);
    if (product) product.isPublished = isPublished;
  });
}

export async function previewDeleteProduct(id: string): Promise<ActionState> {
  updatePreview((db) => {
    db.products = db.products.filter((item) => item.id !== id);
    db.productTranslations = db.productTranslations.filter((item) => item.productId !== id);
    db.productAllergens = db.productAllergens.filter((item) => item.productId !== id);
    const removedOptions = db.options.filter((item) => item.productId === id).map((item) => item.id);
    db.options = db.options.filter((item) => item.productId !== id);
    db.optionTranslations = db.optionTranslations.filter((item) => !removedOptions.includes(item.optionId));
  });
  redirect("/admin/products");
}

export async function previewAddLanguage(formData: FormData): Promise<ActionState> {
  const code = readText(formData, "code").toLowerCase();
  const name = readText(formData, "name");
  if (!localePattern.test(code)) return { status: "error", message: "Dil kodu tr veya en-gb biçiminde olmalı." };
  if (name.length < 2 || name.length > 40) {
    return { status: "error", message: "Dil adı 2 ile 40 karakter arasında olmalı." };
  }
  const db = readPreview();
  if (db.languages.some((language) => language.code === code)) {
    return { status: "error", message: "Bu dil zaten ekli." };
  }
  updatePreview((next) => {
    next.languages.push({ code, name, isDefault: false, isActive: true, sortOrder: next.languages.length });
  });
  redirect(`/admin/languages/${code}`);
}

export function previewSetLanguageActive(formData: FormData) {
  const code = readText(formData, "code").toLowerCase();
  const isActive = formData.get("active") === "true";
  updatePreview((db) => {
    const language = db.languages.find((item) => item.code === code);
    if (!language || language.isDefault) return;
    language.isActive = isActive;
  });
}

export async function previewDeleteLanguage(code: string): Promise<ActionState> {
  const db = readPreview();
  const language = db.languages.find((item) => item.code === code);
  if (!language) return { status: "error", message: "Dil bulunamadı." };
  if (language.isDefault) return { status: "error", message: "Varsayılan dil silinemez." };
  updatePreview((next) => {
    next.languages = next.languages.filter((item) => item.code !== code);
    next.categoryTranslations = next.categoryTranslations.filter((item) => item.locale !== code);
    next.productTranslations = next.productTranslations.filter((item) => item.locale !== code);
    next.allergenTranslations = next.allergenTranslations.filter((item) => item.locale !== code);
    next.featureTranslations = next.featureTranslations.filter((item) => item.locale !== code);
    next.optionTranslations = next.optionTranslations.filter((item) => item.locale !== code);
  });
  redirect("/admin/languages");
}

export async function previewSaveTranslations(formData: FormData): Promise<ActionState> {
  const code = readText(formData, "locale").toLowerCase();
  const languageName = readText(formData, "languageName");
  if (!localePattern.test(code)) return { status: "error", message: "Dil kodu geçersiz." };
  if (languageName.length < 2 || languageName.length > 40) {
    return { status: "error", message: "Dil adı 2 ile 40 karakter arasında olmalı." };
  }
  const db = readPreview();
  if (!db.languages.some((language) => language.code === code)) {
    return { status: "error", message: "Dil bulunamadı." };
  }
  if (code === db.settings.defaultLocale) {
    for (const category of db.categories) {
      if (readText(formData, `category:${category.id}`).length === 0) {
        return { status: "error", message: "Varsayılan dildeki kategori adları boş bırakılamaz." };
      }
    }
    for (const product of db.products) {
      if (readText(formData, `product:${product.id}:name`).length === 0) {
        return { status: "error", message: "Varsayılan dildeki ürün adları boş bırakılamaz." };
      }
    }
    for (const feature of db.features) {
      if (readText(formData, `feature:${feature.id}`).length === 0) {
        return { status: "error", message: "Varsayılan dildeki özellik adları boş bırakılamaz." };
      }
    }
    for (const option of db.options) {
      if (readText(formData, `option:${option.id}`).length === 0) {
        return { status: "error", message: "Varsayılan dildeki seçenek adları boş bırakılamaz." };
      }
    }
  }
  updatePreview((next) => {
    const language = next.languages.find((item) => item.code === code);
    if (language) language.name = languageName;
    for (const category of next.categories) {
      const name = readText(formData, `category:${category.id}`);
      const existing = next.categoryTranslations.find((item) => item.categoryId === category.id && item.locale === code);
      if (!name) {
        next.categoryTranslations = next.categoryTranslations.filter((item) => !(item.categoryId === category.id && item.locale === code));
      } else if (existing) existing.name = name;
      else next.categoryTranslations.push({ categoryId: category.id, locale: code, name });
    }
    for (const product of next.products) {
      const name = readText(formData, `product:${product.id}:name`);
      const description = readText(formData, `product:${product.id}:description`);
      const ingredients = readText(formData, `product:${product.id}:ingredients`);
      const existing = next.productTranslations.find((item) => item.productId === product.id && item.locale === code);
      if (!name) {
        next.productTranslations = next.productTranslations.filter((item) => !(item.productId === product.id && item.locale === code));
      } else if (existing) {
        existing.name = name;
        existing.description = description;
        existing.ingredients = ingredients;
      } else {
        next.productTranslations.push({ productId: product.id, locale: code, name, description, ingredients });
      }
    }
    for (const allergen of next.allergens) {
      const name = readText(formData, `allergen:${allergen.code}`);
      const existing = next.allergenTranslations.find((item) => item.code === allergen.code && item.locale === code);
      if (!name) {
        next.allergenTranslations = next.allergenTranslations.filter((item) => !(item.code === allergen.code && item.locale === code));
      } else if (existing) existing.name = name;
      else next.allergenTranslations.push({ code: allergen.code, locale: code, name });
    }
    for (const feature of next.features) {
      const featureName = readText(formData, `feature:${feature.id}`);
      const existing = next.featureTranslations.find((item) => item.featureId === feature.id && item.locale === code);
      if (!featureName) {
        next.featureTranslations = next.featureTranslations.filter((item) => !(item.featureId === feature.id && item.locale === code));
      } else if (existing) existing.name = featureName;
      else next.featureTranslations.push({ featureId: feature.id, locale: code, name: featureName });
    }
    for (const option of next.options) {
      const optionName = readText(formData, `option:${option.id}`);
      const existing = next.optionTranslations.find((item) => item.optionId === option.id && item.locale === code);
      if (!optionName) {
        next.optionTranslations = next.optionTranslations.filter((item) => !(item.optionId === option.id && item.locale === code));
      } else if (existing) existing.name = optionName;
      else next.optionTranslations.push({ optionId: option.id, locale: code, name: optionName });
    }
  });
  redirect(`/admin/languages/${code}?saved=1`);
}

export async function previewSaveRestaurantName(formData: FormData): Promise<ActionState> {
  const name = readText(formData, "name");
  if (name.length < 2 || name.length > 80) {
    return { status: "error", message: "Restoran adı 2 ile 80 karakter arasında olmalı." };
  }
  updatePreview((db) => {
    db.settings.name = name;
    db.settings.showTitle = formData.get("showTitle") === "true";
  });
  redirect("/admin?saved=1");
}

export function previewPriceBoard() {
  const db = readPreview();
  const locale = db.settings.defaultLocale;
  return {
    ok: true as const,
    groups: db.categories
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        id: category.id,
        name:
          db.categoryTranslations.find((item) => item.categoryId === category.id && item.locale === locale)?.name ??
          "Kategori",
        products: db.products
          .filter((product) => product.categoryId === category.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((product) => ({
            id: product.id,
            name:
              db.productTranslations.find((item) => item.productId === product.id && item.locale === locale)?.name ??
              "Adsız",
            price: product.price,
            isPublished: product.isPublished,
            options: db.options
              .filter((option) => option.productId === product.id)
              .sort((a, b) => {
                const featureA = db.features.find((feature) => feature.id === a.featureId)?.sortOrder ?? 0;
                const featureB = db.features.find((feature) => feature.id === b.featureId)?.sortOrder ?? 0;
                return featureA - featureB || a.sortOrder - b.sortOrder;
              })
              .map((option) => ({
                id: option.id,
                featureName:
                  db.featureTranslations.find((item) => item.featureId === option.featureId && item.locale === locale)?.name ??
                  "Özellik",
                name:
                  db.optionTranslations.find((item) => item.optionId === option.id && item.locale === locale)?.name ??
                  "Seçenek",
                price: option.priceDelta,
              })),
          })),
      }))
      .filter((group) => group.products.length > 0),
  };
}

export async function previewSavePrices(
  updates: { id: string; price: number }[],
  options: { id: string; price: number }[],
): Promise<ActionState> {
  if (updates.some((item) => item.price < 0) || options.some((item) => item.price < 0)) {
    return { status: "error", message: "Fiyat 0 TL'nin altına inemez." };
  }
  updatePreview((db) => {
    for (const update of updates) {
      const product = db.products.find((item) => item.id === update.id);
      if (product) product.price = update.price;
    }
    for (const update of options) {
      const option = db.options.find((item) => item.id === update.id);
      if (option) option.priceDelta = update.price;
    }
  });
  redirect("/admin/prices?saved=1");
}
