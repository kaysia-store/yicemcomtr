-- Ek seçenekleri tek veya birden fazla ürüne bağlama
begin;

create table if not exists public.product_extra_options (
  product_id uuid not null references public.products (id) on delete cascade,
  extra_option_id uuid not null references public.extra_options (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (product_id, extra_option_id)
);

create index if not exists product_extra_options_sort_idx
  on public.product_extra_options (product_id, sort_order);

create index if not exists product_extra_options_extra_idx
  on public.product_extra_options (extra_option_id);

alter table public.product_extra_options enable row level security;

drop policy if exists product_extra_options_select on public.product_extra_options;
create policy product_extra_options_select on public.product_extra_options
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1
    from public.products p
    join public.categories c on c.id = p.category_id
    where p.id = product_extra_options.product_id
      and p.is_published = true
      and c.is_published = true
  )
);

drop policy if exists product_extra_options_insert on public.product_extra_options;
create policy product_extra_options_insert on public.product_extra_options
for insert to authenticated with check (true);

drop policy if exists product_extra_options_update on public.product_extra_options;
create policy product_extra_options_update on public.product_extra_options
for update to authenticated using (true) with check (true);

drop policy if exists product_extra_options_delete on public.product_extra_options;
create policy product_extra_options_delete on public.product_extra_options
for delete to authenticated using (true);

commit;
