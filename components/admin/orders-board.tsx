"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { setOrderStatus } from "@/app/admin/actions/orders";
import { formatCartMoney } from "@/lib/cart";
import { orderCustomerName, paymentLabel, statusLabel, type OrderRow, type OrderSettings } from "@/lib/orders";

export function OrdersBoard({ orders, settings }: { orders: OrderRow[]; settings: OrderSettings }) {
  const [pending, startTransition] = useTransition();
  const [printOrder, setPrintOrder] = useState<OrderRow | null>(null);
  const [copies, setCopies] = useState(1);
  const knownRef = useRef<Set<string>>(new Set(orders.map((order) => order.id)));
  const promptedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fresh = orders.filter((order) => order.status === "new" && !knownRef.current.has(order.id));
    knownRef.current = new Set(orders.map((order) => order.id));

    if (fresh.length > 0 && settings.soundEnabled) {
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
    }

    const newest = orders.find((order) => order.status === "new" && !promptedRef.current.has(order.id));
    if (newest && !printOrder) {
      promptedRef.current.add(newest.id);
      setCopies(1);
      setPrintOrder(newest);
    }
  }, [orders, settings.soundEnabled, printOrder]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      window.location.reload();
    }, 20000);
    return () => window.clearInterval(timer);
  }, []);

  function openPrint(order: OrderRow) {
    setCopies(1);
    setPrintOrder(order);
  }

  function confirmPrint() {
    if (!printOrder) return;
    const id = printOrder.id;
    const qty = copies;
    setPrintOrder(null);
    startTransition(async () => {
      if (printOrder.status === "new") await setOrderStatus(id, "accepted");
      window.open(`/admin/orders/${id}/print?copies=${qty}`, "_blank", "noopener,noreferrer");
    });
  }

  if (orders.length === 0) {
    return <p className="rounded-3xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">Henüz sipariş yok.</p>;
  }

  return (
    <>
      <ul className="grid gap-3">
        {orders.map((order) => (
          <li className="rounded-3xl border border-line bg-card p-4" key={order.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">
                  {orderCustomerName(order)}{" "}
                  <span className="text-xs font-normal text-muted">#{order.id.slice(0, 8).toUpperCase()}</span>
                </p>
                <p className="mt-1 text-sm text-muted">
                  {statusLabel(order.status)} · {paymentLabel(order.paymentMethod, order.mealCardBrand)} ·{" "}
                  {new Date(order.createdAt).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                </p>
                {order.phone ? <p className="mt-1 text-sm tabular-nums">{order.phone}</p> : null}
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
                <button className="btn btn-primary" disabled={pending} onClick={() => openPrint(order)} type="button">
                  Onayla ve yazdır
                </button>
              ) : (
                <button className="btn btn-secondary" disabled={pending} onClick={() => openPrint(order)} type="button">
                  Fiş yazdır
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {printOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button aria-label="Kapat" className="absolute inset-0 bg-black/50" onClick={() => setPrintOrder(null)} type="button" />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-line bg-card p-5 shadow-lg" role="dialog">
            <h2 className="font-serif text-2xl">Yeni sipariş</h2>
            <p className="mt-2 text-sm text-muted">
              {orderCustomerName(printOrder)} · {paymentLabel(printOrder.paymentMethod, printOrder.mealCardBrand)} ·{" "}
              <span className="tabular-nums text-accent">{formatCartMoney(printOrder.total)}</span>
            </p>
            {printOrder.phone ? <p className="mt-1 text-sm tabular-nums">{printOrder.phone}</p> : null}
            {printOrder.address ? <p className="mt-1 text-sm">{printOrder.address}</p> : null}
            <ul className="mt-3 grid gap-1 text-sm">
              {printOrder.items.map((item, index) => (
                <li key={`${printOrder.id}-modal-${index}`}>
                  {item.quantity}× {item.name}
                </li>
              ))}
            </ul>
            <label className="mt-5 grid gap-1.5 text-sm font-medium">
              Fiş adedi
              <select className="field" onChange={(event) => setCopies(Number(event.target.value))} value={copies}>
                <option value={1}>1 fiş</option>
                <option value={2}>2 fiş</option>
                <option value={3}>3 fiş</option>
              </select>
            </label>
            <p className="mt-2 text-xs text-muted">Yazdırınca fiş otomatik yazıcıya gider; pakete zımbalanır, kurye ödemeyi fişle alır.</p>
            <div className="mt-5 flex gap-2">
              <button className="btn btn-primary flex-1" disabled={pending} onClick={confirmPrint} type="button">
                Yazdır
              </button>
              <button className="btn btn-secondary flex-1" onClick={() => setPrintOrder(null)} type="button">
                Sonra
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
