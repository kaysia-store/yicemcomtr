"use client";

import Link from "next/link";
import LoadingBlock from "@/components/admin/ui/loading-block";
import { useAdminData } from "@/components/admin/providers/admin-data-provider";
import { ADMIN_LANG_LABELS } from "@/lib/admin/types";

export default function LanguagesPage() {
  const { languages, missingTranslations, loading, error } = useAdminData();

  if (loading) {
    return (
      <div className="admin-page">
        <LoadingBlock label="Diller yükleniyor…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <p className="admin-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-toolbar">
        <div>
          <h2 className="admin-page-section-title">Diller</h2>
          <p className="admin-muted">Menüde kullanılan diller ve eksik çeviriler</p>
        </div>
      </div>

      <div className="admin-stat-grid">
        {languages.map((language) => (
          <section key={language.code} className="admin-k-card admin-k-card-padded">
            <div className="admin-k-card-top">
              <p className="admin-k-card-label">{language.flag} {ADMIN_LANG_LABELS[language.code]}</p>
              <span className={`admin-pill ${language.isActive ? "admin-pill-active" : "admin-pill-muted"}`}>
                {language.isActive ? "Aktif" : "Pasif"}
              </span>
            </div>
            <p className="admin-k-card-value admin-k-card-value-sm">{language.code.toUpperCase()}</p>
            {language.isRtl ? <p className="admin-k-card-hint">Sağdan sola (RTL)</p> : null}
          </section>
        ))}
      </div>

      <section className="admin-k-card admin-k-table-card">
        <div className="admin-k-table-head">
          <h3 className="admin-k-section-title">Eksik çeviriler</h3>
          <span className="admin-muted">{missingTranslations.length} kayıt</span>
        </div>
        {missingTranslations.length === 0 ? (
          <p className="admin-muted admin-k-table-empty">Tüm kayıtlarda çeviriler tam görünüyor.</p>
        ) : (
          <div className="admin-k-table-wrap">
            <table className="admin-k-table">
              <thead>
                <tr>
                  <th>Tür</th>
                  <th>Ad</th>
                  <th>Eksik diller</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {missingTranslations.map((item) => (
                  <tr key={`${item.type}-${item.id}`}>
                    <td>{item.type === "category" ? "Kategori" : "Ürün"}</td>
                    <td>{item.name}</td>
                    <td>
                      <div className="admin-lang-missing-list">
                        {item.missingLangs.map((lang) => (
                          <span key={lang} className="admin-pill admin-pill-warning">
                            {lang.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <Link
                        href={item.type === "category" ? "/admin/menu" : `/admin/menu?product=${encodeURIComponent(item.id)}`}
                        className="admin-text-btn"
                      >
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
