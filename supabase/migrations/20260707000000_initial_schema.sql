-- Yi'Cem Menu — initial schema (single restaurant, multi-language)

create table if not exists public.languages (
  code text primary key,
  name text not null,
  flag text not null default '',
  is_active boolean not null default true,
  is_rtl boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists public.categories (
  id text primary key,
  slug text not null unique,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.category_translations (
  category_id text not null references public.categories (id) on delete cascade,
  lang text not null references public.languages (code) on delete cascade,
  name text not null,
  primary key (category_id, lang)
);

create table if not exists public.products (
  id text primary key,
  category_id text not null references public.categories (id) on delete restrict,
  price numeric(12, 2) not null default 0 check (price >= 0),
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_translations (
  product_id text not null references public.products (id) on delete cascade,
  lang text not null references public.languages (code) on delete cascade,
  name text not null,
  description text not null default '',
  contents jsonb not null default '[]'::jsonb,
  primary key (product_id, lang)
);

create table if not exists public.product_modifiers (
  product_id text not null references public.products (id) on delete cascade,
  modifier_id text not null,
  modifier_type text not null check (
    modifier_type in (
      'option',
      'mainProduct',
      'sideProduct',
      'menuOption',
      'potatoOption',
      'drinkOption'
    )
  ),
  price numeric(12, 2) not null default 0 check (price >= 0),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  primary key (product_id, modifier_id)
);

create table if not exists public.product_modifier_translations (
  product_id text not null,
  modifier_id text not null,
  lang text not null references public.languages (code) on delete cascade,
  label text not null,
  primary key (product_id, modifier_id, lang),
  foreign key (product_id, modifier_id)
    references public.product_modifiers (product_id, modifier_id)
    on delete cascade
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.ui_translations (
  lang text not null references public.languages (code) on delete cascade,
  translation_key text not null,
  value text not null,
  primary key (lang, translation_key)
);

create index if not exists products_category_sort_idx
  on public.products (category_id, is_active, sort_order);

create index if not exists product_modifiers_product_idx
  on public.product_modifiers (product_id, modifier_type, sort_order);

-- RLS
alter table public.languages enable row level security;
alter table public.categories enable row level security;
alter table public.category_translations enable row level security;
alter table public.products enable row level security;
alter table public.product_translations enable row level security;
alter table public.product_modifiers enable row level security;
alter table public.product_modifier_translations enable row level security;
alter table public.site_settings enable row level security;
alter table public.ui_translations enable row level security;

create policy "languages_public_read"
  on public.languages for select to anon, authenticated
  using (is_active = true);

create policy "categories_public_read"
  on public.categories for select to anon, authenticated
  using (is_visible = true);

create policy "category_translations_public_read"
  on public.category_translations for select to anon, authenticated
  using (true);

create policy "products_public_read"
  on public.products for select to anon, authenticated
  using (is_active = true);

create policy "product_translations_public_read"
  on public.product_translations for select to anon, authenticated
  using (true);

create policy "product_modifiers_public_read"
  on public.product_modifiers for select to anon, authenticated
  using (is_active = true);

create policy "product_modifier_translations_public_read"
  on public.product_modifier_translations for select to anon, authenticated
  using (true);

create policy "site_settings_public_read"
  on public.site_settings for select to anon, authenticated
  using (true);

create policy "ui_translations_public_read"
  on public.ui_translations for select to anon, authenticated
  using (true);

-- Seed languages
insert into public.languages (code, name, flag, is_rtl, sort_order) values
  ('tr', 'Türkçe', '🇹🇷', false, 1),
  ('en', 'English', '🇺🇸', false, 2),
  ('ru', 'Русский', '🇷🇺', false, 3),
  ('de', 'Deutsch', '🇩🇪', false, 4),
  ('fr', 'Français', '🇫🇷', false, 5),
  ('ar', 'العربية', '🇸🇦', true, 6)
on conflict (code) do nothing;
