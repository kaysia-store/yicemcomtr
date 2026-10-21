"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div>
      <h1 className="font-serif text-4xl">Bir sorun oluştu</h1>
      <p className="mt-3 text-muted">Bu sayfa yüklenemedi.</p>
      <button className="btn btn-primary mt-6" onClick={reset} type="button">
        Yeniden dene
      </button>
    </div>
  );
}
