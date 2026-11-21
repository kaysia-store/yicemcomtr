-- Eski bağımlı seçenek denemesinden kalan sütun PostgREST gömme çakışması yaratıyor
begin;

drop index if exists public.product_options_unlocks_feature_idx;

alter table public.product_options
  drop column if exists unlocks_feature_id;

commit;
