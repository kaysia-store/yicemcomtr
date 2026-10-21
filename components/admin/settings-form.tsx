"use client";

import { useActionState } from "react";
import { Notice } from "@/components/notice";
import { SubmitButton } from "@/components/submit-button";
import { idleActionState, type ActionState } from "@/lib/types";

export function SettingsForm({
  action,
  name,
  showTitle,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  name: string;
  showTitle: boolean;
}) {
  const [state, formAction] = useActionState(action, idleActionState);

  return (
    <form action={formAction} className="grid gap-4">
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="restaurant-name">
        Restoran adı
        <input className="field" defaultValue={name} id="restaurant-name" maxLength={80} name="name" required />
      </label>
      <label className="flex items-center gap-2 text-sm" htmlFor="show-title">
        <input defaultChecked={showTitle} id="show-title" name="showTitle" type="checkbox" value="true" />
        Başlığı göster
      </label>
      <p className="-mt-2 text-sm text-muted">Logo durur. İşaretlenirse restoran adı logonun yanında da görünür.</p>
      <div>
        <SubmitButton>Kaydet</SubmitButton>
      </div>
    </form>
  );
}
