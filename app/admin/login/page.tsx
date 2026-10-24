import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { login } from "@/app/admin/actions/settings";
import { LoginForm } from "@/components/admin/login-form";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Giriş" };

export default function LoginPage() {
  if (!getSupabaseEnv()) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="w-full max-w-md rounded-3xl border border-line bg-card p-6">
        <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Yönetim</p>
        <h1 className="mt-2 font-serif text-4xl">Giriş</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Supabase Authentication bölümünde oluşturduğunuz yönetici hesabıyla giriş yapın. Yerel denemede kullanıcının e-postası onaylı olmalıdır.
        </p>
        <div className="mt-6">
          <LoginForm action={login} />
        </div>
      </section>
    </main>
  );
}
