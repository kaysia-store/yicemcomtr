"use client";

import Link from "next/link";
import { useEffect, useRef, useTransition } from "react";
import { setOrderStatus } from "@/app/admin/actions/orders";
import { formatCartMoney } from "@/lib/cart";
import { paymentLabel, statusLabel, type OrderRow, type OrderSettings } from "@/lib/orders";

export function OrdersBoard({ orders, settings }: { orders: OrderRow[]; settings: OrderSettings }) {
  const [pending, startTransition] = useTransition();
  const knownRef = useRef<Set<string>>(new Set(orders.map((order) => order.id)));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fresh = orders.filter((order) => order.status === "new" && !knownRef.current.has(order.id));
    knownRef.current = new Set(orders.map((order) => order.id));
    if (!settings.soundEnabled || fresh.length === 0) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.value = 0.05;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      /* ses engelli olabilir */
    }
  }, [orders, settings.soundEnabled]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      window.location.reload();
    }, 20000);
    return () => window.clearInterval(timer);
  }, []);

  function act(id: string, status: "accepted" | "printed" | "cancelled") {
    startTransition(async () => {
      await setOrderStatus(id, status);
      if (status === "accepted" && settings.autoPrintOnAccept) {
        window.open(`/admin/orders/${id}/print`, "_blank", "noopener,noreferrer");
      }
    });
  }

  if (orders.length === 0) {
    return <p className="rounded-3xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">Henüz sipariş yok.</p>;
  }

  return (
    <ul className="grid gap-3">
      <audio ref={audioRef} />
      {orders.map((order) => (
        <li className="rounded-3xl border border-line bg-card p-4" key={order.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">
                {order.customerName}{" "}
                <span className="text-xs font-normal text-muted">#{order.id.slice(0, 8).toUpperCase()}</span>
              </p>
              <p className="mt-1 text-sm text-muted">
                {statusLabel(order.status)} · {paymentLabel(order.paymentMethod)} ·{" "}
                {new Date(order.createdAt).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
              </p>
              {order.address ? <p className="mt-1 text-sm">{order.address}</p> : null}
              {order.note ? <p className="mt-1 text-sm text-muted">Not: {order.note}</p> : null}
            </div>
            <p className="text-lg font-medium text-accent tabular-nums">{formatCartMoney(order.total)}</p>
          </div>
          <ul className="mt-3 grid gap-1 text-sm">
            {order.items.map((item, index) => (
              <li key={`${order.id}-${index}`}>
                {item.quantity}× {item.name}
                {item.optionNames.length ? ` (${item.optionNames.join(", ")})` : ""}
                {item.removedIngredients.length ? ` − ${item.removedIngredients.join(", ")}` : ""}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {order.status === "new" ? (
              <button className="btn btn-primary" disabled={pending} onClick={() => act(order.id, "accepted")} type="button">
                Onayla
              </button>
            ) : null}
            <Link className="btn btn-secondary" href={`/admin/orders/${order.id}/print`} target="_blank">
              Fiş yazdır
            </Link>
            {order.status !== "printed" ? (
              <button className="btn btn-secondary" disabled={pending} onClick={() => act(order.id, "printed")} type="button">
                Yazdırıldı
              </button>
            ) : null}
            {order.status !== "cancelled" ? (
              <button className="btn btn-danger" disabled={pending} onClick={() => act(order.id, "cancelled")} type="button">
                İptal
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
