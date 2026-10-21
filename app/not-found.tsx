import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <h1 className="font-serif text-4xl">Sayfa bulunamadı</h1>
      <p className="mt-3 text-muted">Aradığınız adres bu menüde yok.</p>
      <Link className="btn btn-primary mt-6" href="/tr">
        Menüye dön
      </Link>
    </div>
  );
}
