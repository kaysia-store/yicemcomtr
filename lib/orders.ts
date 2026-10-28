import type { CartLine, PaymentMethod } from "@/lib/cart";

export type OrderStatus = "new" | "accepted" | "printed" | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  optionNames: string[];
  removedIngredients: string[];
};

export type OrderRow = {
  id: string;
  status: OrderStatus;
  customerFirstName: string;
  customerLastName: string;
  customerName: string;
  phone: string;
  paymentMethod: PaymentMethod;
  mealCardBrand: string;
  address: string;
  note: string;
  items: OrderItem[];
  total: number;
  locale: string;
  createdAt: string;
  acceptedAt: string | null;
  printedAt: string | null;
};

export function orderCustomerName(order: Pick<OrderRow, "customerFirstName" | "customerLastName" | "customerName">) {
  const full = `${order.customerFirstName} ${order.customerLastName}`.trim();
  return full || order.customerName;
}

export type OrderSettings = {
  soundEnabled: boolean;
  autoPrintOnAccept: boolean;
  printerName: string;
  paperWidthMm: number;
  paperHeightMm: number;
  openCashDrawer: boolean;
  cutPaper: boolean;
  menuOrderEnabled: boolean;
  menuWhatsappEnabled: boolean;
};

export const defaultOrderSettings: OrderSettings = {
  soundEnabled: true,
  autoPrintOnAccept: false,
  printerName: "POS-80C",
  paperWidthMm: 72,
  paperHeightMm: 297,
  openCashDrawer: false,
  cutPaper: true,
  menuOrderEnabled: false,
  menuWhatsappEnabled: true,
};

export function mapOrderSettings(data: Record<string, unknown> | null | undefined): OrderSettings {
  if (!data) return defaultOrderSettings;
  return {
    soundEnabled: data.sound_enabled === true,
    autoPrintOnAccept: data.auto_print_on_accept === true,
    printerName: String(data.printer_name ?? "POS-80C"),
    paperWidthMm: Number(data.paper_width_mm ?? 72),
    paperHeightMm: Number(data.paper_height_mm ?? 297),
    openCashDrawer: data.open_cash_drawer === true,
    cutPaper: data.cut_paper !== false,
    menuOrderEnabled: data.menu_order_enabled === true,
    menuWhatsappEnabled: data.menu_whatsapp_enabled !== false,
  };
}

export function linesToOrderItems(lines: CartLine[]): OrderItem[] {
  return lines.map((line) => ({
    productId: line.productId,
    name: line.name,
    unitPrice: line.unitPrice,
    quantity: line.quantity,
    optionNames: line.optionNames,
    removedIngredients: line.removedIngredients,
  }));
}

export function statusLabel(status: OrderStatus) {
  if (status === "accepted") return "Onaylandı";
  if (status === "printed") return "Yazdırıldı";
  if (status === "cancelled") return "İptal";
  return "Yeni";
}

export { paymentLabel } from "@/lib/cart";
