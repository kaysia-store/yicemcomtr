import { formatCartMoney } from "@/lib/cart";
import { orderCustomerName, paymentLabel, type OrderRow } from "@/lib/orders";
import { place } from "@/lib/place";

export function Receipt({
  order,
  restaurantName,
  menuUrl,
  menuQrDataUrl,
}: {
  order: OrderRow;
  restaurantName: string;
  menuUrl: string;
  menuQrDataUrl?: string | null;
}) {
  const created = new Date(order.createdAt);
  const when = Number.isNaN(created.getTime())
    ? ""
    : created.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
  const name = orderCustomerName(order);

  return (
    <div className="receipt mx-auto bg-white text-black" style={{ width: "72mm", maxWidth: "72mm" }}>
      <div className="px-2 py-3 text-[11px] leading-4">
        <div className="mb-2 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="h-12 w-auto object-contain brightness-0" src="/yicem-logo.png" />
        </div>
        <p className="text-center text-sm font-bold">{restaurantName}</p>
        <p className="mt-1 text-center">
          {place.streetAddress}
          <br />
          {place.district} / {place.city}
        </p>
        <p className="mt-1 text-center tabular-nums">{place.mobileLabel}</p>
        <div className="my-2 border-t border-dashed border-black/40" />
        <p>
          Sipariş: {order.id.slice(0, 8).toUpperCase()}
          <br />
          Tarih: {when}
        </p>
        <div className="my-2 border-t border-dashed border-black/40" />
        <p className="font-bold">Müşteri</p>
        <p className="mt-1">
          {name}
          <br />
          Tel: {order.phone || "—"}
          <br />
          Ödeme: {paymentLabel(order.paymentMethod, order.mealCardBrand)}
        </p>
        {order.address ? <p className="mt-1">Adres: {order.address}</p> : null}
        {order.note ? <p className="mt-1">Not: {order.note}</p> : null}
        <div className="my-2 border-t border-dashed border-black/40" />
        <p className="font-bold">Sipariş</p>
        <ul className="mt-1 grid gap-2">
          {order.items.map((item, itemIndex) => (
            <li key={`${item.productId}-${itemIndex}`}>
              <div className="flex justify-between gap-2">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="shrink-0 tabular-nums">{formatCartMoney(item.unitPrice * item.quantity)}</span>
              </div>
              {item.optionNames.length > 0 ? <p className="text-[10px]">+ {item.optionNames.join(", ")}</p> : null}
              {item.removedIngredients.length > 0 ? (
                <p className="text-[10px]">- {item.removedIngredients.join(", ")}</p>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="my-2 border-t border-dashed border-black/40" />
        <p className="flex justify-between text-sm font-bold">
          <span>TOPLAM</span>
          <span className="tabular-nums">{formatCartMoney(order.total)}</span>
        </p>
        <p className="mt-3 text-center text-[10px]">Afiyet olsun</p>
        {menuQrDataUrl ? (
          <div className="mt-3 flex flex-col items-center">
            <div className="my-2 w-full border-t border-dashed border-black/40" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="h-20 w-20 object-contain" src={menuQrDataUrl} />
            <p className="mt-1 text-center text-[9px] break-all">{menuUrl.replace(/^https?:\/\//, "")}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
