"use client";

import { useActionState } from "react";
import { importPreviewMenu } from "@/app/admin/actions/import-menu";
import { Notice } from "@/components/notice";
import { SubmitButton } from "@/components/submit-button";
import { idleActionState } from "@/lib/types";

export function ImportMenuButton() {
  const [state, action] = useActionState(importPreviewMenu, idleActionState);

  return (
    <form
      action={action}
      className="grid gap-3"
      onSubmit={(event) => {
        const accepted = window.confirm(
          "Bu bilgisayardaki menü Supabase'e yazılacak. Kategoriler, ürünler, çeviriler ve seçenekler gider. Görseller bu adımda taşınmaz.",
        );
        if (!accepted) event.preventDefault();
      }}
    >
      <SubmitButton pendingLabel="Aktarılıyor…">Yerel menüyü Supabase'e aktar</SubmitButton>
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
    </form>
  );
}
