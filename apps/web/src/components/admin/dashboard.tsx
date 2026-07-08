"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { loadDashboardData } from "@/lib/admin/dashboard-data";
import type { AuditLogRow } from "@/lib/admin/audit";
import type { DashboardStats } from "@/lib/admin/dashboard-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const ACTION_LABELS: Record<AuditLogRow["action"], string> = {
  create: "Ekleme",
  update: "Güncelleme",
  reorder: "Sıralama",
  delete: "Silme",
};

const ACTION_EMOJI: Record<AuditLogRow["action"], string> = {
  create: "➕",
  update: "✏️",
  reorder: "↕️",
  delete: "🗑️",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const data = await loadDashboardData(supabase);
      setStats(data.stats);
      setAuditLogs(data.auditLogs);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Ana sayfa yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-muted">Ana sayfa yükleniyor…</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="admin-page">
        <p className="admin-error">{error ?? "Veri bulunamadı."}</p>
      </div>
    );
  }

  const activeRate =
    stats.productCount > 0 ? Math.round((stats.activeProductCount / stats.productCount) * 100) : 0;

  const statCards = [
    {
      label: "Kategoriler",
      value: String(stats.categoryCount),
      hint: `${stats.hiddenCategoryCount} gizli`,
      emoji: "📁",
    },
    {
      label: "Ürünler",
      value: String(stats.productCount),
      hint: `${stats.activeProductCount} aktif`,
      emoji: "🍔",
    },
    {
      label: "Alt özellikler",
      value: String(stats.modifierCount),
      hint: "Ekstra / seçenek",
      emoji: "🧩",
    },
    {
      label: "Aktif oranı",
      value: `%${activeRate}`,
      hint: "Ürünlerin aktif payı",
      emoji: "✅",
    },
  ];

  const recentActivity = auditLogs.slice(0, 5);
  const tableLogs = auditLogs.slice(0, 12);

  return (
    <div className="admin-page">
      <div className="admin-welcome">
        <h2 className="admin-welcome-title">Hoş geldiniz</h2>
        <p className="admin-welcome-text">
          <strong>Yi&apos;Cem</strong> menü yönetim paneli. Kategorileri, ürünleri ve alt özellikleri buradan
          düzenleyebilirsiniz.
        </p>
      </div>

      <div className="admin-stat-grid">
        {statCards.map((card) => (
          <section key={card.label} className="admin-k-card">
            <div className="admin-k-card-top">
              <p className="admin-k-card-label">{card.label}</p>
              <span className="admin-k-card-icon" aria-hidden>
                {card.emoji}
              </span>
            </div>
            <p className="admin-k-card-value">{card.value}</p>
            <p className="admin-k-card-hint">{card.hint}</p>
          </section>
        ))}
      </div>

      <div className="admin-two-col">
        <section className="admin-k-card admin-k-card-padded">
          <h3 className="admin-k-section-title">Menü durumu</h3>
          <ul className="admin-summary-list">
            <li>
              <span className="admin-summary-emoji" aria-hidden>
                📁
              </span>
              <div>
                <strong>{stats.categoryCount}</strong>
                <span>kategori kayıtlı</span>
              </div>
            </li>
            <li>
              <span className="admin-summary-emoji" aria-hidden>
                🍔
              </span>
              <div>
                <strong>{stats.productCount}</strong>
                <span>ürün ({stats.activeProductCount} aktif)</span>
              </div>
            </li>
            <li>
              <span className="admin-summary-emoji" aria-hidden>
                🧩
              </span>
              <div>
                <strong>{stats.modifierCount}</strong>
                <span>alt özellik / ekstra</span>
              </div>
            </li>
          </ul>
          <Link href="/admin/menu" className="admin-button admin-button-block">
            Menüyü Yönet
          </Link>
        </section>

        <section className="admin-k-card admin-k-card-padded">
          <div className="admin-k-card-head">
            <h3 className="admin-k-section-title">Son aktiviteler</h3>
            <button type="button" className="admin-text-btn" onClick={() => void loadData()}>
              Yenile
            </button>
          </div>
          {recentActivity.length === 0 ? (
            <p className="admin-muted">Henüz kayıtlı değişiklik yok.</p>
          ) : (
            <ul className="admin-activity-list">
              {recentActivity.map((log) => (
                <li key={log.id} className="admin-activity-item">
                  <span className="admin-activity-icon" aria-hidden>
                    {ACTION_EMOJI[log.action]}
                  </span>
                  <div className="admin-activity-body">
                    <p>{log.summary}</p>
                    <span>
                      {formatDate(log.createdAt)}
                      {log.userEmail ? ` · ${log.userEmail}` : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="admin-k-card admin-k-table-card">
        <div className="admin-k-table-head">
          <h3 className="admin-k-section-title">Değişiklik geçmişi</h3>
          <Link href="/admin/menu" className="admin-text-btn">
            Menüye git
          </Link>
        </div>
        {tableLogs.length === 0 ? (
          <p className="admin-muted admin-k-table-empty">Menüde düzenleme yaptıkça burada görünür.</p>
        ) : (
          <div className="admin-k-table-wrap">
            <table className="admin-k-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>İşlem</th>
                  <th>Özet</th>
                  <th>Kullanıcı</th>
                </tr>
              </thead>
              <tbody>
                {tableLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{formatDate(log.createdAt)}</td>
                    <td>
                      <span className={`admin-pill admin-pill-${log.action}`}>{ACTION_LABELS[log.action]}</span>
                    </td>
                    <td>{log.summary}</td>
                    <td className="admin-muted">{log.userEmail ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-cta-card">
        <p>
          Canlı menünüz <strong>yicem.com.tr</strong> adresinde yayında. Değişiklikler kaydedildikten sonra müşteri
          menüsüne yansır.
        </p>
        <div className="admin-cta-actions">
          <Link href="/" className="admin-button admin-button-secondary">
            Canlı Site
          </Link>
          <Link href="/admin/menu" className="admin-button">
            Menüyü Düzenle
          </Link>
        </div>
      </section>
    </div>
  );
}
