-- Audit log + kategori ekleme

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  user_email text,
  entity_type text not null,
  entity_id text not null,
  action text not null check (action in ('create', 'update', 'reorder', 'delete')),
  summary text not null default '',
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_at_idx on public.audit_log (created_at desc);

alter table public.audit_log enable row level security;

create policy "audit_log_authenticated_read"
  on public.audit_log for select to authenticated
  using (true);

create policy "audit_log_authenticated_insert"
  on public.audit_log for insert to authenticated
  with check (true);

create policy "categories_authenticated_insert"
  on public.categories for insert to authenticated
  with check (true);
