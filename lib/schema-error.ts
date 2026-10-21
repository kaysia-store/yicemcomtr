import type { LoadFailure } from "@/lib/types";

export function isSchemaError(error: { code?: string; message?: string }) {
  const message = error.message ?? "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    error.code === "PGRST204" ||
    /does not exist|schema cache|could not find the table/i.test(message)
  );
}

export function loadFailure(error: { code?: string; message?: string }): LoadFailure {
  if (isSchemaError(error)) {
    return {
      ok: false,
      reason: "schema",
      message:
        "Veritabanı tabloları bulunamadı. supabase/migrations/0001_init.sql dosyasını SQL Editor'da çalıştırın.",
    };
  }

  return { ok: false, reason: "error", message: "Veriler yüklenemedi." };
}
