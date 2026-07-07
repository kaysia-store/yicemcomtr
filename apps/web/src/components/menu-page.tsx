"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MenuData, MenuProduct } from "@/lib/menu/types";
import { tLocalized } from "@/lib/menu/i18n";
import { getProductCardDescription } from "@/lib/menu/product-display";
import { tUi } from "@/lib/i18n/ui";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { CartProvider, useCart } from "@/hooks/use-cart";
import LanguageModal from "@/components/language-modal";
import ProductModal from "@/components/product-modal";
import ThemeToggle from "@/components/theme-toggle";
import WhatsAppOrderButton from "@/components/whatsapp-order-button";
import HeroInstallButton from "@/components/hero-install-button";
import BistroModal from "@/components/bistro-modal";
import { BISTRO_CATEGORY_SLUG } from "@/lib/bistro/constants";

type Props = {
  menu: MenuData;
};

export default function MenuPage({ menu }: Props) {
  return (
    <CartProvider>
      <MenuPageContent menu={menu} />
    </CartProvider>
  );
}

function MenuPageContent({ menu }: Props) {
  const { lang, flag, languageModalOpen, selectLanguage, openLanguageModal, closeLanguageModal } = useLanguage();
  const { isLight, setLightTheme } = useTheme();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [bistroModalOpen, setBistroModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const categoryButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateCategoryScrollState = useCallback(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 2);
    setCanScrollNext(el.scrollLeft < maxScroll - 2);
  }, []);

  const scrollCategoryIntoViewIfNeeded = useCallback((slug: string) => {
    const container = categoryScrollRef.current;
    const button = categoryButtonRefs.current.get(slug);
    if (!container || !button) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const fullyVisible =
      buttonRect.left >= containerRect.left - 2 && buttonRect.right <= containerRect.right + 2;

    if (!fullyVisible) {
      button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, []);

  const scrollCategoriesByPage = useCallback((direction: -1 | 1) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.85, 160);
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  const categoryButtons = useMemo(
    () => [
      { slug: "all", label: tUi(lang, "all_categories") },
      ...menu.categories.map((c) => ({
        slug: c.slug,
        label: tLocalized(c.name, lang),
      })),
    ],
    [menu.categories, lang],
  );

  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;

    updateCategoryScrollState();

    const onScroll = () => updateCategoryScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateCategoryScrollState);

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateCategoryScrollState) : null;
    observer?.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateCategoryScrollState);
      observer?.disconnect();
    };
  }, [updateCategoryScrollState, categoryButtons.length]);

  const openProduct = (product: MenuProduct) => setSelectedProduct(product);
  const closeProduct = () => setSelectedProduct(null);

  const selectCategory = (slug: string) => {
    if (slug === BISTRO_CATEGORY_SLUG) {
      setActiveCategory(BISTRO_CATEGORY_SLUG);
      setBistroModalOpen(true);
      requestAnimationFrame(() => scrollCategoryIntoViewIfNeeded(slug));
      return;
    }

    setActiveCategory(slug);
    setFilterCategory(slug);
    requestAnimationFrame(() => scrollCategoryIntoViewIfNeeded(slug));
  };

  const closeBistroModal = () => {
    setBistroModalOpen(false);
    setFilterCategory(BISTRO_CATEGORY_SLUG);
  };

  const filtered = useMemo(() => {
    if (filterCategory === "all") return menu.products;
    return menu.products.filter((p) => p.categorySlug === filterCategory);
  }, [menu.products, filterCategory]);

  return (
    <>
      <header className="header" id="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <a href="/" aria-label="Yi'Cem Restoran">
                <img src="/logo.png" alt="Yi'Cem Restoran" />
              </a>
            </div>
            <div className="header-actions">
              <ThemeToggle
                isLight={isLight}
                label={tUi(lang, "toggle_theme")}
                onChange={setLightTheme}
              />
              <button
                className="language-toggle"
                type="button"
                aria-label={tUi(lang, "select_language")}
                onClick={openLanguageModal}
              >
                <span className="current-flag">{flag}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{tUi(lang, "hero_title")}</h1>
            <p className="hero-subtitle">{tUi(lang, "hero_subtitle")}</p>
            <HeroInstallButton lang={lang} />
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <div className="categories-wrapper">
            <button
              type="button"
              className="category-nav-btn"
              aria-label={tUi(lang, "categories_scroll_prev")}
              disabled={!canScrollPrev}
              onClick={() => scrollCategoriesByPage(-1)}
            >
              <i className="fas fa-chevron-left" aria-hidden />
            </button>
            <div className="categories-scroll" id="categoriesScroll" ref={categoryScrollRef}>
              {categoryButtons.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  ref={(node) => {
                    if (node) categoryButtonRefs.current.set(cat.slug, node);
                    else categoryButtonRefs.current.delete(cat.slug);
                  }}
                  className={`category-btn ${activeCategory === cat.slug ? "active" : ""}`}
                  onClick={() => selectCategory(cat.slug)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="category-nav-btn"
              aria-label={tUi(lang, "categories_scroll_next")}
              disabled={!canScrollNext}
              onClick={() => scrollCategoriesByPage(1)}
            >
              <i className="fas fa-chevron-right" aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <section className="products">
        <div className="container">
          <div className="products-grid" id="productsGrid">
            {filtered.map((product) => {
              const cardDescription = getProductCardDescription(product, lang);
              return (
              <div key={product.id} className="product-card" data-category={product.categorySlug}>
                <button
                  type="button"
                  className="product-card-open"
                  onClick={() => openProduct(product)}
                  aria-label={`${tLocalized(product.name, lang)} — ${tUi(lang, "details")}`}
                >
                  <div className="product-image-container">
                    <img
                      src={product.image || "/favicon.png"}
                      alt={tLocalized(product.name, lang)}
                      className="product-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{tLocalized(product.name, lang)}</h3>
                    {cardDescription ? (
                      <p className="product-description">{cardDescription}</p>
                    ) : null}
                    <p className="product-price">{product.price} ₺</p>
                  </div>
                </button>
                <button type="button" className="product-details-btn" onClick={() => openProduct(product)}>
                  {tUi(lang, "details")}
                </button>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>{tUi(lang, "contact")}</h3>
              <p>
                <a
                  href="https://maps.google.com/?q=Fener+Mah.+1968+Sk.+No:+21/A+Muratpaşa/ANTALYA"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tUi(lang, "address")}
                </a>
              </p>
              <p>
                <a href="tel:+902423231177">{tUi(lang, "phone")}</a>
              </p>
              <p>
                <a href="mailto:info@yicem.com">{tUi(lang, "email")}</a>
              </p>
            </div>
            <div className="footer-section qr-section">
              <h3>{tUi(lang, "qr_fast_access")}</h3>
              <div className="qr-code">
                <img src="/qr.png" alt={tUi(lang, "qr_alt")} className="qr-image" />
              </div>
            </div>
            <div className="footer-section hours-section">
              <h3>{tUi(lang, "hours")}</h3>
              <p>{tUi(lang, "weekdays")}</p>
              <p>{tUi(lang, "weekend")}</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} Yi&apos;Cem Restoran. {tUi(lang, "all_rights")} Powered by{" "}
              <a href="https://kaysia.co" target="_blank" rel="noopener noreferrer">
                Kaysia.co
              </a>
            </p>
            <p style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "0.5rem" }}>
              {tUi(lang, "data_source")}:{" "}
              {menu.source === "supabase" ? tUi(lang, "data_source_supabase") : tUi(lang, "data_source_json")}
            </p>
          </div>
        </div>
      </footer>

      <a href="tel:+905412429007" className="phone-btn" rel="noopener noreferrer">
        <span>{tUi(lang, "call_now")}</span>
      </a>

      <WhatsAppOrderButton lang={lang} />

      <BistroModal
        open={bistroModalOpen}
        lang={lang}
        products={menu.products}
        onClose={closeBistroModal}
      />

      <LanguageModal
        open={languageModalOpen}
        lang={lang}
        onSelect={selectLanguage}
        onClose={closeLanguageModal}
      />
      <ProductModal
        product={selectedProduct}
        lang={lang}
        onClose={closeProduct}
        onAddToCart={addItem}
      />
    </>
  );
}
