"use client";

import { useEffect, useState } from "react";

export function ImageField({ currentUrl }: { currentUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(currentUrl);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="grid gap-3">
      <div className="h-36 w-36 overflow-hidden rounded-3xl border border-line bg-paper">
        {preview ? (
          // User-uploaded menu images come from Supabase and local previews.
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="h-full w-full object-cover" src={preview} />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted">Görsel yok</div>
        )}
      </div>
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="product-image">
        Görsel
        <input
          accept="image/jpeg,image/png,image/webp"
          className="text-sm"
          id="product-image"
          name="image"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setPreview(URL.createObjectURL(file));
          }}
          type="file"
        />
      </label>
      {currentUrl ? (
        <label className="flex items-center gap-2 text-sm">
          <input name="removeImage" type="checkbox" value="true" />
          Görseli kaldır
        </label>
      ) : null}
    </div>
  );
}
