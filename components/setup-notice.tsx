import Link from "next/link";

export function SetupNotice() {
  return (
    <section className="mx-auto max-w-lg px-5 py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Kurulum</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Supabase bağlantısı gerekli</h1>
      <p className="mt-4 leading-7 text-muted">
        Menü ve yönetim paneli çalışmadan önce proje adresini ve anon anahtarını ekleyin.
      </p>
      <ol className="mt-6 grid list-decimal gap-3 pl-5 leading-6 text-ink">
        <li>
          <code className="rounded bg-card px-1.5 py-0.5">.env.example</code> dosyasını{" "}
          <code className="rounded bg-card px-1.5 py-0.5">.env.local</code> olarak kopyalayıp doldurun.
        </li>
        <li>
          Supabase SQL Editor’da sırayla{" "}
          <code className="rounded bg-card px-1.5 py-0.5">0001_init.sql</code>,{" "}
          <code className="rounded bg-card px-1.5 py-0.5">0002_category_features.sql</code>,{" "}
          <code className="rounded bg-card px-1.5 py-0.5">0003_languages.sql</code> ve{" "}
          <code className="rounded bg-card px-1.5 py-0.5">0004_show_title.sql</code> dosyalarını çalıştırın.
        </li>
        <li>Authentication bölümünden tek bir admin kullanıcısı oluşturun ve yeni kaydı kapatın.</li>
      </ol>
      <Link className="btn btn-primary mt-8" href="/admin/login">
        Yönetim girişi
      </Link>
    </section>
  );
}

export function SchemaNotice({ message }: { message?: string }) {
  return (
    <section className="mx-auto max-w-lg px-5 py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Veritabanı</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Tablolar henüz yok</h1>
      <p className="mt-4 leading-7 text-muted">
        {message ??
          "supabase/migrations klasöründeki SQL dosyalarını 0001’den 0004’e kadar sırayla çalıştırın. Bu işlem menü tablolarını, görsel kovasını, 14 alerjeni ve dil kayıtlarını oluşturur."}
      </p>
    </section>
  );
}
