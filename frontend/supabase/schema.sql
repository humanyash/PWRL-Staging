-- PWRL custom CMS schema (Supabase Postgres).
-- Run this once in the Supabase SQL editor for a fresh project.
-- Content model mirrors frontend/src/types/blocks.ts: page bodies are stored
-- as JSONB `sections` (Block[]); only blog posts have draft state.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  meta_description text,
  seo jsonb not null default '{}'::jsonb,          -- { title, description, ogImage, noindex }
  sections jsonb not null default '[]'::jsonb,      -- Block[]
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  excerpt text,
  card_image jsonb,                                 -- { src, alt }
  hero_image jsonb,                                 -- { src, alt }
  body jsonb not null default '[]'::jsonb,           -- string[]
  sections jsonb not null default '[]'::jsonb,       -- [{ heading, paragraphs[] }]
  seo jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  published_label text,
  date text,
  updated_at timestamptz not null default now()
);

create table if not exists public.global_settings (
  id int primary key default 1 check (id = 1),
  banner jsonb,                                     -- { text, href, enabled }
  logo jsonb,                                       -- { src, alt }
  nav jsonb not null default '[]'::jsonb,
  footer_links jsonb not null default '[]'::jsonb,
  socials jsonb not null default '[]'::jsonb,
  disclaimers jsonb not null default '[]'::jsonb,   -- string[]
  legal_text text,
  copyright text,
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                        -- 'legal' | 'terms'
  title text not null default '',
  meta_description text,
  body text not null default '',                    -- HTML
  effective_date date,
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,                        -- storage object path
  url text not null,                                -- public URL
  alt text,
  content_type text,
  size int,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security: public may READ published content; writes go through
-- the service-role key (which bypasses RLS) inside authenticated actions.
-- ---------------------------------------------------------------------------

alter table public.pages            enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.global_settings  enable row level security;
alter table public.legal_pages      enable row level security;
alter table public.media            enable row level security;

drop policy if exists "public read pages"          on public.pages;
drop policy if exists "public read published blog" on public.blog_posts;
drop policy if exists "public read settings"       on public.global_settings;
drop policy if exists "public read legal"          on public.legal_pages;
drop policy if exists "public read media"          on public.media;

create policy "public read pages"          on public.pages           for select using (true);
create policy "public read published blog" on public.blog_posts      for select using (status = 'published');
create policy "public read settings"       on public.global_settings for select using (true);
create policy "public read legal"          on public.legal_pages     for select using (true);
create policy "public read media"          on public.media           for select using (true);

-- ---------------------------------------------------------------------------
-- Storage: public media bucket
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media objects" on storage.objects;
create policy "public read media objects"
  on storage.objects for select
  using (bucket_id = 'media');
