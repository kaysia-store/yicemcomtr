-- QR menüde sipariş / WhatsApp butonları. Varsayılan: WP açık, sipariş kapalı.
-- Supabase SQL Editor'da bir kez çalıştırın.

begin;

alter table public.order_settings
  add column if not exists menu_order_enabled boolean not null default false,
  add column if not exists menu_whatsapp_enabled boolean not null default true;

update public.order_settings
set
  menu_order_enabled = coalesce(menu_order_enabled, false),
  menu_whatsapp_enabled = coalesce(menu_whatsapp_enabled, true)
where id = 1;

drop policy if exists order_settings_select_anon on public.order_settings;
create policy order_settings_select_anon on public.order_settings
for select to anon using (true);

grant select on public.order_settings to anon;

commit;
