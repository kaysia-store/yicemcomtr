"use client";

import { useEffect, useMemo, useState } from "react";
import type { LangCode, MenuProduct } from "@/lib/menu/types";
import { tLocalized } from "@/lib/menu/i18n";
import {
  formatModifierPrice,
  getProductContents,
  getProductModifierGroups,
} from "@/lib/menu/product-display";
import { buildCartItemInput } from "@/lib/cart/build-cart-item";
import type { CartItemInput } from "@/lib/cart/types";
import { tUi } from "@/lib/i18n/ui";

const donerCategories = ["tavuk-doner", "et-doner"];

type Props = {
  product: MenuProduct | null;
  lang: LangCode;
  onClose: () => void;
  onAddToCart: (item: CartItemInput) => void;
};

function createInitialSelections(product: MenuProduct, lang: LangCode) {
  const groups = getProductModifierGroups(product, lang);
  const radioSelections: Record<string, string> = {};
  const checkboxSelections: Record<string, string[]> = {};

  for (const group of groups) {
    if (group.inputType === "radio" && group.items[0]) {
      radioSelections[group.key] = group.items[0].id;
    } else {
      checkboxSelections[group.key] = [];
    }
  }

  const contents = getProductContents(product, lang);
  const showRemovable =
    contents.length > 0 && !donerCategories.includes(product.categorySlug);

  return {
    radioSelections,
    checkboxSelections,
    includedIngredients: showRemovable ? new Set(contents) : new Set<string>(),
  };
}

export default function ProductModal({ product, lang, onClose, onAddToCart }: Props) {
  const [radioSelections, setRadioSelections] = useState<Record<string, string>>({});
  const [checkboxSelections, setCheckboxSelections] = useState<Record<string, string[]>>({});
  const [includedIngredients, setIncludedIngredients] = useState<Set<string>>(new Set());
  const [orderFeedback, setOrderFeedback] = useState(false);

  const modifierGroups = useMemo(
    () => (product ? getProductModifierGroups(product, lang) : []),
    [product, lang],
  );

  useEffect(() => {
    if (!product) return;

    const initial = createInitialSelections(product, lang);
    setRadioSelections(initial.radioSelections);
    setCheckboxSelections(initial.checkboxSelections);
    setIncludedIngredients(initial.includedIngredients);
    setOrderFeedback(false);
  }, [product, lang]);

  useEffect(() => {
    if (!product) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const contents = getProductContents(product, lang);
  const showRemovableIngredients =
    contents.length > 0 && !donerCategories.includes(product.categorySlug);

  const cartItemInput = buildCartItemInput(
    product,
    lang,
    modifierGroups,
    radioSelections,
    checkboxSelections,
    includedIngredients,
  );

  const toggleIngredient = (ingredient: string, included: boolean) => {
    setIncludedIngredients((current) => {
      const next = new Set(current);
      if (included) next.add(ingredient);
      else next.delete(ingredient);
      return next;
    });
  };

  const handleRadioChange = (groupKey: string, modifierId: string) => {
    setRadioSelections((current) => ({ ...current, [groupKey]: modifierId }));
  };

  const handleCheckboxChange = (groupKey: string, modifierId: string, checked: boolean) => {
    setCheckboxSelections((current) => {
      const selected = new Set(current[groupKey] ?? []);
      if (checked) selected.add(modifierId);
      else selected.delete(modifierId);
      return { ...current, [groupKey]: Array.from(selected) };
    });
  };

  const handleOrder = () => {
    onAddToCart(cartItemInput);
    setOrderFeedback(true);
    window.setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-labelledby="productModalTitle"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-content product-modal-content">
        <div className="modal-header">
          <h2 id="productModalTitle">{tUi(lang, "product_details")}</h2>
          <button className="modal-close" type="button" aria-label={tUi(lang, "close")} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="product-modal-body">
          <div className="product-modal-image">
            <img
              src={product.image || "/favicon.png"}
              alt={tLocalized(product.name, lang)}
              className="modal-product-image"
            />
          </div>

          <div className="product-modal-info">
            <h3>{tLocalized(product.name, lang)}</h3>

            <div className="product-modal-price">
              <span>₺{product.price}</span>
            </div>

            {showRemovableIngredients ? (
              <div className="ingredients-list">
                <h4>{tUi(lang, "ingredients")}</h4>
                <div className="chips">
                  {contents.map((item) => (
                    <label key={item} className="chip">
                      <input
                        type="checkbox"
                        checked={includedIngredients.has(item)}
                        onChange={(event) => toggleIngredient(item, event.target.checked)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : contents.length > 0 ? (
              <div className="ingredients-list">
                <h4>{tUi(lang, "ingredients")}</h4>
                <p className="product-ingredients">{contents.join(", ")}</p>
              </div>
            ) : null}

            {modifierGroups.length > 0 ? (
              <div className="extras-groups">
                <h4>{tUi(lang, "extras")}</h4>
                {modifierGroups.map((group) => (
                  <div key={group.key} className="extra-group">
                    <h5>{group.title}</h5>
                    <div className="extra-options">
                      {group.items.map((item) => {
                        const priceLabel = formatModifierPrice(item.price);
                        const inputName = `extra_${group.key}`;

                        if (group.inputType === "radio") {
                          return (
                            <label key={item.id} className="option-row">
                              <span>
                                <input
                                  type="radio"
                                  name={inputName}
                                  value={item.id}
                                  checked={radioSelections[group.key] === item.id}
                                  onChange={() => handleRadioChange(group.key, item.id)}
                                />{" "}
                                {tLocalized(item.label, lang)}
                              </span>
                              {priceLabel ? <span className="option-price">{priceLabel}</span> : null}
                            </label>
                          );
                        }

                        return (
                          <label key={item.id} className="option-row">
                            <span>
                              <input
                                type="checkbox"
                                value={item.id}
                                checked={(checkboxSelections[group.key] ?? []).includes(item.id)}
                                onChange={(event) =>
                                  handleCheckboxChange(group.key, item.id, event.target.checked)
                                }
                              />{" "}
                              {tLocalized(item.label, lang)}
                            </span>
                            {priceLabel ? <span className="option-price">{priceLabel}</span> : null}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="modal-total">
              <span>{tUi(lang, "total")}</span>
              <strong>₺{cartItemInput.unitPrice.toFixed(2)}</strong>
            </div>

            <div className="product-modal-actions">
              <button
                type="button"
                className={`cta-button ${orderFeedback ? "is-success" : ""}`}
                onClick={handleOrder}
              >
                {orderFeedback ? tUi(lang, "added_to_cart") : tUi(lang, "order_now")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
