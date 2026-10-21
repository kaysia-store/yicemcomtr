"use client";

import { useActionState } from "react";
import { Notice } from "@/components/notice";
import { SubmitButton } from "@/components/submit-button";
import { idleActionState, type ActionState } from "@/lib/types";

export function ConfirmSubmit({
  action,
  confirm,
  children,
  className = "btn btn-danger",
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  confirm: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, idleActionState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(confirm)) event.preventDefault();
      }}
    >
      <SubmitButton className={className} pendingLabel="Siliniyor…">
        {children}
      </SubmitButton>
      {state.status === "error" ? (
        <span className="mt-1 block">
          <Notice tone="error">{state.message}</Notice>
        </span>
      ) : null}
    </form>
  );
}
