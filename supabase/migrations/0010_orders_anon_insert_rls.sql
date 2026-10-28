-- Müşteri siparişinin anon ile yazılabilmesi. Tekrar çalıştırılabilir.

begin;

grant insert on public.orders to anon;
grant insert on public.orders to authenticated;

drop policy if exists orders_anon_insert on public.orders;
create policy orders_anon_insert on public.orders
for insert to anon
with check (true);

-- Bazı ortamlarda authenticated oturumuyla da menüden deneme olabilir
drop policy if exists orders_authenticated_insert on public.orders;
create policy orders_authenticated_insert on public.orders
for insert to authenticated
with check (true);

commit;

-- Kontrol:
-- select polname, roles, cmd from pg_policies where tablename = 'orders';
