import AdminLoadingSpinner from "./admin-loading-spinner";

type Props = {
  label?: string;
};

export default function LoadingBlock({ label = "Yükleniyor…" }: Props) {
  return (
    <div className="admin-loading-block">
      <AdminLoadingSpinner />
      <p className="admin-muted">{label}</p>
    </div>
  );
}
