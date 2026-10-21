export function Notice({
  tone,
  children,
}: {
  tone: "error" | "ok" | "info";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "error"
      ? "border-danger/30 bg-danger/5 text-danger"
      : tone === "ok"
        ? "border-pine/30 bg-pine/10 text-pine"
        : "border-line bg-card text-muted";

  return (
    <p role={tone === "error" ? "alert" : "status"} className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>
      {children}
    </p>
  );
}
