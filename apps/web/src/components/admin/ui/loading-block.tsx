type Props = {
  label?: string;
};

export default function LoadingBlock({ label = "Yükleniyor…" }: Props) {
  return (
    <div className="admin-loading-block">
      <span className="material-symbols-outlined admin-loading-icon" aria-hidden>
        progress_activity
      </span>
      <p className="admin-muted">{label}</p>
    </div>
  );
}
