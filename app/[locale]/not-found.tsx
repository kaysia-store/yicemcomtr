import Link from "next/link";

export default function LocaleNotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <h1 className="font-serif text-4xl">Bu dilde menü yok</h1>
      <p className="mt-3 text-muted">Dil yayında değil ya da henüz eklenmedi.</p>
      <Link className="btn btn-primary mt-6" href="/tr">
        Türkçe menü
      </Link>
    </div>
  );
}
