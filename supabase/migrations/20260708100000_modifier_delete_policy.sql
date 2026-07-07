-- Ek özellik silme (kategori şablonu uygulaması)

create policy "product_modifiers_authenticated_delete"
  on public.product_modifiers for delete to authenticated
  using (true);
