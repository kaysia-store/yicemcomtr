"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type OrdersLiveValue = {
  newCount: number;
  setNewCount: (count: number) => void;
  live: boolean;
  setLive: (live: boolean) => void;
};

const OrdersLiveContext = createContext<OrdersLiveValue | null>(null);

async function fetchNewCount() {
  const supabase = createBrowserSupabase();
  if (!supabase) return null;
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  if (error) return null;
  return count ?? 0;
}

export function OrdersLiveProvider({
  initialNewCount = 0,
  children,
}: {
  initialNewCount?: number;
  children: React.ReactNode;
}) {
  const [newCount, setNewCountState] = useState(initialNewCount);
  const [live, setLiveState] = useState(false);
  const subscribedRef = useRef(false);

  useEffect(() => {
    setNewCountState(initialNewCount);
  }, [initialNewCount]);

  const setNewCount = useCallback((count: number) => {
    setNewCountState(Math.max(0, count));
  }, []);

  const setLive = useCallback((value: boolean) => {
    setLiveState(value);
  }, []);

  useEffect(() => {
    const base = "Yönetim";
    const prev = document.title;
    document.title = newCount > 0 ? `(${newCount}) Siparişler` : prev.includes("Siparişler") ? "Siparişler" : prev || base;
  }, [newCount]);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    if (!supabase) return;

    const refreshCount = () => {
      void fetchNewCount().then((count) => {
        if (count !== null) setNewCountState(count);
      });
    };

    const channel = supabase
      .channel("orders-badge")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        refreshCount();
      })
      .subscribe((status) => {
        const ok = status === "SUBSCRIBED";
        subscribedRef.current = ok;
        setLiveState(ok);
      });

    const backup = window.setInterval(() => {
      if (!subscribedRef.current) refreshCount();
    }, 30_000);

    return () => {
      window.clearInterval(backup);
      void supabase.removeChannel(channel);
      subscribedRef.current = false;
    };
  }, []);

  const value = useMemo(
    () => ({ newCount, setNewCount, live, setLive }),
    [newCount, setNewCount, live, setLive],
  );

  return <OrdersLiveContext.Provider value={value}>{children}</OrdersLiveContext.Provider>;
}

export function useOrdersLive() {
  const ctx = useContext(OrdersLiveContext);
  if (!ctx) {
    return {
      newCount: 0,
      setNewCount: (_: number) => {},
      live: false,
      setLive: (_: boolean) => {},
    };
  }
  return ctx;
}
