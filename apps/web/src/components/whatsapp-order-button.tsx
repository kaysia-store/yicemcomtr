"use client";

import type { LangCode } from "@/lib/menu/types";
import { buildWhatsAppMessage, getWhatsAppOrderUrl } from "@/lib/cart/whatsapp";
import { useCart } from "@/hooks/use-cart";
import { tUi } from "@/lib/i18n/ui";

type Props = {
  lang: LangCode;
};

export default function WhatsAppOrderButton({ lang }: Props) {
  const { items, totalItems } = useCart();

  const handleClick = () => {
    const message = buildWhatsAppMessage(items, lang);
    const url = getWhatsAppOrderUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      id="whatsappOrderBtn"
      className="whatsapp-order-btn whatsapp-left"
      onClick={handleClick}
      aria-label={tUi(lang, "whatsapp")}
    >
      <i className="fab fa-whatsapp" aria-hidden="true" />
      <span>{tUi(lang, "whatsapp")}</span>
      {totalItems > 0 ? (
        <div className="badge" id="cartBadge">
          {totalItems}
        </div>
      ) : null}
    </button>
  );
}
