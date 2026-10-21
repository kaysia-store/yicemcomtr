"use client";

import { useActionState, useState } from "react";
import { Notice } from "@/components/notice";
import { SubmitButton } from "@/components/submit-button";
import { idleActionState, type ActionState } from "@/lib/types";

export function LoginForm({ action }: { action: (state: ActionState, formData: FormData) => Promise<ActionState> }) {
  const [state, formAction] = useActionState(action, idleActionState);
  const [email, setEmail] = useState("");

  return (
    <form action={formAction} className="grid gap-4">
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="email">
        E-posta
        <input
          autoComplete="username"
          className="field"
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium" htmlFor="password">
        Şifre
        <input autoComplete="current-password" className="field" id="password" name="password" required type="password" />
      </label>
      <SubmitButton pendingLabel="Giriş yapılıyor…">Giriş yap</SubmitButton>
    </form>
  );
}
