export type ActionState = {
  status: "idle" | "error";
  message: string;
};

export const idleActionState: ActionState = { status: "idle", message: "" };

export type LoadFailure = {
  ok: false;
  reason: "setup" | "schema" | "error";
  message?: string;
};

export type MenuAllergen = {
  code: string;
  name: string;
};

export type MenuOption = {
  id: string;
  name: string;
  priceDelta: number;
  isDefault: boolean;
};

export type MenuFeature = {
  id: string;
  name: string;
  selection: "single" | "multiple";
  required: boolean;
  options: MenuOption[];
};

export type MenuProduct = {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  price: number;
  imageUrl: string | null;
  allergens: MenuAllergen[];
  features: MenuFeature[];
};

export type CategoryFeature = {
  id: string;
  name: string;
  selection: "single" | "multiple";
  required: boolean;
};

export type ProductChoice = {
  id: string;
  featureId: string;
  name: string;
  priceDelta: number;
  isDefault: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  products: MenuProduct[];
};

export type MenuPayload = {
  restaurantName: string;
  showTitle: boolean;
  locale: string;
  languages: { code: string; name: string }[];
  categories: MenuCategory[];
};

export type CategoryListItem = {
  id: string;
  name: string;
  sortOrder: number;
  isPublished: boolean;
};

export type ProductListItem = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  isPublished: boolean;
  imageUrl: string | null;
  ingredients: string;
};

export type LanguageItem = {
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
};

export type TranslationWorkspace = {
  language: LanguageItem;
  defaultLocale: string;
  categories: { id: string; sourceName: string; name: string }[];
  products: {
    id: string;
    sourceName: string;
    sourceDescription: string;
    sourceIngredients: string;
    name: string;
    description: string;
    ingredients: string;
  }[];
  allergens: { code: string; sourceName: string; name: string }[];
  features: { id: string; categoryName: string; sourceName: string; name: string }[];
  options: { id: string; productName: string; featureName: string; sourceName: string; name: string }[];
};
