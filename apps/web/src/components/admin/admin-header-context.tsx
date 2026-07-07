"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type AdminHeaderSlot = {
  toolbar: ReactNode | null;
};

type AdminHeaderContextValue = {
  slot: AdminHeaderSlot;
  setToolbar: (toolbar: ReactNode | null) => void;
};

const AdminHeaderContext = createContext<AdminHeaderContextValue | null>(null);

export function AdminHeaderSlotProvider({ children }: { children: ReactNode }) {
  const [toolbar, setToolbar] = useState<ReactNode | null>(null);
  const value = useMemo(
    () => ({
      slot: { toolbar },
      setToolbar,
    }),
    [toolbar],
  );
  return <AdminHeaderContext.Provider value={value}>{children}</AdminHeaderContext.Provider>;
}

export function useAdminHeaderSlot() {
  const ctx = useContext(AdminHeaderContext);
  if (!ctx) throw new Error("useAdminHeaderSlot must be used within AdminHeaderSlotProvider");
  return ctx;
}
