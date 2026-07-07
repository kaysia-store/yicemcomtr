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
      setError(loadError instanceof Error ? loadError.message : "Dashboard yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading) {
    return <p className="admin-muted">Dashboard yükleniyor…</p>;
  }

  if (error || !stats) {
    return <p className="admin-error">{error ?? "Veri bulunamadı."}</p>;
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Dashboard</h1>
          <p className="admin-muted">Menü özeti ve son değişiklikler</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin/menu" className="admin-button">
            Menüyü Yönet
          </Link>
        </div>
      </div>

      <div className="admin-stats-grid">
        <article className="admin-stat-card">
          <span className="admin-stat-label">Kategoriler</span>
          <strong className="admin-stat-value">{stats.categoryCount}</strong>
          <span className="admin-muted">{stats.hiddenCategoryCount} gizli</span>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-label">Ürünler</span>
          <strong className="admin-stat-value">{stats.productCount}</strong>
          <span className="admin-muted">{stats.activeProductCount} aktif</span>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-label">Ekstralar</span>
          <strong className="admin-stat-value">{stats.modifierCount}</strong>
          <span className="admin-muted">toplam seçenek</span>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-label">Canlı Site</span>
          <strong className="admin-stat-value admin-stat-link">
            <Link href="/">yicem.com.tr</Link>
          </strong>
          <span className="admin-muted">müşteri menüsü</span>
        </article>
      </div>

      <div className="admin-panel admin-panel-wide">
        <div className="admin-section-header">
          <h3>Son Değişiklikler</h3>
          <button type="button" className="admin-button admin-button-secondary" onClick={() => void loadData()}>
            Yenile
          </button>
        </div>

        {auditLogs.length === 0 ? (
          <p className="admin-muted">Henüz kayıtlı değişiklik yok. Menüde düzenleme yaptıkça burada görünür.</p>
        ) : (
          <div className="admin-audit-table-wrap">
            <table className="admin-audit-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>İşlem</th>
                  <th>Özet</th>
                  <th>Kullanıcı</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{formatDate(log.createdAt)}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${log.action}`}>{ACTION_LABELS[log.action]}</span>
                    </td>
                    <td>{log.summary}</td>
                    <td className="admin-muted">{log.userEmail ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
