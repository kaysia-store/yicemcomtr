export function LoadingState({ label = "Yükleniyor…" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center text-sm text-muted" role="status">
      {label}
    </div>
  );
}
