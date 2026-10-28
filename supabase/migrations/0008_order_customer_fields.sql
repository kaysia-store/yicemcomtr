-- Sipariş müşteri alanları: ad, soyad, telefon. Tekrar çalıştırılabilir.

begin;

alter table public.orders
  add column if not exists customer_first_name text not null default '';

alter table public.orders
  add column if not exists customer_last_name text not null default '';

alter table public.orders
  add column if not exists phone text not null default '';

update public.orders
set
  customer_first_name = coalesce(nullif(trim(customer_first_name), ''), split_part(trim(customer_name), ' ', 1), ''),
  customer_last_name = coalesce(
    nullif(trim(customer_last_name), ''),
    nullif(trim(substr(trim(customer_name), length(split_part(trim(customer_name), ' ', 1)) + 1)), ''),
    ''
  )
where coalesce(trim(customer_name), '') <> '';

commit;
