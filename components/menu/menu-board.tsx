"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { formatPrice, menuImageFit } from "@/lib/format";
import { place } from "@/lib/place";
import type { MenuCategory, MenuPayload, MenuProduct } from "@/lib/types";

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

export function MenuBoard({ menu }: { menu: MenuPayload }) {
  const t = useTranslations("Menu");
  const [active, setActive] = useState(menu.categories[0]?.id ?? "");
  const [selected, setSelected] = useState<MenuProduct | null>(null);
  const [compact, setCompact] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
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

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const next = categoryUnderHeader(visibleRef.current, headerRef.current);
      if (pendingRef.current && next === pendingRef.current) pendingRef.current = null;
      if (pendingRef.current || !next) return;
      setActive((current) => (current === next ? current : next));
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
    const visible = buttonRect.left >= navRect.left - 1 && buttonRect.right <= navRect.right + 1;
    if (visible) return;
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
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--menu-header");
    };
  }, []);

  useEffect(() => {
    if (visible.length === 0 || visible.some((category) => category.id === active)) return;
    setActive(visible[0].id);
  }, [active, visible]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (menu.languages.length < 2) return;
    try {
      if (!localStorage.getItem("yicem-language")) setLanguageOpen(true);
    } catch {
      /* depolama kapalıysa pencere kendiliğinden açılmaz */
    }
  }, [menu.languages.length]);

  useEffect(() => {
    if (!searchOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape" || selected || languageOpen || callOpen) return;
      restoreScrollRef.current = searchScrollRef.current;
      setQuery("");
      setSearchOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, selected, languageOpen, callOpen]);

  useEffect(() => {
    if (languageOpen || selected) setCallOpen(false);
  }, [languageOpen, selected]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  useEffect(() => {
    if (searchOpen || restoreScrollRef.current === null) {
      syncRef.current();
      return;
    }
    const top = restoreScrollRef.current;
    restoreScrollRef.current = null;
    pendingRef.current = null;
    window.scrollTo({ top, behavior: "auto" });
    syncRef.current();
  }, [needle, searchOpen]);

  function focusCategory(id: string) {
    const section = document.getElementById(`category-${id}`);
    const header = headerRef.current;
    if (!section || !header) return;
    const top = section.getBoundingClientRect().top + window.scrollY - header.getBoundingClientRect().height;
    const aligned = Math.abs(top - window.scrollY) < 2;
    pendingRef.current = aligned ? null : id;
    setActive(id);
    if (!aligned) {
      const token = id;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      window.setTimeout(() => {
        if (pendingRef.current !== token) return;
        pendingRef.current = null;
        syncRef.current();
      }, 900);
    }
  }

  function closeSearch() {
    restoreScrollRef.current = searchScrollRef.current;
    setQuery("");
    setSearchOpen(false);
  }

  const activeIndex = visible.findIndex((category) => category.id === active);
  const previousCategory = activeIndex > 0 ? visible[activeIndex - 1] : undefined;
  const nextCategory = activeIndex >= 0 ? visible[activeIndex + 1] : undefined;

  return (
    <div className="menu-root min-h-dvh w-full">
    <div className="mx-auto min-h-dvh w-full max-w-lg">
      <header
        className={`sticky top-0 z-20 border-b border-line bg-paper/95 px-4 backdrop-blur [padding-top:env(safe-area-inset-top)] ${compact ? "pb-2" : "pb-3"}`}
        ref={headerRef}
      >
        <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${compact ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
          <div className="min-h-0 overflow-hidden" inert={compact}>
            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <span className="inline-flex h-11 shrink-0 items-center rounded-lg bg-ink px-2.5">
                  <img alt="" className="h-7 w-auto" src="/yicem-logo.png" />
                </span>
                <h1 className={menu.showTitle ? "min-w-0 truncate font-serif text-3xl leading-none text-ink" : "sr-only"}>
                  {menu.restaurantName}
                </h1>
              </div>
              {menu.languages.length > 1 ? (
                <button
                  aria-expanded={languageOpen}
                  aria-haspopup="dialog"
                  aria-label={t("language")}
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-card text-ink"
                  onClick={() => setLanguageOpen(true)}
                  type="button"
                >
                  <GlobeIcon />
                </button>
              ) : null}
            </div>
          </div>
        </div>
        {menu.categories.length > 0 ? (
          <div className={`flex items-center gap-3 ${searchOpen ? "mt-3" : "mt-2"} ${compact ? "justify-between" : "justify-end"}`}>
            {compact ? (
              // eslint-disable-next-line @next/next/no-img-element
              <span className="inline-flex h-9 shrink-0 items-center rounded-lg bg-ink px-2">
                <img alt="" className="h-6 w-auto" src="/yicem-logo.png" />
              </span>
            ) : null}
            {searchOpen ? (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 rounded-full border border-line bg-card px-3 py-2">
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
                className="flex items-center gap-2 rounded-full border border-line bg-card px-3 py-2 text-sm text-ink"
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
              className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-card text-ink disabled:opacity-30"
              disabled={!previousCategory}
              onClick={() => previousCategory && focusCategory(previousCategory.id)}
              type="button"
            >
              <CategoryArrow direction="previous" />
            </button>
            <nav aria-label={t("categories")} className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1" ref={navRef}>
              {visible.map((category) => {
                const current = category.id === active;
                return (
                  <button
                    aria-current={current ? "true" : undefined}
                    className={
                      current
                        ? "shrink-0 rounded-full bg-accent px-3 py-2 text-sm text-white"
                        : "shrink-0 rounded-full border border-line bg-card px-3 py-2 text-sm text-ink"
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
              className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-card text-ink disabled:opacity-30"
              disabled={!nextCategory}
              onClick={() => nextCategory && focusCategory(nextCategory.id)}
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

      <main className="px-4 py-6">
        {menu.categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line px-5 py-12 text-center">
            <h2 className="font-serif text-3xl">{t("emptyTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{t("emptyBody")}</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line px-5 py-12 text-center">
            <h2 className="font-serif text-3xl">{t("searchEmpty")}</h2>
          </div>
        ) : (
          <div className="grid gap-8">
            {visible.map((category) => (
              <section className="scroll-mt-[var(--menu-header)]" id={`category-${category.id}`} key={category.id}>
                <h2 className="mb-3 font-serif text-2xl">{category.name}</h2>
                <div className="grid gap-3">
                  {category.products.map((product) => (
                    <button
                      className="flex w-full gap-3 rounded-3xl border border-line bg-card p-3 text-start shadow-[0_16px_40px_-28px_rgba(17,17,17,0.35)]"
                      id={`product-${product.id}`}
                      key={product.id}
                      onClick={() => setSelected(product)}
                      type="button"
                    >
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
                          <span className="mt-1 block text-sm leading-5 text-muted">{product.ingredients}</span>
                        ) : null}
                        {product.allergens.length > 0 ? (
                          <span className="mt-2 block text-xs text-accent">
                            {product.allergens.map((allergen) => allergen.name).join(" · ")}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-line pt-8 pr-20 pl-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <p className="font-serif text-2xl">{menu.restaurantName}</p>
        <p className="mt-4 text-[11px] tracking-[0.22em] text-accent uppercase">{t("address")}</p>
        <address className="mt-2 text-sm leading-6 text-ink not-italic" translate="no">
          {place.streetAddress}
          <br />
          {place.district} / {place.city}
        </address>
        <a className="btn btn-secondary mt-4" href={place.mapsUrl} rel="noopener noreferrer" target="_blank">
          <PinIcon />
          {t("directions")}
        </a>
      </footer>

      <CallDock onOpenChange={setCallOpen} open={callOpen} />

      {selected ? (
        <ProductSheet closeRef={closeRef} key={selected.id} onClose={() => setSelected(null)} product={selected} />
      ) : null}
    </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-4 shrink-0" fill="none" viewBox="0 0 20 20">
      <circle cx="9" cy="9" r="5.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13 13.5 16.5 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
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
  closeRef,
}: {
  product: MenuProduct;
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const t = useTranslations("Menu");
  const [selected, setSelected] = useState(() => defaultSelection(product));
  const total = product.price + selectedExtra(product, selected);

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

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      <button aria-label={t("close")} className="absolute inset-0 bg-black/60" onClick={onClose} type="button" />
      <div
        aria-labelledby="product-title"
        aria-modal="true"
        className="relative z-10 max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-lg sm:rounded-3xl"
        role="dialog"
      >
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
        {product.ingredients ? (
          <div className="mt-5">
            <h3 className="text-sm font-medium tracking-wide text-accent uppercase">{t("ingredients")}</h3>
            <p className="mt-2 leading-7">{product.ingredients}</p>
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

function CallDock({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const t = useTranslations("Menu");
  const rootRef = useRef<HTMLDivElement>(null);

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
      <div className="relative mx-auto h-0 w-full max-w-lg">
        <div className="pointer-events-auto absolute right-4 bottom-0 flex flex-col items-end" ref={rootRef}>
          {open ? (
            <div className="mb-2 w-52 rounded-3xl border border-line bg-card p-2" id="call-choices" role="group" aria-label={t("call")}>
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
            </div>
          ) : null}
          <button
            aria-controls="call-choices"
            aria-expanded={open}
            aria-label={open ? t("close") : t("call")}
            className="grid size-14 place-items-center rounded-full bg-accent text-white hover:bg-warm"
            onClick={() => onOpenChange(!open)}
            type="button"
          >
            {open ? <CloseIcon /> : <PhoneIcon />}
          </button>
        </div>
      </div>
    </div>
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
