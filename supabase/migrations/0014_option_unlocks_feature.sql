-- Seçenek bir alt özelliği açabilir (ör. Cips+içecek → İçecek)
begin;

alter table public.product_options
  add column if not exists unlocks_feature_id uuid null references public.category_features (id) on delete set null;

create index if not exists product_options_unlocks_feature_idx
  on public.product_options (unlocks_feature_id)
  where unlocks_feature_id is not null;

commit;
