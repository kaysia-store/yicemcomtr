"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  addCartLine,
  buildCartLine,
  cartCount,
  emptyCart,
  parseIngredients,
  readCart,
  writeCart,
  whatsappOrderUrl,
  type CartState,
} from "@/lib/cart";
import { formatPrice, menuImageFit } from "@/lib/format";
import { place } from "@/lib/place";
import type { MenuCategory, MenuPayload, MenuProduct } from "@/lib/types";
import { CartSheet } from "@/components/menu/cart-sheet";
import { PwaInstallButton } from "@/components/menu/pwa-install-button";

function categoryUnderHeader(categories: { id: string }[], header: HTMLElement | null) {
  if (categories.length === 0) return "";
  const marker = (header?.getBoundingClientRect().bottom ?? 0) + 12;
  let current = categories[0].id;
  for (const category of categories) {
    const node = document.getElementById(`category-${category.id}`);
    if (node && node.getBoundingClientRect().top <= marker) current = category.id;
  }
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll > 8 && window.scrollY >= maxScroll - 2) return categories[categories.length - 1].id;
  return current;
}

function fold(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
}

function matchesText(text: string, needle: string) {
  const hay = fold(text);
  const words = hay.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (words.some((word) => word.startsWith(needle))) return true;
  if (!needle.includes(" ")) return false;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^\\p{L}\\p{N}])${escaped}`, "u").test(hay);
}

function filterMenu(categories: MenuCategory[], needle: string) {
  if (!needle) return categories;
  return categories.flatMap((category) => {
    if (matchesText(category.name, needle)) return [category];
    const products = category.products.filter((product) =>
      [product.name, product.description, product.ingredients].some((text) => matchesText(text, needle)),
    );
    return products.length > 0 ? [{ ...category, products }] : [];
  });
}

const ALL_CATEGORY = "__all__";

export function MenuBoard({ menu }: { menu: MenuPayload }) {
  const t = useTranslations("Menu");
  const [active, setActive] = useState(ALL_CATEGORY);
  const [selected, setSelected] = useState<MenuProduct | null>(null);
  const [compact, setCompact] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [cart, setCart] = useState<CartState>(emptyCart);
  const [cartReady, setCartReady] = useState(false);
  const [orderNotice, setOrderNotice] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingRef = useRef<string | null>(null);
  const syncRef = useRef<() => void>(() => {});
  const searchScrollRef = useRef(0);
  const restoreScrollRef = useRef<number | null>(null);
  const needle = fold(query.trim());
  const visible = useMemo(() => filterMenu(menu.categories, needle), [menu.categories, needle]);
  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  const showAll = active === ALL_CATEGORY;
  const allProducts = useMemo(() => visible.flatMap((category) => category.products), [visible]);
  const itemCount = cartCount(cart);
  const cartEnabled = menu.orderEnabled || menu.whatsappEnabled;

  useEffect(() => {
    setCart(readCart());
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    writeCart(cart);
  }, [cart, cartReady]);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      if (pendingRef.current === ALL_CATEGORY) return;
      const next = categoryUnderHeader(visibleRef.current, headerRef.current);
      if (pendingRef.current && next === pendingRef.current) pendingRef.current = null;
      if (pendingRef.current || !next) return;
      setActive((current) => {
        if (current === ALL_CATEGORY) return current;
        return current === next ? current : next;
      });
    }
    syncRef.current = update;
    function schedule() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }
    function onScrollEnd() {
      pendingRef.current = null;
      schedule();
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("scrollend", onScrollEnd);
    const header = headerRef.current;
    const resize = new ResizeObserver(schedule);
    if (header) resize.observe(header);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scrollend", onScrollEnd);
      resize.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [menu.categories]);

  useEffect(() => {
    const nav = navRef.current;
    const button = chipRefs.current.get(active);
    if (!nav || !button) return;
    const navRect = nav.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const shown = buttonRect.left >= navRect.left - 1 && buttonRect.right <= navRect.right + 1;
    if (shown) return;
    const delta = buttonRect.left - navRect.left - (navRect.width - buttonRect.width) / 2;
    nav.scrollTo({ left: nav.scrollLeft + delta, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    let last = window.scrollY;
    let accumulated = 0;
    let lockedUntil = 0;
    function apply(next: boolean) {
      setCompact((current) => {
        if (current === next) return current;
        lockedUntil = performance.now() + 400;
        accumulated = 0;
        return next;
      });
    }
    function onScroll() {
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      if (y < 48) {
        accumulated = 0;
        apply(false);
        return;
      }
      if (performance.now() < lockedUntil) return;
      accumulated += delta;
      if (accumulated > 24) apply(true);
      else if (accumulated < -24) apply(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const sync = () => {
      document.documentElement.style.setProperty("--menu-header", `${header.getBoundingClientRect().height}px`);
    };
    sync();
    const resize = new ResizeObserver(sync);
    resize.observe(header);
    return () => resize.disconnect();
  }, [compact, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (restoreScrollRef.current == null) return;
    const y = restoreScrollRef.current;
    restoreScrollRef.current = null;
    window.scrollTo(0, y);
  }, [searchOpen]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape" || selected || languageOpen || cartOpen) return;
      if (searchOpen) {
        event.preventDefault();
        closeSearch();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, selected, languageOpen, cartOpen]);

  function focusCategory(id: string) {
    pendingRef.current = id;
    setActive(id);
    if (id === ALL_CATEGORY) {
      const main = document.getElementById("menu-main");
      if (!main) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const header = headerRef.current?.getBoundingClientRect().height ?? 0;
      const top = window.scrollY + main.getBoundingClientRect().top - header - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      return;
    }
    const node = document.getElementById(`category-${id}`);
    if (!node) return;
    const header = headerRef.current?.getBoundingClientRect().height ?? 0;
    const top = window.scrollY + node.getBoundingClientRect().top - header - 8;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function closeSearch() {
    restoreScrollRef.current = searchScrollRef.current;
    setQuery("");
    setSearchOpen(false);
  }

  function quickAdd(product: MenuProduct) {
    if (product.features.length > 0) {
      setSelected(product);
      return;
    }
    setCart((current) => addCartLine(current, buildCartLine(product, [], [], 1)));
  }

  function addConfigured(product: MenuProduct, optionIds: string[], removed: string[], quantity: number) {
    setCart((current) => addCartLine(current, buildCartLine(product, optionIds, removed, quantity)));
    setSelected(null);
  }

  const navIds = useMemo(() => [ALL_CATEGORY, ...visible.map((category) => category.id)], [visible]);
  const activeIndex = navIds.indexOf(active);
  const previousCategoryId = activeIndex > 0 ? navIds[activeIndex - 1] : undefined;
  const nextCategoryId = activeIndex >= 0 ? navIds[activeIndex + 1] : undefined;

  return (
    <div className="menu-root min-h-dvh w-full">
      <div className="mx-auto min-h-dvh w-full max-w-lg md:max-w-3xl lg:max-w-5xl">
        <header
          className={`sticky top-0 z-20 border-b border-peach-dark/20 bg-peach px-4 text-white [padding-top:env(safe-area-inset-top)] ${compact ? "pb-2" : "pb-3"}`}
          ref={headerRef}
        >
          <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${compact ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
            <div className="min-h-0 overflow-hidden" inert={compact}>
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="h-11 w-auto shrink-0" src="/yicem-logo.png" />
                  <h1 className={menu.showTitle ? "min-w-0 truncate font-serif text-3xl leading-none text-white" : "sr-only"}>
                    {menu.restaurantName}
                  </h1>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <PwaInstallButton className="grid size-11 place-items-center rounded-full border border-white/35 bg-white/15 text-white" />
                  {menu.languages.length > 1 ? (
                    <button
                      aria-expanded={languageOpen}
                      aria-haspopup="dialog"
                      aria-label={t("language")}
                      className="grid size-11 place-items-center rounded-full border border-white/35 bg-white/15 text-white"
                      onClick={() => setLanguageOpen(true)}
                      type="button"
                    >
                      <GlobeIcon />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {menu.categories.length > 0 ? (
            <div className={`flex items-center gap-3 ${searchOpen ? "mt-3" : "mt-2"} ${compact ? "justify-between" : "justify-end"}`}>
              {compact ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" className="h-9 w-auto shrink-0" src="/yicem-logo.png" />
              ) : null}
              {searchOpen ? (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 rounded-full border border-white/35 bg-white px-3 py-2 text-ink">
                    <SearchIcon />
                    <input
                      aria-label={t("searchLabel")}
                      className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t("searchPlaceholder")}
                      ref={searchRef}
                      value={query}
                    />
                    <button aria-label={t("clearSearch")} className="grid size-6 place-items-center text-muted" onClick={closeSearch} type="button">
                      <svg aria-hidden="true" className="size-3.5" fill="none" viewBox="0 0 14 14">
                        <path d="M3 3l8 8M11 3 3 11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  aria-expanded={false}
                  className="flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-2 text-sm text-white"
                  onClick={() => {
                    searchScrollRef.current = window.scrollY;
                    setSearchOpen(true);
                  }}
                  type="button"
                >
                  <SearchIcon />
                  {t("search")}
                </button>
              )}
            </div>
          ) : null}
          {visible.length > 0 ? (
            <div className={`flex items-center gap-1 ${compact ? "mt-1" : "mt-3"}`}>
              <button
                aria-label={t("previousCategory")}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-white/35 bg-white/15 text-white disabled:opacity-30"
                disabled={!previousCategoryId}
                onClick={() => previousCategoryId && focusCategory(previousCategoryId)}
                type="button"
              >
                <CategoryArrow direction="previous" />
              </button>
              <nav aria-label={t("categories")} className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1" ref={navRef}>
                <button
                  aria-current={showAll ? "true" : undefined}
                  className={
                    showAll
                      ? "shrink-0 rounded-full bg-accent px-3 py-2 text-sm text-white"
                      : "shrink-0 rounded-full border border-white/35 bg-white/15 px-3 py-2 text-sm text-white"
                  }
                  onClick={() => focusCategory(ALL_CATEGORY)}
                  ref={(node) => {
                    if (node) chipRefs.current.set(ALL_CATEGORY, node);
                    else chipRefs.current.delete(ALL_CATEGORY);
                  }}
                  type="button"
                >
                  {t("allCategories")}
                </button>
                {visible.map((category) => {
                  const current = !showAll && category.id === active;
                  return (
                    <button
                      aria-current={current ? "true" : undefined}
                      className={
                        current
                          ? "shrink-0 rounded-full bg-accent px-3 py-2 text-sm text-white"
                          : "shrink-0 rounded-full border border-white/35 bg-white/15 px-3 py-2 text-sm text-white"
                      }
                      key={category.id}
                      onClick={() => focusCategory(category.id)}
                      ref={(node) => {
                        if (node) chipRefs.current.set(category.id, node);
                        else chipRefs.current.delete(category.id);
                      }}
                      type="button"
                    >
                      {category.name}
                    </button>
                  );
                })}
              </nav>
              <button
                aria-label={t("nextCategory")}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-white/35 bg-white/15 text-white disabled:opacity-30"
                disabled={!nextCategoryId}
                onClick={() => nextCategoryId && focusCategory(nextCategoryId)}
                type="button"
              >
                <CategoryArrow direction="next" />
              </button>
            </div>
          ) : null}
        </header>

        {languageOpen && menu.languages.length > 1 ? (
          <LanguageDialog
            languages={menu.languages}
            locale={menu.locale}
            onClose={() => {
              rememberLanguage();
              setLanguageOpen(false);
            }}
          />
        ) : null}

        <main className="px-4 py-6" id="menu-main">
          {menu.categories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line px-5 py-12 text-center">
              <h2 className="font-serif text-3xl">{t("emptyTitle")}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{t("emptyBody")}</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line px-5 py-12 text-center">
              <h2 className="font-serif text-3xl">{t("searchEmpty")}</h2>
            </div>
          ) : showAll ? (
            <div className="grid gap-3 md:grid-cols-3">
              {allProducts.map((product) => (
                <ProductCard
                  cartEnabled={cartEnabled}
                  key={product.id}
                  onAdd={() => quickAdd(product)}
                  onOpen={() => setSelected(product)}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-8">
              {visible.map((category) => (
                <section className="scroll-mt-[var(--menu-header)]" id={`category-${category.id}`} key={category.id}>
                  <h2 className="mb-3 font-serif text-2xl">{category.name}</h2>
                  <div className="grid gap-3 md:grid-cols-3">
                    {category.products.map((product) => (
                      <ProductCard
                        cartEnabled={cartEnabled}
                        key={product.id}
                        onAdd={() => quickAdd(product)}
                        onOpen={() => setSelected(product)}
                        product={product}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>

        <footer className="border-t border-line px-4 pt-6 pr-20 pb-[calc(7rem+env(safe-area-inset-bottom))] md:pr-24">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg leading-tight md:text-2xl">{menu.restaurantName}</p>
              <p className="mt-2 text-[10px] tracking-[0.18em] text-accent uppercase md:text-[11px] md:tracking-[0.22em]">{t("address")}</p>
              <address className="mt-1 text-[11px] leading-4 text-ink not-italic md:text-sm md:leading-5" translate="no">
                {place.streetAddress}
                <br />
                {place.district} / {place.city}
              </address>
              <a
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-accent underline-offset-2 hover:underline md:text-sm"
                href={place.mapsUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <PinIcon />
                {t("directions")}
              </a>
            </div>
            <div className="min-w-0 flex-1 text-center">
              <p className="text-[10px] tracking-[0.18em] text-accent uppercase md:text-[11px] md:tracking-[0.22em]">{t("hours")}</p>
              <p className="mt-1 text-[11px] leading-4 text-ink md:text-sm md:leading-5">{t("weekdays")}</p>
              <p className="text-[11px] leading-4 text-ink md:text-sm md:leading-5">{t("weekend")}</p>
            </div>
            <div className="flex shrink-0 flex-col items-center">
              <p className="text-[10px] tracking-[0.18em] text-accent uppercase md:text-[11px] md:tracking-[0.22em]">{t("qrAccess")}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={t("qrAlt")} className="mt-1 size-14 rounded-xl border border-line bg-card p-1 md:size-20 md:rounded-2xl md:p-1.5" src="/qr.png" />
            </div>
          </div>
          <p className="mt-4 text-center text-[11px] text-muted">
            {t("poweredBy")}{" "}
            <a
              className="font-medium text-ink underline-offset-2 hover:underline"
              href="https://kaysia.co"
              rel="noopener noreferrer"
              target="_blank"
            >
              kaysia.co
            </a>
          </p>
        </footer>

        {orderNotice ? (
          <p className="pointer-events-none fixed inset-x-0 top-20 z-40 mx-auto max-w-sm rounded-2xl bg-pine px-4 py-3 text-center text-sm text-white shadow">
            {t("orderReceived")}
          </p>
        ) : null}

        <OrderDock
          cart={cart}
          count={itemCount}
          orderEnabled={menu.orderEnabled}
          whatsappEnabled={menu.whatsappEnabled}
          onOpenCart={() => {
            setCallOpen(false);
            setCartOpen(true);
          }}
          onOpenChange={setCallOpen}
          open={callOpen}
          restaurantName={menu.restaurantName}
        />

        {cartOpen && cartEnabled ? (
          <CartSheet
            cart={cart}
            locale={menu.locale}
            orderEnabled={menu.orderEnabled}
            whatsappEnabled={menu.whatsappEnabled}
            onChange={setCart}
            onClose={() => setCartOpen(false)}
            onOrdered={() => {
              setOrderNotice(true);
              window.setTimeout(() => setOrderNotice(false), 2800);
            }}
            restaurantName={menu.restaurantName}
          />
        ) : null}

        {selected ? (
          <ProductSheet
            cartEnabled={cartEnabled}
            closeRef={closeRef}
            key={selected.id}
            onAdd={addConfigured}
            onClose={() => setSelected(null)}
            product={selected}
          />
        ) : null}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  cartEnabled,
  onOpen,
  onAdd,
}: {
  product: MenuProduct;
  cartEnabled: boolean;
  onOpen: () => void;
  onAdd: () => void;
}) {
  const t = useTranslations("Menu");
  return (
    <div
      className={`relative flex gap-3 rounded-3xl border border-line bg-card p-3 text-start shadow-[0_16px_40px_-28px_rgba(17,17,17,0.35)] ${cartEnabled ? "pb-14" : ""}`}
      id={`product-${product.id}`}
    >
      <button className="flex min-w-0 flex-1 gap-3 text-start" onClick={onOpen} type="button">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-paper">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className={`h-full w-full ${menuImageFit(product.imageUrl)}`} src={product.imageUrl} />
          ) : null}
        </div>
        <span className="min-w-0 flex-1 py-1">
          <span className="flex items-start justify-between gap-3">
            <span className="font-serif text-xl leading-tight break-words">{product.name}</span>
            <span className="shrink-0 text-sm font-medium text-accent tabular-nums">{formatPrice(startingPrice(product))}</span>
          </span>
          {product.description ? (
            <span className="mt-1 line-clamp-2 block text-sm leading-5 text-muted">{product.description}</span>
          ) : null}
          {product.ingredients ? (
            <span className="mt-1 line-clamp-2 block text-sm leading-5 text-muted">{product.ingredients}</span>
          ) : null}
        </span>
      </button>
      {cartEnabled ? (
        <button
          aria-label={t("add")}
          className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-accent text-lg leading-none text-white hover:bg-accent-dark"
          onClick={onAdd}
          type="button"
        >
          +
        </button>
      ) : null}
    </div>
  );
}

function CategoryArrow({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg
      aria-hidden="true"
      className={`size-4 ${direction === "next" ? "rotate-180 rtl:rotate-0" : "rtl:rotate-180"}`}
      fill="none"
      viewBox="0 0 20 20"
    >
      <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function startingPrice(product: MenuProduct) {
  return product.price + selectedExtra(product, defaultSelection(product));
}

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

function selectedExtra(product: MenuProduct, selected: Set<string>) {
  return product.features.reduce(
    (sum, feature) => sum + feature.options.reduce((inner, option) => inner + (selected.has(option.id) ? option.priceDelta : 0), 0),
    0,
  );
}

function ProductSheet({
  product,
  onClose,
  onAdd,
  closeRef,
  cartEnabled,
}: {
  product: MenuProduct;
  onClose: () => void;
  onAdd: (product: MenuProduct, optionIds: string[], removed: string[], quantity: number) => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  cartEnabled: boolean;
}) {
  const t = useTranslations("Menu");
  const [selected, setSelected] = useState(() => defaultSelection(product));
  const [removed, setRemoved] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const ingredients = useMemo(() => parseIngredients(product.ingredients), [product.ingredients]);
  const total = (product.price + selectedExtra(product, selected)) * quantity;

  function choose(featureId: string, optionId: string, selection: "single" | "multiple") {
    setSelected((current) => {
      const next = new Set(current);
      const feature = product.features.find((item) => item.id === featureId);
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

  function toggleIngredient(name: string) {
    setRemoved((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
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
          ) : null}
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
          {product.features.map((feature) => (
            <fieldset className="mt-5" key={feature.id}>
              <legend className="text-sm font-medium tracking-wide text-accent uppercase">
                {feature.name}
                {feature.required ? ` · ${t("requiredChoice")}` : ""}
              </legend>
              <div className="mt-2 grid gap-2">
                {feature.options.map((option) => (
                  <label className="flex items-center justify-between gap-3 rounded-2xl border border-line px-3 py-3 text-sm" key={option.id}>
                    <span className="flex items-center gap-2">
                      <input
                        checked={selected.has(option.id)}
                        name={`feature-${feature.id}`}
                        onChange={() => {
                          if (feature.selection === "single" && !feature.required && selected.has(option.id)) return;
                          choose(feature.id, option.id, feature.selection);
                        }}
                        onClick={() => {
                          if (feature.selection === "single" && !feature.required && selected.has(option.id)) {
                            choose(feature.id, option.id, feature.selection);
                          }
                        }}
                        type={feature.selection === "single" ? "radio" : "checkbox"}
                      />
                      {option.name}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted">
                      {option.priceDelta > 0 ? `+${formatPrice(option.priceDelta)}` : t("included")}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          {ingredients.length > 0 ? (
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
          ) : null}
          {product.allergens.length > 0 ? (
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
              onClick={() => onAdd(product, [...selected], removed, quantity)}
              type="button"
            >
              {t("addToCart")} · {formatPrice(total)}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function rememberLanguage() {
  try {
    localStorage.setItem("yicem-language", "1");
  } catch {
    /* depolama kapalıysa seçim bu oturumda kalır */
  }
}

function LanguageDialog({
  languages,
  locale,
  onClose,
}: {
  languages: MenuPayload["languages"];
  locale: string;
  onClose: () => void;
}) {
  const t = useTranslations("Menu");
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label={t("close")} className="absolute inset-0 bg-black/60" onClick={onClose} type="button" />
      <div
        aria-labelledby="language-title"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg rounded-t-3xl bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-3xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-3xl" id="language-title">
            {t("chooseLanguage")}
          </h2>
          <button className="btn btn-secondary shrink-0" onClick={onClose} ref={closeRef} type="button">
            {t("close")}
          </button>
        </div>
        <ul className="mt-5 grid gap-2">
          {languages.map((language) => {
            const selected = language.code === locale;
            return (
              <li key={language.code}>
                <Link
                  aria-current={selected ? "page" : undefined}
                  className={
                    selected
                      ? "block rounded-2xl bg-accent px-4 py-3 text-base text-white"
                      : "block rounded-2xl border border-line px-4 py-3 text-base text-ink"
                  }
                  href={`/${language.code}`}
                  hrefLang={language.code}
                  lang={language.code}
                  onClick={(event) => {
                    rememberLanguage();
                    if (selected) {
                      event.preventDefault();
                      onClose();
                    }
                  }}
                >
                  {language.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function OrderDock({
  open,
  onOpenChange,
  count,
  cart,
  restaurantName,
  onOpenCart,
  orderEnabled,
  whatsappEnabled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  cart: CartState;
  restaurantName: string;
  onOpenCart: () => void;
  orderEnabled: boolean;
  whatsappEnabled: boolean;
}) {
  const t = useTranslations("Menu");
  const rootRef = useRef<HTMLDivElement>(null);
  const cartEnabled = orderEnabled || whatsappEnabled;
  const whatsappHref = count > 0 ? whatsappOrderUrl(cart, restaurantName) : `https://wa.me/${place.mobileTel.replace(/\D/g, "")}`;

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      const node = rootRef.current;
      if (node && event.target instanceof Node && !node.contains(event.target)) onOpenChange(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div className="pointer-events-none fixed inset-x-0 z-30 bottom-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="relative mx-auto h-0 w-full max-w-lg md:max-w-3xl lg:max-w-5xl">
        <div className="pointer-events-auto absolute right-4 bottom-0 flex flex-col items-end" ref={rootRef}>
          {open ? (
            <div className="mb-2 w-56 rounded-3xl border border-line bg-card p-2 shadow-sm" id="call-choices" role="group" aria-label={t("call")}>
              <a className="block rounded-2xl px-3 py-2.5 text-start hover:bg-paper" href={`tel:${place.landlineTel}`}>
                <span className="block text-xs text-muted">{t("landline")}</span>
                <span className="mt-0.5 block text-base font-medium tabular-nums" dir="ltr">
                  {place.landlineLabel}
                </span>
              </a>
              <a className="mt-1 block rounded-2xl px-3 py-2.5 text-start hover:bg-paper" href={`tel:${place.mobileTel}`}>
                <span className="block text-xs text-muted">{t("mobile")}</span>
                <span className="mt-0.5 block text-base font-medium tabular-nums" dir="ltr">
                  {place.mobileLabel}
                </span>
              </a>
              {whatsappEnabled ? (
                <a className="mt-1 flex items-center gap-2 rounded-2xl px-3 py-2.5 text-start hover:bg-paper" href={whatsappHref} rel="noreferrer" target="_blank">
                  <span className="grid size-8 place-items-center rounded-full bg-[#25D366] text-white">
                    <WhatsAppIcon small />
                  </span>
                  <span className="text-base font-medium">{t("whatsapp")}</span>
                </a>
              ) : null}
              {cartEnabled ? (
                <button className="mt-1 flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-start hover:bg-paper" onClick={onOpenCart} type="button">
                  <span className="relative grid size-8 place-items-center rounded-full bg-accent text-white">
                    <CartIcon small />
                    {count > 0 ? <CountBadge value={count} /> : null}
                  </span>
                  <span className="text-base font-medium">{t("order")}</span>
                </button>
              ) : null}
            </div>
          ) : null}
          <button
            aria-controls="call-choices"
            aria-expanded={open}
            aria-label={open ? t("close") : t("call")}
            className="relative grid size-14 place-items-center rounded-full bg-accent text-white hover:bg-warm"
            onClick={() => onOpenChange(!open)}
            type="button"
          >
            {open ? <CloseIcon /> : <PhoneIcon />}
            {!open && cartEnabled && count > 0 ? <CountBadge value={count} /> : null}
          </button>
        </div>
      </div>
    </div>
  );
}

function CountBadge({ value }: { value: number }) {
  return (
    <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-medium leading-5 text-accent shadow-sm">
      {value > 99 ? "99+" : value}
    </span>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 4c2.2 2.4 3.3 5.1 3.3 8S14.2 19.6 12 20c-2.2-2.4-3.3-5.1-3.3-8S9.8 6.4 12 4Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-4 shrink-0" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m16 16 3.5 3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M8.2 4.8h2.1l1.1 3.1-1.6 1.1a10.8 10.8 0 0 0 4.2 4.2l1.1-1.6 3.1 1.1v2.1c0 .9-.7 1.6-1.6 1.6A13.6 13.6 0 0 1 6.6 6.4c0-.9.7-1.6 1.6-1.6Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 14 14">
      <path d="M3 3l8 8M11 3 3 11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function WhatsAppIcon({ small }: { small?: boolean }) {
  return (
    <svg aria-hidden="true" className={small ? "size-4" : "size-6"} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.82c4.46 0 8.09 3.63 8.09 8.09 0 4.46-3.63 8.09-8.09 8.09-1.42 0-2.81-.37-4.03-1.07l-.29-.17-3.12.82.83-3.04-.19-.31a8.05 8.05 0 0 1-1.23-4.32c0-4.46 3.63-8.09 8.03-8.09Zm4.42 10.58c-.08.21-.45.4-.74.45-.29.05-.5.08-1.62-.34-1.79-.68-2.95-2.45-3.04-2.56-.09-.11-.73-.97-.73-1.85 0-.88.46-1.31.62-1.49.16-.18.35-.23.47-.23h.34c.11 0 .26-.04.4.31.16.37.53 1.29.58 1.38.05.09.08.2 0 .32-.08.13-.13.21-.25.32-.13.11-.27.25-.39.34-.13.09-.26.19-.11.37.16.18.69 1.14 1.48 1.84 1.02.91 1.86 1.2 2.13 1.33.27.13.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.53.72 1.79.85.26.13.43.2.49.31.07.11.07.64-.14.85Z" />
    </svg>
  );
}

function CartIcon({ small }: { small?: boolean }) {
  return (
    <svg aria-hidden="true" className={small ? "size-4" : "size-6"} fill="none" viewBox="0 0 24 24">
      <path d="M4 6h2l1.2 9.2a2 2 0 0 0 2 1.8h7.5a2 2 0 0 0 2-1.6L20 8H7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      <circle cx="10" cy="20" r="1.2" fill="currentColor" />
      <circle cx="17" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}
