-- Menü başlığını gösterme ayarı. 0001 çalıştıktan sonra Supabase SQL Editor'da bir kez çalıştırın.

begin;

alter table public.restaurant_settings
  add column if not exists show_title boolean not null default false;

commit;
