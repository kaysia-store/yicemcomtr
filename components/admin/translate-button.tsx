"use client";

import { useState } from "react";
import { requestTranslation } from "@/lib/translate/actions";

export function TranslateButton({
  text,
  sourceLocale,
  targetLocale,
  targetId,
}: {
  text: string;
  sourceLocale: string;
  targetLocale: string;
  targetId: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="text-right">
      <button
        className="text-sm font-medium text-accent underline-offset-4 hover:underline disabled:opacity-50"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          const result = await requestTranslation({ text, sourceLocale, targetLocale });
          setPending(false);
          if (!result.ok) {
            setMessage(result.message);
            return;
          }
          const target = document.getElementById(targetId);
          if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            target.value = result.text;
          }
          setMessage(null);
        }}
        type="button"
      >
        {pending ? "Çevriliyor…" : "Çevir"}
      </button>
      {message ? (
        <p className="mt-1 max-w-48 text-xs text-muted" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
