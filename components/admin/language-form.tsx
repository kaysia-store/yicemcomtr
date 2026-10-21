"use client";

import { useActionState } from "react";
import { Notice } from "@/components/notice";
import { SubmitButton } from "@/components/submit-button";
import { idleActionState, type ActionState } from "@/lib/types";

export function LanguageForm({
  action,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useActionState(action, idleActionState);

  return (
    <form action={formAction} className="grid gap-4 rounded-3xl border border-line bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      {state.status === "error" ? (
        <div className="sm:col-span-3">
          <Notice tone="error">{state.message}</Notice>
        </div>
      ) : null}
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="language-code">
        Kod
        <input className="field" id="language-code" maxLength={5} name="code" pattern="[a-z]{2}(-[a-z]{2})?" placeholder="en" required />
      </label>
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="language-name">
        Ad
        <input className="field" id="language-name" maxLength={40} name="name" placeholder="English" required />
      </label>
      <SubmitButton>Dil ekle</SubmitButton>
    </form>
  );
}
