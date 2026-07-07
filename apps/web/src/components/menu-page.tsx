"use client";

import { useMemo, useState } from "react";
import type { MenuData, MenuProduct } from "@/lib/menu/types";
import { tLocalized } from "@/lib/menu/i18n";
import { tUi } from "@/lib/i18n/ui";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { CartProvider, useCart } from "@/hooks/use-cart";
import LanguageModal from "@/components/language-modal";
import ProductModal from "@/components/product-modal";
import ThemeToggle from "@/components/theme-toggle";
import WhatsAppOrderButton from "@/components/whatsapp-order-button";

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
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);

  const openProduct = (product: MenuProduct) => setSelectedProduct(product);
  const closeProduct = () => setSelectedProduct(null);

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

  const filtered = useMemo(() => {
    if (activeCategory === "all") return menu.products;
    return menu.products.filter((p) => p.categorySlug === activeCategory);
  }, [menu.products, activeCategory]);

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
            <button className="hero-download-btn" type="button">
              <span>{tUi(lang, "download")}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <div className="categories-wrapper">
            <div className="categories-scroll" id="categoriesScroll">
              {categoryButtons.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  className={`category-btn ${activeCategory === cat.slug ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.slug)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="products">
        <div className="container">
          <div className="products-grid" id="productsGrid">
            {filtered.map((product) => (
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
                    <p className="product-price">{product.price} ₺</p>
                  </div>
                </button>
                <button type="button" className="product-details-btn" onClick={() => openProduct(product)}>
                  {tUi(lang, "details")}
                </button>
              </div>
            ))}
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
