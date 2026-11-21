"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { parseIngredients } from "@/lib/cart";
import {
  buildConfigSteps,
  defaultExtraPicks,
  emptyExtraPick,
  ensureNestedDefaults,
  extrasTotal,
  nestedPickKey,
  productExtrasReady,
  productFeaturesReady,
  type ExtraPickState,
} from "@/lib/extra-selection";
import { formatPrice, menuImageFit } from "@/lib/format";
import type { MenuExtra, MenuFeature, MenuProduct } from "@/lib/types";

function defaultSelection(product: MenuProduct) {
  const selected = new Set<string>();
  for (const feature of product.features) {
    const defaults = feature.options.filter((option) => option.isDefault);
    if (feature.selection === "single") {
      const choice = defaults[0] ?? (feature.required ? feature.options[0] : undefined);
      if (choice) selected.add(choice.id);
    } else {
      defaults.forEach((option) => selected.add(option.id));
    }
  }
  return selected;
}

function selectedFeatureExtra(product: MenuProduct, selected: Set<string>) {
  return product.features.reduce(
    (sum, feature) => sum + feature.options.reduce((inner, option) => inner + (selected.has(option.id) ? option.priceDelta : 0), 0),
    0,
  );
}

function FeatureOptions({
  features,
  selected,
  onChoose,
  requiredLabel,
  includedLabel,
}: {
  features: MenuFeature[];
  selected: Set<string>;
  onChoose: (featureId: string, optionId: string, selection: "single" | "multiple") => void;
  requiredLabel: string;
  includedLabel: string;
}) {
  return (
    <>
      {features.map((feature) => (
        <fieldset className="mt-5" key={feature.id}>
          <legend className="text-sm font-medium tracking-wide text-accent uppercase">
            {feature.name}
            {feature.required ? ` · ${requiredLabel}` : ""}
          </legend>
          <div className="mt-2 grid gap-2">
            {feature.options.map((option) => (
              <label
                className="flex items-center justify-between gap-3 rounded-2xl border border-line px-3 py-3 text-sm"
                key={option.id}
              >
                <span className="flex items-center gap-2">
                  <input
                    checked={selected.has(option.id)}
                    name={`feature-${feature.id}`}
                    onChange={() => {
                      if (feature.selection === "single" && !feature.required && selected.has(option.id)) return;
                      onChoose(feature.id, option.id, feature.selection);
                    }}
                    onClick={() => {
                      if (feature.selection === "single" && !feature.required && selected.has(option.id)) {
                        onChoose(feature.id, option.id, feature.selection);
                      }
                    }}
                    type={feature.selection === "single" ? "radio" : "checkbox"}
                  />
                  {option.name}
                </span>
                <span className="shrink-0 tabular-nums text-muted">
                  {option.priceDelta > 0 ? `+${formatPrice(option.priceDelta)}` : includedLabel}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </>
  );
}

function ExtraStep({
  extra,
  pick,
  onChange,
  requiredLabel,
  includedLabel,
}: {
  extra: MenuExtra;
  pick: ExtraPickState;
  onChange: (next: ExtraPickState) => void;
  requiredLabel: string;
  includedLabel: string;
}) {
  const t = useTranslations("Menu");

  function commit(next: ExtraPickState) {
    onChange(ensureNestedDefaults(extra, next));
  }

  if (extra.kind === "fixed") {
    return (
      <label className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-line px-3 py-3 text-sm">
        <span className="flex items-center gap-2">
          <input
            checked={pick.fixedOn}
            onChange={() => onChange({ ...pick, fixedOn: !pick.fixedOn })}
            type="checkbox"
          />
          {extra.name}
          {extra.required ? ` · ${requiredLabel}` : ""}
        </span>
        <span className="shrink-0 tabular-nums text-muted">
          {extra.price > 0 ? `+${formatPrice(extra.price)}` : includedLabel}
        </span>
      </label>
    );
  }

  if (extra.kind === "list") {
    return (
      <fieldset className="mt-5">
        <legend className="text-sm font-medium tracking-wide text-accent uppercase">
          {extra.name}
          {extra.required ? ` · ${requiredLabel}` : ""}
        </legend>
        <div className="mt-2 grid gap-2">
          {extra.choices.map((choice) => (
            <label
              className="flex items-center justify-between gap-3 rounded-2xl border border-line px-3 py-3 text-sm"
              key={choice.id}
            >
              <span className="flex items-center gap-2">
                <input
                  checked={pick.choiceIds.includes(choice.id)}
                  name={`extra-list-${extra.id}`}
                  onChange={() => {
                    if (extra.selection === "single") {
                      const already = pick.choiceIds.length === 1 && pick.choiceIds[0] === choice.id;
                      onChange({
                        ...pick,
                        choiceIds: already && !extra.required ? [] : [choice.id],
                      });
                      return;
                    }
                    const has = pick.choiceIds.includes(choice.id);
                    if (has) {
                      if (extra.required && pick.choiceIds.length === 1) return;
                      onChange({ ...pick, choiceIds: pick.choiceIds.filter((id) => id !== choice.id) });
                    } else {
                      onChange({ ...pick, choiceIds: [...pick.choiceIds, choice.id] });
                    }
                  }}
                  type={extra.selection === "single" ? "radio" : "checkbox"}
                />
                {choice.name}
              </span>
              <span className="shrink-0 tabular-nums text-muted">
                {choice.priceDelta > 0 ? `+${formatPrice(choice.priceDelta)}` : includedLabel}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  // menu
  const showProducts = extra.required || pick.fixedOn || pick.menuProductIds.length > 0;

  return (
    <div className="mt-5">
      <p className="text-sm font-medium tracking-wide text-accent uppercase">
        {extra.name}
        {extra.required ? ` · ${requiredLabel}` : ""}
      </p>
      {!extra.required ? (
        <label className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-line px-3 py-3 text-sm">
          <span className="flex items-center gap-2">
            <input
              checked={pick.fixedOn || pick.menuProductIds.length > 0}
              onChange={() => {
                const on = !(pick.fixedOn || pick.menuProductIds.length > 0);
                commit(on ? { ...pick, fixedOn: true } : emptyExtraPick());
              }}
              type="checkbox"
            />
            {t("addExtra")}
          </span>
          <span className="shrink-0 tabular-nums text-muted">
            {extra.price > 0 ? `+${formatPrice(extra.price)}` : includedLabel}
          </span>
        </label>
      ) : extra.price > 0 ? (
        <p className="mt-1 text-sm tabular-nums text-muted">+{formatPrice(extra.price)}</p>
      ) : null}

      {showProducts ? (
        <div className="mt-3 grid gap-2">
          {extra.menuProducts.map((item) => (
            <label
              className="flex items-center justify-between gap-3 rounded-2xl border border-line px-3 py-3 text-sm"
              key={item.id}
            >
              <span className="flex items-center gap-2">
                <input
                  checked={pick.menuProductIds.includes(item.id)}
                  name={`extra-menu-${extra.id}`}
                  onChange={() => {
                    if (extra.selection === "single") {
                      const already = pick.menuProductIds.length === 1 && pick.menuProductIds[0] === item.id;
                      if (already && !extra.required) {
                        commit({ ...pick, menuProductIds: [], menuOptionIds: [], fixedOn: false, nestedPicks: {} });
                        return;
                      }
                      const keepOptions = item.features.flatMap((feature) =>
                        feature.options.filter((option) => pick.menuOptionIds.includes(option.id)).map((option) => option.id),
                      );
                      commit({
                        ...pick,
                        fixedOn: true,
                        menuProductIds: [item.id],
                        menuOptionIds: keepOptions,
                      });
                      return;
                    }
                    const has = pick.menuProductIds.includes(item.id);
                    if (has) {
                      if (extra.required && pick.menuProductIds.length === 1) return;
                      const removeIds = new Set(
                        item.features.flatMap((feature) => feature.options.map((option) => option.id)),
                      );
                      commit({
                        ...pick,
                        menuProductIds: pick.menuProductIds.filter((id) => id !== item.id),
                        menuOptionIds: pick.menuOptionIds.filter((id) => !removeIds.has(id)),
                        fixedOn: pick.menuProductIds.length > 1,
                      });
                    } else {
                      commit({
                        ...pick,
                        fixedOn: true,
                        menuProductIds: [...pick.menuProductIds, item.id],
                      });
                    }
                  }}
                  type={extra.selection === "single" ? "radio" : "checkbox"}
                />
                {item.name}
              </span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ProductSheet({
  product,
  onClose,
  onAdd,
  closeRef,
  cartEnabled,
}: {
  product: MenuProduct;
  onClose: () => void;
  onAdd: (
    product: MenuProduct,
    optionIds: string[],
    removed: string[],
    quantity: number,
    extraPicks: Record<string, ExtraPickState>,
  ) => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  cartEnabled: boolean;
}) {
  const t = useTranslations("Menu");
  const [selected, setSelected] = useState(() => defaultSelection(product));
  const [extraPicks, setExtraPicks] = useState(() => defaultExtraPicks(product.extras));
  const [removed, setRemoved] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const ingredients = useMemo(() => parseIngredients(product.ingredients), [product.ingredients]);

  const steps = useMemo(() => buildConfigSteps(product, extraPicks), [product, extraPicks]);
  const step = steps[stepIndex] ?? null;
  const isLast = steps.length === 0 || stepIndex >= steps.length - 1;

  useEffect(() => {
    setStepIndex((current) => Math.min(current, Math.max(0, steps.length - 1)));
  }, [steps.length]);

  const total =
    (product.price + selectedFeatureExtra(product, selected) + extrasTotal(product, extraPicks)) * quantity;

  const canProceedFeatures = productFeaturesReady(product, selected);
  const canProceedExtras = productExtrasReady(product, extraPicks);

  function stepReady() {
    if (!step) return canProceedFeatures && canProceedExtras;
    if (step.type === "features") return canProceedFeatures;
    if (step.type === "extra") {
      const extra = product.extras.find((item) => item.id === step.extraId);
      if (!extra) return true;
      const pick = extraPicks[extra.id] ?? emptyExtraPick();
      if (extra.kind === "fixed") return !extra.required || pick.fixedOn;
      if (extra.kind === "list") return !extra.required || pick.choiceIds.length > 0;
      if (extra.kind === "menu") {
        if (!extra.required && !pick.fixedOn && pick.menuProductIds.length === 0) return true;
        return pick.menuProductIds.length > 0;
      }
    }
    if (step.type === "menu-features") {
      const extra = product.extras.find((item) => item.id === step.extraId);
      const menuProduct = extra?.menuProducts.find((item) => item.id === step.productId);
      if (!menuProduct) return true;
      const selectedOpts = new Set(extraPicks[step.extraId]?.menuOptionIds ?? []);
      return menuProduct.features.every((feature) => {
        if (!feature.required) return true;
        return feature.options.some((option) => selectedOpts.has(option.id));
      });
    }
    if (step.type === "menu-extra") {
      const extra = product.extras.find((item) => item.id === step.extraId);
      const menuProduct = extra?.menuProducts.find((item) => item.id === step.productId);
      const nested = menuProduct?.extras.find((item) => item.id === step.nestedExtraId);
      if (!nested) return true;
      const parentPick = extraPicks[step.extraId] ?? emptyExtraPick();
      const nestedPick = parentPick.nestedPicks[nestedPickKey(step.productId, nested.id)] ?? emptyExtraPick();
      if (nested.kind === "fixed") return !nested.required || nestedPick.fixedOn;
      if (nested.kind === "list") return !nested.required || nestedPick.choiceIds.length > 0;
      return true;
    }
    return true;
  }

  function choose(featureId: string, optionId: string, selection: "single" | "multiple", scope: MenuFeature[]) {
    setSelected((current) => {
      const next = new Set(current);
      const feature = scope.find((item) => item.id === featureId) ?? product.features.find((item) => item.id === featureId);
      if (!feature) return current;
      if (selection === "single") {
        const already = next.has(optionId) && feature.options.filter((option) => next.has(option.id)).length === 1;
        for (const option of feature.options) next.delete(option.id);
        if (!(already && !feature.required)) next.add(optionId);
        return next;
      }
      if (next.has(optionId)) {
        if (feature.required && feature.options.filter((option) => next.has(option.id)).length === 1) return current;
        next.delete(optionId);
      } else {
        next.add(optionId);
      }
      return next;
    });
  }

  function chooseMenuFeature(extraId: string, features: MenuFeature[], featureId: string, optionId: string, selection: "single" | "multiple") {
    setExtraPicks((current) => {
      const pick = current[extraId] ?? emptyExtraPick();
      const selectedOpts = new Set(pick.menuOptionIds);
      const feature = features.find((item) => item.id === featureId);
      if (!feature) return current;
      if (selection === "single") {
        const already = selectedOpts.has(optionId) && feature.options.filter((option) => selectedOpts.has(option.id)).length === 1;
        for (const option of feature.options) selectedOpts.delete(option.id);
        if (!(already && !feature.required)) selectedOpts.add(optionId);
      } else if (selectedOpts.has(optionId)) {
        if (feature.required && feature.options.filter((option) => selectedOpts.has(option.id)).length === 1) {
          return current;
        }
        selectedOpts.delete(optionId);
      } else {
        selectedOpts.add(optionId);
      }
      return { ...current, [extraId]: { ...pick, menuOptionIds: [...selectedOpts] } };
    });
  }

  function toggleIngredient(name: string) {
    setRemoved((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  }

  function renderStep() {
    if (!step) return null;
    if (step.type === "features") {
      return (
        <FeatureOptions
          features={product.features}
          includedLabel={t("included")}
          onChoose={(featureId, optionId, selection) => choose(featureId, optionId, selection, product.features)}
          requiredLabel={t("requiredChoice")}
          selected={selected}
        />
      );
    }
    if (step.type === "extra") {
      const extra = product.extras.find((item) => item.id === step.extraId);
      if (!extra) return null;
      return (
        <ExtraStep
          extra={extra}
          includedLabel={t("included")}
          onChange={(next) => setExtraPicks((current) => ({ ...current, [extra.id]: next }))}
          pick={extraPicks[extra.id] ?? emptyExtraPick()}
          requiredLabel={t("requiredChoice")}
        />
      );
    }
    if (step.type === "menu-features") {
      const extra = product.extras.find((item) => item.id === step.extraId);
      const menuProduct = extra?.menuProducts.find((item) => item.id === step.productId);
      if (!extra || !menuProduct) return null;
      const selectedOpts = new Set(extraPicks[extra.id]?.menuOptionIds ?? []);
      return (
        <div>
          <p className="mt-5 text-sm font-medium text-ink">{menuProduct.name}</p>
          <FeatureOptions
            features={menuProduct.features}
            includedLabel={t("included")}
            onChoose={(featureId, optionId, selection) =>
              chooseMenuFeature(extra.id, menuProduct.features, featureId, optionId, selection)
            }
            requiredLabel={t("requiredChoice")}
            selected={selectedOpts}
          />
        </div>
      );
    }
    if (step.type === "menu-extra") {
      const extra = product.extras.find((item) => item.id === step.extraId);
      const menuProduct = extra?.menuProducts.find((item) => item.id === step.productId);
      const nested = menuProduct?.extras.find((item) => item.id === step.nestedExtraId);
      if (!extra || !menuProduct || !nested) return null;
      const parentPick = extraPicks[extra.id] ?? emptyExtraPick();
      const key = nestedPickKey(menuProduct.id, nested.id);
      const nestedPick = parentPick.nestedPicks[key] ?? emptyExtraPick();
      return (
        <div>
          <p className="mt-5 text-sm font-medium text-ink">{menuProduct.name}</p>
          <ExtraStep
            extra={nested}
            includedLabel={t("included")}
            onChange={(next) =>
              setExtraPicks((current) => {
                const currentParent = current[extra.id] ?? emptyExtraPick();
                return {
                  ...current,
                  [extra.id]: {
                    ...currentParent,
                    nestedPicks: { ...currentParent.nestedPicks, [key]: next },
                  },
                };
              })
            }
            pick={nestedPick}
            requiredLabel={t("requiredChoice")}
          />
        </div>
      );
    }
    if (step.type === "ingredients") {
      return (
        <div className="mt-5">
          <h3 className="text-sm font-medium tracking-wide text-accent uppercase">{t("ingredients")}</h3>
          <p className="mt-1 text-xs text-muted">{t("removedHint")}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {ingredients.map((item) => {
              const out = removed.includes(item);
              return (
                <li key={item}>
                  <button
                    className={`rounded-full border px-3 py-1.5 text-sm ${out ? "border-danger/40 text-danger line-through" : "border-line text-ink"}`}
                    onClick={() => toggleIngredient(item)}
                    type="button"
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      <button aria-label={t("close")} className="absolute inset-0 bg-black/60" onClick={onClose} type="button" />
      <div
        aria-labelledby="product-title"
        aria-modal="true"
        className="relative z-10 flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-3xl bg-card sm:rounded-3xl"
        role="dialog"
      >
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className={`mb-4 h-52 w-full rounded-2xl ${menuImageFit(product.imageUrl)}`} src={product.imageUrl} />
          ) : (
            <div className="mb-4 grid h-52 place-items-center overflow-hidden rounded-2xl bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="h-40 w-40 object-contain opacity-70 blur-[2px]" src="/karakter.png" />
            </div>
          )}
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-3xl" id="product-title">
              {product.name}
            </h2>
            <button className="btn btn-secondary shrink-0" onClick={onClose} ref={closeRef} type="button">
              {t("close")}
            </button>
          </div>
          <p className="mt-2 text-lg font-medium text-accent tabular-nums">{formatPrice(total)}</p>
          {product.description ? <p className="mt-4 leading-7 text-ink">{product.description}</p> : null}
          {steps.length > 1 ? (
            <p className="mt-3 text-xs text-muted">
              {stepIndex + 1} / {steps.length}
            </p>
          ) : null}
          {renderStep()}
          {product.allergens.length > 0 && (isLast || steps.length === 0) ? (
            <div className="mt-5">
              <h3 className="text-sm font-medium tracking-wide text-accent uppercase">{t("allergens")}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {product.allergens.map((allergen) => (
                  <li className="rounded-full bg-paper px-3 py-1 text-sm" key={allergen.code}>
                    {allergen.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        {cartEnabled ? (
          <div className="flex items-center gap-3 border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {steps.length > 0 && stepIndex > 0 ? (
              <button className="btn btn-secondary" onClick={() => setStepIndex((value) => Math.max(0, value - 1))} type="button">
                {t("backStep")}
              </button>
            ) : null}
            {!isLast ? (
              <button
                className="btn btn-primary min-w-0 flex-1"
                disabled={!stepReady()}
                onClick={() => {
                  if (!stepReady()) return;
                  setStepIndex((value) => Math.min(steps.length - 1, value + 1));
                }}
                type="button"
              >
                {t("nextStep")}
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <button
                    aria-label={t("decrease")}
                    className="grid size-10 place-items-center rounded-full border border-line"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    type="button"
                  >
                    −
                  </button>
                  <span className="min-w-6 text-center tabular-nums">{quantity}</span>
                  <button
                    aria-label={t("increase")}
                    className="grid size-10 place-items-center rounded-full border border-line"
                    onClick={() => setQuantity((value) => value + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn-primary min-w-0 flex-1"
                  disabled={!canProceedFeatures || !canProceedExtras}
                  onClick={() => {
                    if (!canProceedFeatures || !canProceedExtras) return;
                    onAdd(product, [...selected], removed, quantity, extraPicks);
                  }}
                  type="button"
                >
                  {t("addToCart")} · {formatPrice(total)}
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
