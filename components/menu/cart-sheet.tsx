"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { placeOrder } from "@/app/admin/actions/orders";
import {
  cartTotal,
  customerFullName,
  emptyCart,
  formatCartMoney,
  isMealCardBrandId,
  isValidPhone,
  MEAL_CARD_BRANDS,
  paymentLabel,
  setCartQuantity,
  whatsappOrderUrl,
  type CartState,
  type PaymentMethod,
} from "@/lib/cart";

export function CartSheet({
  cart,
  restaurantName,
  locale,
  orderEnabled,
  whatsappEnabled,
  onChange,
  onClose,
  onOrdered,
}: {
  cart: CartState;
  restaurantName: string;
  locale: string;
  orderEnabled: boolean;
  whatsappEnabled: boolean;
  onChange: (cart: CartState) => void;
  onClose: () => void;
  onOrdered: () => void;
}) {
  const t = useTranslations("Menu");
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const total = cartTotal(cart);
  const canSend = cart.lines.length > 0;
  const checkoutReady =
    Boolean(cart.firstName.trim()) &&
    Boolean(cart.lastName.trim()) &&
    isValidPhone(cart.phone) &&
    cart.address.trim().length >= 5 &&
    (cart.paymentMethod !== "meal_card" || Boolean(cart.mealCardBrand));

  function submitOrder() {
    if (!orderEnabled) return;
    setMessage("");
    startTransition(async () => {
      const result = await placeOrder({
        firstName: cart.firstName,
        lastName: cart.lastName,
        phone: cart.phone,
        paymentMethod: cart.paymentMethod,
        mealCardBrand: cart.mealCardBrand,
        address: cart.address,
        note: cart.note,
        locale,
        lines: cart.lines,
      });
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      onChange(emptyCart);
      onOrdered();
      onClose();
    });
  }

  const showCheckoutFields = orderEnabled || whatsappEnabled;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label={t("close")} className="absolute inset-0 bg-black/60" onClick={onClose} type="button" />
      <div
        aria-labelledby="cart-title"
        aria-modal="true"
        className="relative z-10 flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-3xl bg-card sm:rounded-3xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="font-serif text-3xl" id="cart-title">
            {t("cart")}
          </h2>
          <button className="btn btn-secondary shrink-0" onClick={onClose} ref={closeRef} type="button">
            {t("close")}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {cart.lines.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">{t("cartEmpty")}</p>
          ) : (
            <ul className="grid gap-3">
              {cart.lines.map((line) => (
                <li className="rounded-2xl border border-line px-3 py-3" key={line.key}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium leading-5">{line.name}</p>
                      {line.optionNames.length > 0 ? (
                        <p className="mt-1 text-xs text-muted">{line.optionNames.join(" · ")}</p>
                      ) : null}
                      {line.removedIngredients.length > 0 ? (
                        <p className="mt-1 text-xs text-danger line-through">{line.removedIngredients.join(" · ")}</p>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-sm font-medium text-accent tabular-nums">
                      {formatCartMoney(line.unitPrice * line.quantity)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label={t("decrease")}
                        className="grid size-9 place-items-center rounded-full border border-line bg-paper"
                        onClick={() => onChange(setCartQuantity(cart, line.key, line.quantity - 1))}
                        type="button"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center tabular-nums">{line.quantity}</span>
                      <button
                        aria-label={t("increase")}
                        className="grid size-9 place-items-center rounded-full border border-line bg-paper"
                        onClick={() => onChange(setCartQuantity(cart, line.key, line.quantity + 1))}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                    <button className="text-xs text-danger" onClick={() => onChange(setCartQuantity(cart, line.key, 0))} type="button">
                      {t("remove")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {showCheckoutFields ? (
            <div className="mt-5 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium" htmlFor="cart-first-name">
                  {t("firstName")}
                  <input
                    className="field"
                    id="cart-first-name"
                    onChange={(event) => onChange({ ...cart, firstName: event.target.value })}
                    placeholder={t("firstNamePlaceholder")}
                    value={cart.firstName}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium" htmlFor="cart-last-name">
                  {t("lastName")}
                  <input
                    className="field"
                    id="cart-last-name"
                    onChange={(event) => onChange({ ...cart, lastName: event.target.value })}
                    placeholder={t("lastNamePlaceholder")}
                    value={cart.lastName}
                  />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-medium" htmlFor="cart-phone">
                {t("phone")}
                <input
                  autoComplete="tel"
                  className="field"
                  id="cart-phone"
                  inputMode="tel"
                  onChange={(event) => onChange({ ...cart, phone: event.target.value })}
                  placeholder={t("phonePlaceholder")}
                  value={cart.phone}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium" htmlFor="cart-payment">
                {t("paymentMethod")}
                <select
                  className="field"
                  id="cart-payment"
                  onChange={(event) => {
                    const paymentMethod = event.target.value as PaymentMethod;
                    onChange({
                      ...cart,
                      paymentMethod,
                      mealCardBrand: paymentMethod === "meal_card" ? cart.mealCardBrand || "multinet" : "",
                    });
                  }}
                  value={cart.paymentMethod}
                >
                  <option value="cash">{t("payCash")}</option>
                  <option value="card">{t("payCard")}</option>
                  <option value="meal_card">{t("payMealCard")}</option>
                </select>
              </label>
              {cart.paymentMethod === "meal_card" ? (
                <label className="grid gap-1.5 text-sm font-medium" htmlFor="cart-meal-brand">
                  {t("mealCardBrand")}
                  <select
                    className="field"
                    id="cart-meal-brand"
                    onChange={(event) =>
                      onChange({
                        ...cart,
                        mealCardBrand: isMealCardBrandId(event.target.value) ? event.target.value : "",
                      })
                    }
                    value={cart.mealCardBrand}
                  >
                    {MEAL_CARD_BRANDS.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <label className="grid gap-1.5 text-sm font-medium" htmlFor="cart-address">
                {t("deliveryAddress")}
                <textarea
                  className="field min-h-20 resize-y"
                  id="cart-address"
                  onChange={(event) => onChange({ ...cart, address: event.target.value })}
                  placeholder={t("deliveryAddressPlaceholder")}
                  value={cart.address}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium" htmlFor="cart-note">
                {t("orderNote")}
                <textarea
                  className="field min-h-20 resize-y"
                  id="cart-note"
                  onChange={(event) => onChange({ ...cart, note: event.target.value })}
                  placeholder={t("orderNotePlaceholder")}
                  value={cart.note}
                />
              </label>
            </div>
          ) : null}
          {message ? <p className="mt-3 text-sm text-danger">{message}</p> : null}
        </div>

        <div className="border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-sm text-muted">{t("total")}</span>
            <span className="text-lg font-medium text-accent tabular-nums">{formatCartMoney(total)}</span>
          </div>
          {showCheckoutFields && customerFullName(cart) ? (
            <p className="mb-3 text-xs text-muted">
              {customerFullName(cart)}
              {cart.phone ? ` · ${cart.phone}` : ""}
            </p>
          ) : null}
          <div className="grid gap-2">
            {orderEnabled ? (
              <button className="btn btn-primary w-full" disabled={!canSend || pending || !checkoutReady} onClick={submitOrder} type="button">
                {pending ? t("sendingOrder") : t("placeOrder")}
              </button>
            ) : null}
            {whatsappEnabled ? (
              <a
                aria-disabled={!canSend}
                className={`btn ${orderEnabled ? "btn-secondary" : "btn-primary"} w-full ${canSend ? "" : "pointer-events-none opacity-50"}`}
                href={canSend ? whatsappOrderUrl(cart, restaurantName) : undefined}
                rel="noreferrer"
                target="_blank"
              >
                {t("sendWhatsApp")}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
