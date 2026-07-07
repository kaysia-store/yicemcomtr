"use client";

import { useEffect } from "react";
import { useAdminHeaderSlot } from "./admin-header-context";

type Props = {
  children: React.ReactNode;
};

export default function AdminHeaderToolbar({ children }: Props) {
  const { setToolbar } = useAdminHeaderSlot();

  useEffect(() => {
    setToolbar(children);
    return () => setToolbar(null);
  }, [children, setToolbar]);

  return null;
}
