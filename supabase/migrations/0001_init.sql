-- QR menü şeması. Supabase SQL Editor'da bir kez çalıştırın.
-- Service role tarayıcıya konmaz. Yazma yalnızca authenticated admin içindir.

begin;

create or replace function public.protect_default_language()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    if old.is_default then
      raise exception 'Varsayılan dil silinemez';
    end if;
    return old;
  end if;

  if old.is_default and (new.is_active = false or new.is_default = false) then
    raise exception 'Varsayılan dil kapatılamaz';
  end if;

  return new;
end;
$$;

revoke all on function public.protect_default_language() from public, anon, authenticated;

create table public.languages (
  code text primary key check (code ~ '^[a-z]{2}(-[a-z]{2})?$'),
  name text not null check (char_length(trim(name)) between 2 and 40),
  is_default boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null
);

create unique index languages_one_default on public.languages (is_default) where is_default;

create trigger languages_protect_default
before update or delete on public.languages
for each row execute function public.protect_default_language();

insert into public.languages (code, name, is_default, is_active, sort_order)
values ('tr', 'Türkçe', true, true, 0);

create table public.restaurant_settings (
  id integer primary key check (id = 1),
  name text not null check (char_length(trim(name)) between 1 and 80),
  default_locale text not null references public.languages (code)
);

insert into public.restaurant_settings (id, name, default_locale)
values (1, 'Restoran', 'tr');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.category_translations (
  category_id uuid not null references public.categories (id) on delete cascade,
  locale text not null references public.languages (code) on update cascade on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  primary key (category_id, locale)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  price numeric(10, 2) not null check (price >= 0),
  image_path text,
  sort_order integer not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.product_translations (
  product_id uuid not null references public.products (id) on delete cascade,
  locale text not null references public.languages (code) on update cascade on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  description text not null default '',
  ingredients text not null default '',
  primary key (product_id, locale),
  check (char_length(description) <= 2000),
  check (char_length(ingredients) <= 2000)
);

create table public.allergens (
  code text primary key,
  sort_order integer not null unique
);

create table public.allergen_translations (
  allergen_code text not null references public.allergens (code) on delete cascade,
  locale text not null references public.languages (code) on update cascade on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  primary key (allergen_code, locale)
);

create table public.product_allergens (
  product_id uuid not null references public.products (id) on delete cascade,
  allergen_code text not null references public.allergens (code) on delete restrict,
  primary key (product_id, allergen_code)
);

create index categories_sort_idx on public.categories (sort_order);
create index products_category_sort_idx on public.products (category_id, sort_order);

insert into public.allergens (code, sort_order) values
  ('gluten', 1),
  ('crustaceans', 2),
  ('eggs', 3),
  ('fish', 4),
  ('peanuts', 5),
  ('soybeans', 6),
  ('milk', 7),
  ('nuts', 8),
  ('celery', 9),
  ('mustard', 10),
  ('sesame', 11),
  ('sulphites', 12),
  ('lupin', 13),
  ('molluscs', 14);

insert into public.allergen_translations (allergen_code, locale, name) values
  ('gluten', 'tr', 'Gluten'),
  ('crustaceans', 'tr', 'Kabuklular'),
  ('eggs', 'tr', 'Yumurta'),
  ('fish', 'tr', 'Balık'),
  ('peanuts', 'tr', 'Yer fıstığı'),
  ('soybeans', 'tr', 'Soya'),
  ('milk', 'tr', 'Süt'),
  ('nuts', 'tr', 'Sert kabuklu meyveler'),
  ('celery', 'tr', 'Kereviz'),
  ('mustard', 'tr', 'Hardal'),
  ('sesame', 'tr', 'Susam'),
  ('sulphites', 'tr', 'Sülfitler'),
  ('lupin', 'tr', 'Acı bakla'),
  ('molluscs', 'tr', 'Yumuşakçalar');

alter table public.languages enable row level security;
alter table public.restaurant_settings enable row level security;
alter table public.categories enable row level security;
alter table public.category_translations enable row level security;
alter table public.products enable row level security;
alter table public.product_translations enable row level security;
alter table public.allergens enable row level security;
alter table public.allergen_translations enable row level security;
alter table public.product_allergens enable row level security;

create policy languages_select on public.languages
for select using (is_active = true or (select auth.role()) = 'authenticated');

create policy languages_insert on public.languages
for insert to authenticated with check (is_default = false);

create policy languages_update on public.languages
for update to authenticated using (true) with check (true);

create policy languages_delete on public.languages
for delete to authenticated using (is_default = false);

create policy restaurant_settings_select on public.restaurant_settings
for select using (true);

create policy restaurant_settings_update on public.restaurant_settings
for update to authenticated using (true) with check (true);

create policy categories_select on public.categories
for select using (is_published = true or (select auth.role()) = 'authenticated');

create policy categories_insert on public.categories
for insert to authenticated with check (true);

create policy categories_update on public.categories
for update to authenticated using (true) with check (true);

create policy categories_delete on public.categories
for delete to authenticated using (true);

create policy category_translations_select on public.category_translations
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1 from public.categories
    where categories.id = category_translations.category_id
      and categories.is_published = true
  )
);

create policy category_translations_insert on public.category_translations
for insert to authenticated with check (true);

create policy category_translations_update on public.category_translations
for update to authenticated using (true) with check (true);

create policy category_translations_delete on public.category_translations
for delete to authenticated using (true);

create policy products_select on public.products
for select using (
  (select auth.role()) = 'authenticated'
  or (
    is_published = true
    and exists (
      select 1 from public.categories
      where categories.id = products.category_id
        and categories.is_published = true
    )
  )
);

create policy products_insert on public.products
for insert to authenticated with check (true);

create policy products_update on public.products
for update to authenticated using (true) with check (true);

create policy products_delete on public.products
for delete to authenticated using (true);

create policy product_translations_select on public.product_translations
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1
    from public.products
    join public.categories on categories.id = products.category_id
    where products.id = product_translations.product_id
      and products.is_published = true
      and categories.is_published = true
  )
);

create policy product_translations_insert on public.product_translations
for insert to authenticated with check (true);

create policy product_translations_update on public.product_translations
for update to authenticated using (true) with check (true);

create policy product_translations_delete on public.product_translations
for delete to authenticated using (true);

create policy allergens_select on public.allergens
for select using (true);

create policy allergen_translations_select on public.allergen_translations
for select using (true);

create policy allergen_translations_insert on public.allergen_translations
for insert to authenticated with check (true);

create policy allergen_translations_update on public.allergen_translations
for update to authenticated using (true) with check (true);

create policy allergen_translations_delete on public.allergen_translations
for delete to authenticated using (true);

create policy product_allergens_select on public.product_allergens
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1
    from public.products
    join public.categories on categories.id = products.category_id
    where products.id = product_allergens.product_id
      and products.is_published = true
      and categories.is_published = true
  )
);

create policy product_allergens_insert on public.product_allergens
for insert to authenticated with check (true);

create policy product_allergens_update on public.product_allergens
for update to authenticated using (true) with check (true);

create policy product_allergens_delete on public.product_allergens
for delete to authenticated using (true);

grant select on
  public.restaurant_settings,
  public.languages,
  public.categories,
  public.category_translations,
  public.products,
  public.product_translations,
  public.allergens,
  public.allergen_translations,
  public.product_allergens
to anon;

grant select, insert, update, delete on
  public.restaurant_settings,
  public.languages,
  public.categories,
  public.category_translations,
  public.products,
  public.product_translations,
  public.allergens,
  public.allergen_translations,
  public.product_allergens
to authenticated;

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

create policy menu_images_public_read on storage.objects
for select using (bucket_id = 'menu-images');

create policy menu_images_admin_insert on storage.objects
for insert to authenticated
with check (bucket_id = 'menu-images');

create policy menu_images_admin_update on storage.objects
for update to authenticated
using (bucket_id = 'menu-images')
with check (bucket_id = 'menu-images');

create policy menu_images_admin_delete on storage.objects
for delete to authenticated
using (bucket_id = 'menu-images');

commit;
