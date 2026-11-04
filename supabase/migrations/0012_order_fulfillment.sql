-- Teslimat / gel al
begin;

alter table public.orders
  add column if not exists fulfillment text not null default 'delivery';

alter table public.orders
  drop constraint if exists orders_fulfillment_check;

alter table public.orders
  add constraint orders_fulfillment_check
  check (fulfillment in ('delivery', 'pickup'));

commit;
