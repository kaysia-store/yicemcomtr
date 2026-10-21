import { SchemaNotice, SetupNotice } from "@/components/setup-notice";
import { Notice } from "@/components/notice";

export function LoadError({
  reason,
  message,
}: {
  reason: "setup" | "schema" | "error";
  message?: string;
}) {
  if (reason === "setup") return <SetupNotice />;
  if (reason === "schema") return <SchemaNotice message={message} />;
  return <Notice tone="error">{message ?? "Veriler yüklenemedi."}</Notice>;
}
