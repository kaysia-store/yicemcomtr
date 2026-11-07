"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { deleteOrder, setOrderStatus } from "@/app/admin/actions/orders";
import { useOrdersLive } from "@/components/admin/orders-live-context";
import { formatCartMoney } from "@/lib/cart";
import { formatIstanbulDay, istanbulDayBounds, todayIstanbul } from "@/lib/order-day";
import { mapOrderRow } from "@/lib/map-order";
import {
  fulfillmentLabel,
  orderCustomerName,
  paymentLabel,
  statusLabel,
  type OrderRow,
  type OrderSettings,
} from "@/lib/orders";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const ALERT_SRC = "/order-alert.mp3";
const ALERT_GAIN = 2.4;
const BACKUP_MS = 30_000;

function orderOnDay(order: OrderRow, day: string) {
  if (!order.createdAt) return false;
  try {
    return formatIstanbulDay(new Date(order.createdAt)) === day;
  } catch {
    return false;
  }
}

export function OrdersBoard({
  orders,
  settings,
  day,
}: {
  orders: OrderRow[];
  settings: OrderSettings;
  day: string;
}) {
  const { setNewCount } = useOrdersLive();
  const [pending, startTransition] = useTransition();
  const [liveOrders, setLiveOrders] = useState(orders);
  const [printOrder, setPrintOrder] = useState<OrderRow | null>(null);
  const [connectionHint, setConnectionHint] = useState<string | null>(null);
  const promptedRef = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const subscribedRef = useRef(false);
  const isToday = day === todayIstanbul();

  useEffect(() => {
    setLiveOrders(orders);
  }, [orders, day]);

  useEffect(() => {
    setNewCount(liveOrders.filter((order) => order.status === "new").length);
  }, [liveOrders, setNewCount]);

  useEffect(() => {
    const audio = new Audio(ALERT_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 1;
    audioRef.current = audio;

    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        const source = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        gain.gain.value = ALERT_GAIN;
        source.connect(gain);
        gain.connect(ctx.destination);
        audioCtxRef.current = ctx;
        gainRef.current = gain;
      }
    } catch {
      /* Web Audio yoksa HTMLAudio volume=1 yeterli */
    }

    const unlock = () => {
      void audioCtxRef.current?.resume().catch(() => {});
      void audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
        })
        .catch(() => {});
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      audio.pause();
      audioRef.current = null;
      void audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
      gainRef.current = null;
    };
  }, []);

  function startAlert() {
    if (!settings.soundEnabled) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (gainRef.current) gainRef.current.gain.value = ALERT_GAIN;
    audio.volume = 1;
    void audioCtxRef.current?.resume().catch(() => {});
    void audio.play().catch(() => {});
  }

  function stopAlert() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }

  function dismissModal() {
    // Onaylamadan kapat: ses kesilir, sipariş Yeni kalır → listedeki Onayla durur
    if (printOrder) promptedRef.current.add(printOrder.id);
    stopAlert();
    setPrintOrder(null);
  }

  function syncBadgeFrom(list: OrderRow[]) {
    setNewCount(list.filter((order) => order.status === "new").length);
  }

  async function softFetchDay() {
    const supabase = createBrowserSupabase();
    if (!supabase) return;
    const { start, end } = istanbulDayBounds(day);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .gte("created_at", start)
      .lt("created_at", end)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error || !data) return;
    setLiveOrders(data.map((row) => mapOrderRow(row as Record<string, unknown>)));
  }

  useEffect(() => {
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setConnectionHint("Canlı bağlantı yok");
      return;
    }

    subscribedRef.current = false;
    const channel = supabase
      .channel(`orders-admin-${day}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new) {
            const order = mapOrderRow(payload.new as Record<string, unknown>);
            if (!orderOnDay(order, day)) return;
            setLiveOrders((current) => {
              if (current.some((item) => item.id === order.id)) {
                return current.map((item) => (item.id === order.id ? order : item));
              }
              return [order, ...current];
            });
            return;
          }
          if (payload.eventType === "UPDATE" && payload.new) {
            const order = mapOrderRow(payload.new as Record<string, unknown>);
            setLiveOrders((current) => {
              const exists = current.some((item) => item.id === order.id);
              if (!orderOnDay(order, day)) {
                return current.filter((item) => item.id !== order.id);
              }
              if (!exists) return [order, ...current];
              return current.map((item) => (item.id === order.id ? order : item));
            });
            return;
          }
          if (payload.eventType === "DELETE" && payload.old) {
            const id = String((payload.old as Record<string, unknown>).id ?? "");
            if (!id) return;
            setLiveOrders((current) => current.filter((item) => item.id !== id));
          }
        },
      )
      .subscribe((status) => {
        const ok = status === "SUBSCRIBED";
        subscribedRef.current = ok;
        setConnectionHint(ok ? null : "Bağlantı yok · yedek yenileme açık");
      });

    const backup = window.setInterval(() => {
      if (!subscribedRef.current) void softFetchDay();
    }, BACKUP_MS);

    return () => {
      window.clearInterval(backup);
      void supabase.removeChannel(channel);
      subscribedRef.current = false;
    };
    // day değişince kanal yenilenir
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day]);

  useEffect(() => {
    if (!isToday) {
      stopAlert();
      return;
    }

    const newest = liveOrders.find((order) => order.status === "new" && !promptedRef.current.has(order.id));
    if (newest && !printOrder) {
      promptedRef.current.add(newest.id);
      setPrintOrder(newest);
      startAlert();
    }
  }, [liveOrders, settings.soundEnabled, printOrder, isToday]);

  function openPrint(order: OrderRow) {
    setPrintOrder(order);
    if (order.status === "new") startAlert();
  }

  function markAccepted(id: string) {
    setLiveOrders((current) => {
      const next = current.map((order) => (order.id === id ? { ...order, status: "accepted" as const } : order));
      syncBadgeFrom(next);
      return next;
    });
  }

  function acceptOrder(andPrint: boolean) {
    if (!printOrder) return;
    const id = printOrder.id;
    const wasNew = printOrder.status === "new";
    promptedRef.current.add(id);
    stopAlert();
    setPrintOrder(null);
    if (wasNew) markAccepted(id);
    else syncBadgeFrom(liveOrders);
    startTransition(async () => {
      if (wasNew) await setOrderStatus(id, "accepted");
      if (andPrint) window.open(`/admin/orders/${id}/print`, "_blank", "noopener,noreferrer");
    });
  }

  function acceptFromList(order: OrderRow, andPrint: boolean) {
    promptedRef.current.add(order.id);
    if (printOrder?.id === order.id) {
      stopAlert();
      setPrintOrder(null);
    }
    if (order.status === "new") markAccepted(order.id);
    startTransition(async () => {
      if (order.status === "new") await setOrderStatus(order.id, "accepted");
      if (andPrint) window.open(`/admin/orders/${order.id}/print`, "_blank", "noopener,noreferrer");
    });
  }

  function remove(order: OrderRow) {
    if (!window.confirm(`${orderCustomerName(order)} siparişini silmek istiyor musunuz?`)) return;
    setLiveOrders((current) => current.filter((item) => item.id !== order.id));
    if (printOrder?.id === order.id) dismissModal();
    startTransition(async () => {
      await deleteOrder(order.id);
    });
  }

  return (
    <>
      {connectionHint ? <p className="mb-3 text-xs text-muted">{connectionHint}</p> : null}
      {liveOrders.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">
          Bu günde sipariş yok.
        </p>
      ) : (
        <ul className="grid gap-3">
          {liveOrders.map((order) => (
            <li className="rounded-3xl border border-line bg-card p-4" key={order.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {orderCustomerName(order)}{" "}
                    <span className="text-xs font-normal text-muted">#{order.id.slice(0, 8).toUpperCase()}</span>
                    {order.fulfillment === "pickup" ? (
                      <span className="ml-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-white">
                        GEL AL
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {statusLabel(order.status)} · {fulfillmentLabel(order.fulfillment)} ·{" "}
                    {paymentLabel(order.paymentMethod, order.mealCardBrand)} ·{" "}
                    {new Date(order.createdAt).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                  </p>
                  {order.phone ? <p className="mt-1 text-sm tabular-nums">{order.phone}</p> : null}
                  {order.fulfillment === "pickup" ? (
                    <p className="mt-1 text-sm font-medium text-accent">Restorandan teslim</p>
                  ) : order.address ? (
                    <p className="mt-1 text-sm">{order.address}</p>
                  ) : null}
                  {order.note ? <p className="mt-1 text-sm text-muted">Not: {order.note}</p> : null}
                </div>
                <p className="text-lg font-medium text-accent tabular-nums">{formatCartMoney(order.total)}</p>
              </div>
              <ul className="mt-3 grid gap-1 text-sm">
                {order.items.map((item, index) => (
                  <li key={`${order.id}-${index}`}>
                    {item.quantity}× {item.name}
                    {item.optionNames.length ? ` (${item.optionNames.join(", ")})` : ""}
                    {item.removedIngredients.length > 0 ? (
                      <span className="mt-0.5 block text-xs text-muted">
                        Çıkarılacaklar:
                        {item.removedIngredients.map((name) => (
                          <span className="block" key={name}>
                            - {name}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {order.status === "new" ? (
                  <>
                    <button className="btn btn-primary" disabled={pending} onClick={() => acceptFromList(order, false)} type="button">
                      Onayla
                    </button>
                    <button className="btn btn-secondary" disabled={pending} onClick={() => acceptFromList(order, true)} type="button">
                      Onayla ve yazdır
                    </button>
                  </>
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
      )}

      {printOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button aria-label="Kapat" className="absolute inset-0 bg-black/50" onClick={dismissModal} type="button" />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-line bg-card p-5 shadow-lg" role="dialog">
            <h2 className="font-serif text-2xl">
              {printOrder.status === "new" ? "Yeni sipariş — onayla" : "Sipariş"}
              {printOrder.fulfillment === "pickup" ? (
                <span className="ml-2 inline-flex rounded-full bg-accent px-2.5 py-1 align-middle text-sm font-sans font-medium text-white">
                  GEL AL
                </span>
              ) : null}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {orderCustomerName(printOrder)} · {fulfillmentLabel(printOrder.fulfillment)} ·{" "}
              {paymentLabel(printOrder.paymentMethod, printOrder.mealCardBrand)} ·{" "}
              <span className="tabular-nums text-accent">{formatCartMoney(printOrder.total)}</span>
            </p>
            {printOrder.phone ? <p className="mt-1 text-sm tabular-nums">{printOrder.phone}</p> : null}
            {printOrder.fulfillment === "pickup" ? (
              <p className="mt-1 text-sm font-medium text-accent">Restorandan teslim</p>
            ) : printOrder.address ? (
              <p className="mt-1 text-sm">{printOrder.address}</p>
            ) : null}
            <ul className="mt-3 grid gap-1 text-sm">
              {printOrder.items.map((item, index) => (
                <li key={`${printOrder.id}-modal-${index}`}>
                  {item.quantity}× {item.name}
                  {item.removedIngredients.length > 0 ? (
                    <span className="mt-0.5 block text-xs text-muted">
                      Çıkarılacaklar:
                      {item.removedIngredients.map((name) => (
                        <span className="block" key={name}>
                          - {name}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              Onaylayınca ses ve yuvarlak rozet kalkar. Modalı kapatırsan sipariş Yeni kalır; listeden Onayla ile devam edebilirsin.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {printOrder.status === "new" ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button className="btn btn-primary flex-1" disabled={pending} onClick={() => acceptOrder(false)} type="button">
                    Onayla
                  </button>
                  <button className="btn btn-secondary flex-1" disabled={pending} onClick={() => acceptOrder(true)} type="button">
                    Onayla ve yazdır
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary w-full" disabled={pending} onClick={() => acceptOrder(true)} type="button">
                  Yazdır
                </button>
              )}
              <button className="btn btn-secondary w-full" onClick={dismissModal} type="button">
                Kapat (sonra onayla)
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
