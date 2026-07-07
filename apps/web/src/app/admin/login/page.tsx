"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin");
      setCheckingSession(false);
    });
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError("Giriş başarısız. E-posta veya şifreyi kontrol edin.");
      return;
    }

    router.replace("/admin");
  };

  if (checkingSession) {
    return (
      <main className="admin-page">
        <p className="admin-muted">Oturum kontrol ediliyor…</p>
      </main>
    );
  }

  return (
    <main className="admin-page admin-login">
      <div className="admin-card">
        <h1>Yi&apos;Cem Admin</h1>
        <p className="admin-muted">Fiyat güncelleme paneli</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            E-posta
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Şifre
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="admin-error">{error}</p> : null}

          <button type="submit" className="admin-button" disabled={loading}>
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>
      </div>
    </main>
  );
}
