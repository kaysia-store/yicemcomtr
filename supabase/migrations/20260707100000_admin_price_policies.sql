-- Admin fiyat güncelleme — authenticated kullanıcılar için okuma/yazma

-- Tüm ürünleri gör (aktif + pasif)
create policy "products_authenticated_read_all"
  on public.products for select to authenticated
  using (true);

create policy "products_authenticated_update"
  on public.products for update to authenticated
  using (true)
  with check (true);

-- Tüm ekstraları gör
create policy "product_modifiers_authenticated_read_all"
  on public.product_modifiers for select to authenticated
  using (true);

create policy "product_modifiers_authenticated_update"
  on public.product_modifiers for update to authenticated
  using (true)
  with check (true);

-- Kategoriler (admin listesi için)
create policy "categories_authenticated_read_all"
  on public.categories for select to authenticated
  using (true);
