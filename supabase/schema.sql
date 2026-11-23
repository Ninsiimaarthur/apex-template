-- =====================================================================
-- Business site template: Supabase schema
-- Run once in: Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Safe to re-run (idempotent).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Admin allow-list
--    Only users listed here can edit content. Being "authenticated" is
--    NOT enough, so a stray sign-up can never write to your tables.
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "Admins can read own row" on public.admins;
create policy "Admins can read own row"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------

-- Single-row table (id is always 1)
create table if not exists public.site_settings (
  id            smallint primary key default 1 check (id = 1),
  business_name text not null default '',
  tagline       text not null default '',
  phone         text not null default '',
  whatsapp      text not null default '',          -- digits only, with country code
  email         text not null default '',
  address       text not null default '',
  hours         jsonb not null default '[]'::jsonb, -- [{"days":"Mon - Fri","time":"8:00 AM - 6:00 PM"}]
  hero_title    text not null default '',
  hero_subtitle text not null default '',
  updated_at    timestamptz not null default now()
);

create table if not exists public.services_products (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  category      text not null default 'General',
  description   text not null default '',
  price_ugx     bigint check (price_ugx is null or price_ugx >= 0), -- null = "Get a quote"
  features_list text[] not null default '{}',
  image_url     text,
  is_featured   boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists services_products_sort_idx
  on public.services_products (sort_order);

create table if not exists public.projects (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  category   text not null default 'General',
  location   text not null default '',
  specs      text,
  summary    text,   -- extra: short description shown on the project card
  image_url  text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. Privileges
-- ---------------------------------------------------------------------
grant select on public.site_settings, public.services_products, public.projects
  to anon, authenticated;
grant insert, update, delete on public.site_settings, public.services_products, public.projects
  to authenticated;

-- ---------------------------------------------------------------------
-- 4. Row-Level Security
--    Anyone can READ. Only admins can INSERT / UPDATE / DELETE.
-- ---------------------------------------------------------------------

-- site_settings
alter table public.site_settings enable row level security;

drop policy if exists "Public can read site_settings" on public.site_settings;
create policy "Public can read site_settings"
  on public.site_settings for select using (true);

drop policy if exists "Admins can insert site_settings" on public.site_settings;
create policy "Admins can insert site_settings"
  on public.site_settings for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update site_settings" on public.site_settings;
create policy "Admins can update site_settings"
  on public.site_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete site_settings" on public.site_settings;
create policy "Admins can delete site_settings"
  on public.site_settings for delete to authenticated
  using (public.is_admin());

-- services_products
alter table public.services_products enable row level security;

drop policy if exists "Public can read services_products" on public.services_products;
create policy "Public can read services_products"
  on public.services_products for select using (true);

drop policy if exists "Admins can insert services_products" on public.services_products;
create policy "Admins can insert services_products"
  on public.services_products for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update services_products" on public.services_products;
create policy "Admins can update services_products"
  on public.services_products for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete services_products" on public.services_products;
create policy "Admins can delete services_products"
  on public.services_products for delete to authenticated
  using (public.is_admin());

-- projects
alter table public.projects enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select using (true);

drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects"
  on public.projects for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects"
  on public.projects for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects"
  on public.projects for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- 5. Storage: public bucket "site-images"
--    (You can also create it by hand: see supabase/README.md, step 5.)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site images" on storage.objects;
create policy "Public can read site images"
  on storage.objects for select
  using (bucket_id = 'site-images');

drop policy if exists "Admins can upload site images" on storage.objects;
create policy "Admins can upload site images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "Admins can update site images" on storage.objects;
create policy "Admins can update site images"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-images' and public.is_admin())
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "Admins can delete site images" on storage.objects;
create policy "Admins can delete site images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

-- ---------------------------------------------------------------------
-- 6. NEXT STEP (manual): make yourself an admin
--    a) Dashboard -> Authentication -> Users -> Add user (email + password)
--    b) Run this, with your email:
--
--    insert into public.admins (user_id)
--    select id from auth.users where email = 'owner@example.com'
--    on conflict do nothing;
-- ---------------------------------------------------------------------
