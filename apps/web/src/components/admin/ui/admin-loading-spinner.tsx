type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function AdminLoadingSpinner({ className, size = "md" }: Props) {
  return (
    <img
      src="/karakter2.png"
      alt=""
      width={size === "sm" ? 48 : size === "lg" ? 96 : 72}
      height={size === "sm" ? 48 : size === "lg" ? 96 : 72}
      className={["admin-loading-spinner", `admin-loading-spinner-${size}`, className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
    />
  );
}
