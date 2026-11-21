-- Ürüne bağlı ek seçenekler QR menüde (anon) görünsün
begin;

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
  or exists (
    select 1
    from public.product_extra_options peo
    join public.products p on p.id = peo.product_id
    join public.categories c on c.id = p.category_id
    where peo.extra_option_id = extra_options.id
      and p.is_published = true
      and c.is_published = true
  )
);

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
  or exists (
    select 1
    from public.extra_options eo
    join public.product_extra_options peo on peo.extra_option_id = eo.id
    join public.products p on p.id = peo.product_id
    join public.categories c on c.id = p.category_id
    where eo.id = extra_option_translations.extra_option_id
      and p.is_published = true
      and c.is_published = true
  )
);

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
  or exists (
    select 1
    from public.extra_options eo
    join public.product_extra_options peo on peo.extra_option_id = eo.id
    join public.products p on p.id = peo.product_id
    join public.categories c on c.id = p.category_id
    where eo.id = extra_option_choices.extra_option_id
      and p.is_published = true
      and c.is_published = true
  )
);

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
  or exists (
    select 1
    from public.extra_option_choices ch
    join public.extra_options eo on eo.id = ch.extra_option_id
    join public.product_extra_options peo on peo.extra_option_id = eo.id
    join public.products p on p.id = peo.product_id
    join public.categories c on c.id = p.category_id
    where ch.id = extra_option_choice_translations.choice_id
      and p.is_published = true
      and c.is_published = true
  )
);

commit;
