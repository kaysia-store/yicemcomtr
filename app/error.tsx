"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <h1 className="font-serif text-4xl">Bir sorun oluştu</h1>
      <p className="mt-3 text-muted">Sayfa yüklenemedi. Yeniden deneyin.</p>
      <button className="btn btn-primary mt-6" onClick={reset} type="button">
        Yeniden dene
      </button>
    </div>
  );
}
