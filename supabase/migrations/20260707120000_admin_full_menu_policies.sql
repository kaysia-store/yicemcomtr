-- Admin tam menü yönetimi + görsel storage

-- Kategori
create policy "categories_authenticated_update"
  on public.categories for update to authenticated
  using (true) with check (true);

create policy "category_translations_authenticated_write"
  on public.category_translations for all to authenticated
  using (true) with check (true);

-- Ürün
create policy "products_authenticated_insert"
  on public.products for insert to authenticated
  with check (true);

create policy "product_translations_authenticated_write"
  on public.product_translations for all to authenticated
  using (true) with check (true);

-- Ekstralar
create policy "product_modifiers_authenticated_insert"
  on public.product_modifiers for insert to authenticated
  with check (true);

create policy "product_modifier_translations_authenticated_write"
  on public.product_modifier_translations for all to authenticated
  using (true) with check (true);

-- Storage: menü görselleri
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "menu_images_public_read"
  on storage.objects for select
  using (bucket_id = 'menu-images');

create policy "menu_images_auth_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'menu-images');

create policy "menu_images_auth_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'menu-images');

create policy "menu_images_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'menu-images');
