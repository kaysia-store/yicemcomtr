"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { deleteOrder, setOrderStatus } from "@/app/admin/actions/orders";
import { formatCartMoney } from "@/lib/cart";
import { todayIstanbul } from "@/lib/order-day";
import { orderCustomerName, paymentLabel, statusLabel, type OrderRow, type OrderSettings } from "@/lib/orders";

const ALERT_SRC = "/order-alert.mp3";

export function OrdersBoard({
  orders,
  settings,
  day,
}: {
  orders: OrderRow[];
  settings: OrderSettings;
  day: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [printOrder, setPrintOrder] = useState<OrderRow | null>(null);
  const promptedRef = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isToday = day === todayIstanbul();

  useEffect(() => {
    const audio = new Audio(ALERT_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    const unlock = () => {
      void audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  function startAlert() {
    if (!settings.soundEnabled) return;
    const audio = audioRef.current;
    if (!audio) return;
    void audio.play().catch(() => {});
  }

  function stopAlert() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }

  function dismissModal() {
    stopAlert();
    setPrintOrder(null);
  }

  useEffect(() => {
    if (!isToday) {
      stopAlert();
      return;
    }

    const newest = orders.find((order) => order.status === "new" && !promptedRef.current.has(order.id));
    if (newest && !printOrder) {
      promptedRef.current.add(newest.id);
      setPrintOrder(newest);
      startAlert();
    }
  }, [orders, settings.soundEnabled, printOrder, isToday]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      window.location.reload();
    }, 20000);
    return () => window.clearInterval(timer);
  }, []);

  function openPrint(order: OrderRow) {
    if (order.status === "new") startAlert();
    setPrintOrder(order);
  }

  function confirmPrint() {
    if (!printOrder) return;
    const id = printOrder.id;
    const wasNew = printOrder.status === "new";
    stopAlert();
    setPrintOrder(null);
    startTransition(async () => {
      if (wasNew) await setOrderStatus(id, "accepted");
      window.open(`/admin/orders/${id}/print`, "_blank", "noopener,noreferrer");
    });
  }

  function remove(order: OrderRow) {
    if (!window.confirm(`${orderCustomerName(order)} siparişini silmek istiyor musunuz?`)) return;
    startTransition(async () => {
      await deleteOrder(order.id);
      if (printOrder?.id === order.id) dismissModal();
      router.refresh();
    });
  }

  if (orders.length === 0) {
    return <p className="rounded-3xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">Bu günde sipariş yok.</p>;
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
              <button className="btn btn-danger" disabled={pending} onClick={() => remove(order)} type="button">
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>

      {printOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button aria-label="Kapat" className="absolute inset-0 bg-black/50" onClick={dismissModal} type="button" />
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
            <p className="mt-4 text-xs text-muted">Yazdırınca fiş yazıcıya gider. Kopya sayısı yazıcı / tarayıcı yazdır penceresinden seçilir.</p>
            <div className="mt-5 flex gap-2">
              <button className="btn btn-primary flex-1" disabled={pending} onClick={confirmPrint} type="button">
                Yazdır
              </button>
              <button className="btn btn-secondary flex-1" onClick={dismissModal} type="button">
                Sonra
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
