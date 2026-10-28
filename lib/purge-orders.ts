import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/** 7 günden eski siparişlerde kişisel alanları temizler; ciro alanları kalır. */
export async function purgeExpiredOrderCustomerData() {
  if (!getSupabaseEnv()) return;
  try {
    const supabase = await createClient();
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from("orders")
      .update({
        customer_name: "",
        customer_first_name: "",
        customer_last_name: "",
        phone: "",
        address: "",
        note: "",
      })
      .lt("created_at", cutoff);
  } catch {
    /* purge başarısız olsa paneli engelleme */
  }
}
