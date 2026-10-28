"use client";

import { useEffect } from "react";
import { setOrderStatus } from "@/app/admin/actions/orders";

export function PrintActions({ orderId }: { orderId: string }) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.print();
      void setOrderStatus(orderId, "printed");
    }, 400);
    return () => window.clearTimeout(timer);
  }, [orderId]);

  return (
    <div className="mx-auto mb-4 flex max-w-sm gap-2 print:hidden">
      <button className="btn btn-primary w-full" onClick={() => window.print()} type="button">
        Yazdır
      </button>
      <button className="btn btn-secondary w-full" onClick={() => window.close()} type="button">
        Kapat
      </button>
    </div>
  );
}
