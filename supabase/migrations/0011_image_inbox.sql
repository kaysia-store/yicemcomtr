-- Bekleyen (eşleşmemiş) görseller havuzu
begin;

create table if not exists public.image_inbox (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  original_name text not null,
  content_type text not null,
  size_bytes integer not null check (size_bytes > 0),
  created_at timestamptz not null default now()
);

create index if not exists image_inbox_created_at_idx on public.image_inbox (created_at desc);

alter table public.image_inbox enable row level security;

drop policy if exists image_inbox_select_auth on public.image_inbox;
create policy image_inbox_select_auth on public.image_inbox
for select to authenticated using (true);

drop policy if exists image_inbox_insert_auth on public.image_inbox;
create policy image_inbox_insert_auth on public.image_inbox
for insert to authenticated with check (true);

drop policy if exists image_inbox_delete_auth on public.image_inbox;
create policy image_inbox_delete_auth on public.image_inbox
for delete to authenticated using (true);

grant select, insert, delete on public.image_inbox to authenticated;

commit;
