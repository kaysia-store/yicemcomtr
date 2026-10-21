"use client";

import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [label, setLabel] = useState("Adresi kopyala");

  return (
    <button
      className="btn btn-secondary"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setLabel("Kopyalandı");
        } catch {
          setLabel("Kopyalanamadı");
        }
      }}
      type="button"
    >
      {label}
    </button>
  );
}
