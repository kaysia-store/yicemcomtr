-- Sipariş / ayar tablolarını güvenle tamamlar (tekrar çalıştırılabilir).
-- 0005 hata verse bile bunu tek başına çalıştırman yeterli.

begin;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new'
    check (status in ('new', 'accepted', 'printed', 'cancelled')),
  customer_name text not null check (char_length(trim(customer_name)) between 1 and 80),
  payment_method text not null check (payment_method in ('cash', 'card', 'online')),
  address text not null default '' check (char_length(address) <= 240),
  note text not null default '' check (char_length(note) <= 400),
  items jsonb not null,
  total numeric(10, 2) not null check (total >= 0),
  locale text not null default 'tr',
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  printed_at timestamptz
);

create index if not exists orders_status_created on public.orders (status, created_at desc);

create table if not exists public.order_settings (
  id integer primary key check (id = 1),
  sound_enabled boolean not null default true,
  auto_print_on_accept boolean not null default false,
  printer_name text not null default 'POS-80C',
  paper_width_mm integer not null default 72,
  paper_height_mm integer not null default 297,
  open_cash_drawer boolean not null default false,
  cut_paper boolean not null default true
);

alter table public.order_settings
  add column if not exists menu_order_enabled boolean not null default false;

alter table public.order_settings
  add column if not exists menu_whatsapp_enabled boolean not null default true;

insert into public.order_settings (
  id,
  sound_enabled,
  auto_print_on_accept,
  printer_name,
  paper_width_mm,
  paper_height_mm,
  open_cash_drawer,
  cut_paper,
  menu_order_enabled,
  menu_whatsapp_enabled
) values (1, true, false, 'POS-80C', 72, 297, false, true, false, true)
on conflict (id) do nothing;

alter table public.orders enable row level security;
alter table public.order_settings enable row level security;

drop policy if exists orders_anon_insert on public.orders;
create policy orders_anon_insert on public.orders
for insert to anon with check (true);

drop policy if exists orders_select_auth on public.orders;
create policy orders_select_auth on public.orders
for select to authenticated using (true);

drop policy if exists orders_update_auth on public.orders;
create policy orders_update_auth on public.orders
for update to authenticated using (true) with check (true);

drop policy if exists orders_delete_auth on public.orders;
create policy orders_delete_auth on public.orders
for delete to authenticated using (true);

drop policy if exists order_settings_select_auth on public.order_settings;
create policy order_settings_select_auth on public.order_settings
for select to authenticated using (true);

drop policy if exists order_settings_update_auth on public.order_settings;
create policy order_settings_update_auth on public.order_settings
for update to authenticated using (true) with check (true);

drop policy if exists order_settings_insert_auth on public.order_settings;
create policy order_settings_insert_auth on public.order_settings
for insert to authenticated with check (id = 1);

drop policy if exists order_settings_select_anon on public.order_settings;
create policy order_settings_select_anon on public.order_settings
for select to anon using (true);

grant insert on public.orders to anon;
grant select, update, delete on public.orders to authenticated;
grant select, insert, update on public.order_settings to authenticated;
grant select on public.order_settings to anon;

commit;

-- Kontrol (isteğe bağlı):
-- select id, menu_order_enabled, menu_whatsapp_enabled from public.order_settings;
