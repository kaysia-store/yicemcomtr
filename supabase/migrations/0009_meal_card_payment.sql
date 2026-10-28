-- Ödeme: nakit / kredi kartı / yemek kartı (+ marka). Tekrar çalıştırılabilir.

begin;

alter table public.orders
  add column if not exists meal_card_brand text not null default '';

update public.orders set payment_method = 'card' where payment_method = 'online';

alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders drop constraint if exists orders_payment_method_check1;

alter table public.orders
  add constraint orders_payment_method_check
  check (payment_method in ('cash', 'card', 'meal_card'));

alter table public.orders drop constraint if exists orders_meal_card_brand_check;
alter table public.orders
  add constraint orders_meal_card_brand_check
  check (
    meal_card_brand = ''
    or meal_card_brand in ('multinet', 'sodexo', 'setcard', 'tokenflex', 'ticket')
  );

commit;
