"use client";

import { useActionState } from "react";
import { saveOrderSettings } from "@/app/admin/actions/orders";
import type { OrderSettings } from "@/lib/orders";

type FormState = { ok: boolean; message: string };
const initial: FormState = { ok: false, message: "" };

async function saveAction(_: FormState, formData: FormData): Promise<FormState> {
  const result = await saveOrderSettings(formData);
  if (!result.ok) return { ok: false, message: result.message };
  return { ok: true, message: "Ayarlar kaydedildi." };
}

export function OrderSettingsForm({ settings }: { settings: OrderSettings }) {
  const [state, action, pending] = useActionState(saveAction, initial);

  return (
    <form action={action} className="grid max-w-xl gap-6">
      <section className="grid gap-4 rounded-3xl border border-line bg-card p-5">
        <div>
          <h2 className="font-serif text-2xl">QR menü</h2>
          <p className="mt-1 text-sm text-muted">Kapalı olan buton menüde hiç görünmez; sipariş sunucuda da reddedilir.</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input defaultChecked={settings.menuWhatsappEnabled} name="menuWhatsappEnabled" type="checkbox" />
          WhatsApp ile sipariş
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input defaultChecked={settings.menuOrderEnabled} name="menuOrderEnabled" type="checkbox" />
          Uygulama içi sipariş (admin paneline düşer)
        </label>
      </section>

      <section className="grid gap-4 rounded-3xl border border-line bg-card p-5">
        <h2 className="font-serif text-2xl">Bildirim ve yazıcı</h2>
        <label className="flex items-center gap-2 text-sm">
          <input defaultChecked={settings.soundEnabled} name="soundEnabled" type="checkbox" />
          Yeni siparişte zil sesi
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input defaultChecked={settings.autoPrintOnAccept} name="autoPrintOnAccept" type="checkbox" />
          Onayda otomatik fiş yazdır
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Yazıcı adı
          <input className="field" defaultValue={settings.printerName} name="printerName" />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium">
            Kağıt genişliği (mm)
            <input className="field" defaultValue={settings.paperWidthMm} name="paperWidthMm" type="number" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Kağıt yüksekliği (mm)
            <input className="field" defaultValue={settings.paperHeightMm} name="paperHeightMm" type="number" />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input defaultChecked={settings.cutPaper} name="cutPaper" type="checkbox" />
          Yazdırınca kağıdı kes
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input defaultChecked={settings.openCashDrawer} name="openCashDrawer" type="checkbox" />
          Yazdırınca kasa çekmecesini aç
        </label>
        <p className="text-sm text-muted">
          Test yazdırma: Siparişler → bir sipariş → Fiş yazdır. Cihaz adı POS-80C, kağıt 72×297 mm.
        </p>
      </section>

      {state.message ? <p className={`text-sm ${state.ok ? "text-pine" : "text-danger"}`}>{state.message}</p> : null}
      <button className="btn btn-primary w-fit" disabled={pending} type="submit">
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}
