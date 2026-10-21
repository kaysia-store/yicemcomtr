-- Kategori özellikleri ve ürün seçenekleri. 0001_init.sql çalıştıktan sonra bir kez çalıştırın.

begin;

create table public.category_features (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  selection text not null check (selection in ('single', 'multiple')),
  is_required boolean not null default false,
  sort_order integer not null
);

create table public.category_feature_translations (
  feature_id uuid not null references public.category_features (id) on delete cascade,
  locale text not null references public.languages (code) on update cascade on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  primary key (feature_id, locale)
);

create table public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  feature_id uuid not null references public.category_features (id) on delete cascade,
  price_delta numeric(10, 2) not null default 0 check (price_delta >= 0),
  is_default boolean not null default false,
  sort_order integer not null
);

create table public.product_option_translations (
  option_id uuid not null references public.product_options (id) on delete cascade,
  locale text not null references public.languages (code) on update cascade on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  primary key (option_id, locale)
);

create index category_features_sort_idx on public.category_features (category_id, sort_order);
create index product_options_sort_idx on public.product_options (product_id, feature_id, sort_order);

alter table public.category_features enable row level security;
alter table public.category_feature_translations enable row level security;
alter table public.product_options enable row level security;
alter table public.product_option_translations enable row level security;

create policy category_features_select on public.category_features
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1 from public.categories
    where categories.id = category_features.category_id
      and categories.is_published = true
  )
);

create policy category_features_insert on public.category_features
for insert to authenticated with check (true);

create policy category_features_update on public.category_features
for update to authenticated using (true) with check (true);

create policy category_features_delete on public.category_features
for delete to authenticated using (true);

create policy category_feature_translations_select on public.category_feature_translations
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1
    from public.category_features
    join public.categories on categories.id = category_features.category_id
    where category_features.id = category_feature_translations.feature_id
      and categories.is_published = true
  )
);

create policy category_feature_translations_insert on public.category_feature_translations
for insert to authenticated with check (true);

create policy category_feature_translations_update on public.category_feature_translations
for update to authenticated using (true) with check (true);

create policy category_feature_translations_delete on public.category_feature_translations
for delete to authenticated using (true);

create policy product_options_select on public.product_options
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1
    from public.products
    join public.categories on categories.id = products.category_id
    where products.id = product_options.product_id
      and products.is_published = true
      and categories.is_published = true
  )
);

create policy product_options_insert on public.product_options
for insert to authenticated with check (true);

create policy product_options_update on public.product_options
for update to authenticated using (true) with check (true);

create policy product_options_delete on public.product_options
for delete to authenticated using (true);

create policy product_option_translations_select on public.product_option_translations
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1
    from public.product_options
    join public.products on products.id = product_options.product_id
    join public.categories on categories.id = products.category_id
    where product_options.id = product_option_translations.option_id
      and products.is_published = true
      and categories.is_published = true
  )
);

create policy product_option_translations_insert on public.product_option_translations
for insert to authenticated with check (true);

create policy product_option_translations_update on public.product_option_translations
for update to authenticated using (true) with check (true);

create policy product_option_translations_delete on public.product_option_translations
for delete to authenticated using (true);

grant select on
  public.category_features,
  public.category_feature_translations,
  public.product_options,
  public.product_option_translations
to anon;

grant select, insert, update, delete on
  public.category_features,
  public.category_feature_translations,
  public.product_options,
  public.product_option_translations
to authenticated;

commit;
