"use client";

import Link from "next/link";
import { formatDayLabel, shiftDay, todayIstanbul } from "@/lib/order-day";

export function OrdersDateNav({ day, pastUnseen }: { day: string; pastUnseen: number }) {
  const prev = shiftDay(day, -1);
  const next = shiftDay(day, 1);
  const today = todayIstanbul();
  const nextDisabled = next > today;

  return (
    <div className="mb-5 flex items-center justify-between gap-3 rounded-3xl border border-line bg-card px-3 py-2">
      <Link
        aria-label="Önceki gün"
        className="relative grid size-11 place-items-center rounded-full border border-line hover:bg-paper"
        href={`/admin/orders?date=${prev}`}
      >
        <span aria-hidden className="text-lg">
          ‹
        </span>
        {pastUnseen > 0 ? (
          <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-accent text-[11px] font-medium text-white">
            1
          </span>
        ) : null}
      </Link>
      <div className="min-w-0 text-center">
        <p className="font-medium">{formatDayLabel(day)}</p>
        <p className="text-xs text-muted tabular-nums">{day.split("-").reverse().join(".")}</p>
      </div>
      {nextDisabled ? (
        <span
          aria-disabled
          aria-label="Sonraki gün"
          className="grid size-11 place-items-center rounded-full border border-line opacity-30"
        >
          <span aria-hidden className="text-lg">
            ›
          </span>
        </span>
      ) : (
        <Link
          aria-label="Sonraki gün"
          className="grid size-11 place-items-center rounded-full border border-line hover:bg-paper"
          href={`/admin/orders?date=${next}`}
        >
          <span aria-hidden className="text-lg">
            ›
          </span>
        </Link>
      )}
    </div>
  );
}
