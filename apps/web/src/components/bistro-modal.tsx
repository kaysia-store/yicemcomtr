"use client";

import { useEffect } from "react";
import type { LangCode, MenuProduct } from "@/lib/menu/types";
import { tLocalized } from "@/lib/menu/i18n";
import { BISTRO_INTRO_PRODUCT_IDS } from "@/lib/bistro/constants";
import { tUi } from "@/lib/i18n/ui";

type Props = {
  open: boolean;
  lang: LangCode;
  products: MenuProduct[];
  onClose: () => void;
};

export default function BistroModal({ open, lang, products, onClose }: Props) {
  useEffect(() => {
    if (!open) return;

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
  }, [open, onClose]);

  if (!open) return null;

  const introProducts = BISTRO_INTRO_PRODUCT_IDS.map((id) => products.find((product) => product.id === id)).filter(
    (product): product is MenuProduct => Boolean(product),
  );

  return (
    <div
      className="modal show"
      id="bistroModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bistroModalTitle"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-content bistro-modal-content">
        <div className="modal-header">
          <h2 id="bistroModalTitle">{tUi(lang, "cat_bistro")}</h2>
          <button
            className="modal-close"
            id="bistroModalClose"
            type="button"
            aria-label={tUi(lang, "close")}
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="bistro-modal-body">
          <ul className="bistro-product-list">
            {introProducts.map((product) => (
              <li key={product.id}>{tLocalized(product.name, lang)}</li>
            ))}
          </ul>
          <p className="bistro-description">{tUi(lang, "bistro_description")}</p>
        </div>
      </div>
    </div>
  );
}
