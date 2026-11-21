-- Ortak ek seçenek kataloğu (sabit / menüden / liste) + kategori bağlama
begin;

create table if not exists public.extra_options (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('fixed', 'menu', 'list')),
  selection text not null check (selection in ('single', 'multiple')),
  is_required boolean not null default false,
  price numeric(10, 2) not null default 0 check (price >= 0),
  menu_category_id uuid null references public.categories (id) on delete set null,
  sort_order integer not null default 0,
  constraint extra_options_menu_category_ck check (
    (kind = 'menu' and menu_category_id is not null)
    or (kind <> 'menu' and menu_category_id is null)
  )
);

create table if not exists public.extra_option_translations (
  extra_option_id uuid not null references public.extra_options (id) on delete cascade,
  locale text not null references public.languages (code) on update cascade on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  primary key (extra_option_id, locale)
);

create table if not exists public.extra_option_choices (
  id uuid primary key default gen_random_uuid(),
  extra_option_id uuid not null references public.extra_options (id) on delete cascade,
  price_delta numeric(10, 2) not null default 0 check (price_delta >= 0),
  is_default boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists public.extra_option_choice_translations (
  choice_id uuid not null references public.extra_option_choices (id) on delete cascade,
  locale text not null references public.languages (code) on update cascade on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  primary key (choice_id, locale)
);

create table if not exists public.category_extra_options (
  category_id uuid not null references public.categories (id) on delete cascade,
  extra_option_id uuid not null references public.extra_options (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (category_id, extra_option_id)
);

create index if not exists extra_options_sort_idx on public.extra_options (sort_order);
create index if not exists extra_option_choices_sort_idx
  on public.extra_option_choices (extra_option_id, sort_order);
create index if not exists category_extra_options_sort_idx
  on public.category_extra_options (category_id, sort_order);

alter table public.extra_options enable row level security;
alter table public.extra_option_translations enable row level security;
alter table public.extra_option_choices enable row level security;
alter table public.extra_option_choice_translations enable row level security;
alter table public.category_extra_options enable row level security;

drop policy if exists extra_options_select on public.extra_options;
create policy extra_options_select on public.extra_options
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1
    from public.category_extra_options ceo
    join public.categories c on c.id = ceo.category_id
    where ceo.extra_option_id = extra_options.id
      and c.is_published = true
  )
);

drop policy if exists extra_options_insert on public.extra_options;
create policy extra_options_insert on public.extra_options
for insert to authenticated with check (true);

drop policy if exists extra_options_update on public.extra_options;
create policy extra_options_update on public.extra_options
for update to authenticated using (true) with check (true);

drop policy if exists extra_options_delete on public.extra_options;
create policy extra_options_delete on public.extra_options
for delete to authenticated using (true);

drop policy if exists extra_option_translations_select on public.extra_option_translations;
create policy extra_option_translations_select on public.extra_option_translations
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1
    from public.extra_options eo
    join public.category_extra_options ceo on ceo.extra_option_id = eo.id
    join public.categories c on c.id = ceo.category_id
    where eo.id = extra_option_translations.extra_option_id
      and c.is_published = true
  )
);

drop policy if exists extra_option_translations_insert on public.extra_option_translations;
create policy extra_option_translations_insert on public.extra_option_translations
for insert to authenticated with check (true);

drop policy if exists extra_option_translations_update on public.extra_option_translations;
create policy extra_option_translations_update on public.extra_option_translations
for update to authenticated using (true) with check (true);

drop policy if exists extra_option_translations_delete on public.extra_option_translations;
create policy extra_option_translations_delete on public.extra_option_translations
for delete to authenticated using (true);

drop policy if exists extra_option_choices_select on public.extra_option_choices;
create policy extra_option_choices_select on public.extra_option_choices
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1
    from public.extra_options eo
    join public.category_extra_options ceo on ceo.extra_option_id = eo.id
    join public.categories c on c.id = ceo.category_id
    where eo.id = extra_option_choices.extra_option_id
      and c.is_published = true
  )
);

drop policy if exists extra_option_choices_insert on public.extra_option_choices;
create policy extra_option_choices_insert on public.extra_option_choices
for insert to authenticated with check (true);

drop policy if exists extra_option_choices_update on public.extra_option_choices;
create policy extra_option_choices_update on public.extra_option_choices
for update to authenticated using (true) with check (true);

drop policy if exists extra_option_choices_delete on public.extra_option_choices;
create policy extra_option_choices_delete on public.extra_option_choices
for delete to authenticated using (true);

drop policy if exists extra_option_choice_translations_select on public.extra_option_choice_translations;
create policy extra_option_choice_translations_select on public.extra_option_choice_translations
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1
    from public.extra_option_choices ch
    join public.extra_options eo on eo.id = ch.extra_option_id
    join public.category_extra_options ceo on ceo.extra_option_id = eo.id
    join public.categories c on c.id = ceo.category_id
    where ch.id = extra_option_choice_translations.choice_id
      and c.is_published = true
  )
);

drop policy if exists extra_option_choice_translations_insert on public.extra_option_choice_translations;
create policy extra_option_choice_translations_insert on public.extra_option_choice_translations
for insert to authenticated with check (true);

drop policy if exists extra_option_choice_translations_update on public.extra_option_choice_translations;
create policy extra_option_choice_translations_update on public.extra_option_choice_translations
for update to authenticated using (true) with check (true);

drop policy if exists extra_option_choice_translations_delete on public.extra_option_choice_translations;
create policy extra_option_choice_translations_delete on public.extra_option_choice_translations
for delete to authenticated using (true);

drop policy if exists category_extra_options_select on public.category_extra_options;
create policy category_extra_options_select on public.category_extra_options
for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1 from public.categories c
    where c.id = category_extra_options.category_id
      and c.is_published = true
  )
);

drop policy if exists category_extra_options_insert on public.category_extra_options;
create policy category_extra_options_insert on public.category_extra_options
for insert to authenticated with check (true);

drop policy if exists category_extra_options_update on public.category_extra_options;
create policy category_extra_options_update on public.category_extra_options
for update to authenticated using (true) with check (true);

drop policy if exists category_extra_options_delete on public.category_extra_options;
create policy category_extra_options_delete on public.category_extra_options
for delete to authenticated using (true);

commit;
