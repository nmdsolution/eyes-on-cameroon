-- Eyes on Cameroon — Supabase PostgreSQL schema

-- Articles / News
create table if not exists public.articles (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  excerpt     text,
  content     text,
  cover_url   text,
  locale      text not null default 'de',
  published_at timestamptz default now(),
  created_at  timestamptz default now()
);

-- Events
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  slug        text,
  title       text not null,
  description text,
  date        timestamptz not null,
  end_date    timestamptz,
  location    text,
  image_url   text,
  content_img text,
  locale      text not null default 'de',
  created_at  timestamptz default now()
);

-- Team members
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text not null,
  bio         text,
  photo_url   text,
  "order"     int default 0,
  locale      text not null default 'de',
  created_at  timestamptz default now()
);

-- Partners
create table if not exists public.partners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  logo_url    text,
  website     text,
  "order"     int default 0,
  locale      text not null default 'de',
  created_at  timestamptz default now()
);

-- Pub banners (home page event slider)
create table if not exists public.pub_banners (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  media_url   text not null,
  media_type  text not null default 'image' check (media_type in ('image', 'video')),
  link_url    text,
  active      boolean not null default true,
  sort_order  int not null default 0,
  locale      text not null default 'de',
  created_at  timestamptz default now()
);

-- Hero media settings (video or fixed image)
create table if not exists public.hero_settings (
  id          uuid primary key default gen_random_uuid(),
  media_type  text not null default 'video', -- 'video' | 'image'
  video_url   text,
  image_url   text,
  updated_at  timestamptz default now()
);

-- Migration for existing rows (run if table already exists)
-- ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'video';
-- ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS image_url text;

-- Migration: add locale column to team_members, partners, pub_banners (run if tables already exist)
-- ALTER TABLE public.team_members  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'de';
-- ALTER TABLE public.partners      ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'de';
-- ALTER TABLE public.pub_banners   ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'de';

-- Migration: add slug column to events (links translation rows of the same event)
-- ALTER TABLE public.events ADD COLUMN IF NOT EXISTS slug text;

-- Contact messages
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  created_at  timestamptz default now()
);

-- Members (linked to auth.users)
create table if not exists public.members (
  id           uuid primary key references auth.users(id) on delete cascade,
  first_name   text not null default '',
  last_name    text not null default '',
  phone        text,
  city         text,
  motivation   text,
  is_admin     boolean not null default false,
  joined_at    timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Migration for existing table (run if table already exists):
-- ALTER TABLE public.members ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;
-- To grant admin rights to a user:
-- UPDATE public.members SET is_admin = true WHERE id = '<user-uuid>';

-- Auto-create member record on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.members (id, first_name, last_name, phone, city, motivation)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'motivation'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.articles        enable row level security;
alter table public.events          enable row level security;
alter table public.team_members    enable row level security;
alter table public.partners        enable row level security;
alter table public.contact_messages enable row level security;
alter table public.pub_banners     enable row level security;
alter table public.hero_settings   enable row level security;

-- Public read for articles, events, team, partners
create policy "Public read articles"     on public.articles        for select using (true);
create policy "Public read events"       on public.events          for select using (true);
create policy "Public read team"         on public.team_members    for select using (true);
create policy "Public read partners"     on public.partners        for select using (true);

-- Only authenticated admins can insert/update/delete
create policy "Admin write articles"     on public.articles        for all using (auth.role() = 'authenticated');
create policy "Admin write events"       on public.events          for all using (auth.role() = 'authenticated');
create policy "Admin write team"         on public.team_members    for all using (auth.role() = 'authenticated');
create policy "Admin write partners"     on public.partners        for all using (auth.role() = 'authenticated');
create policy "Public read pub_banners"  on public.pub_banners     for select using (active = true);
create policy "Admin write pub_banners"  on public.pub_banners     for all using (auth.role() = 'authenticated');
create policy "Public read hero_settings" on public.hero_settings   for select using (true);
create policy "Admin write hero_settings" on public.hero_settings   for all using (auth.role() = 'authenticated');

-- Anyone can submit contact messages
create policy "Public insert contact"    on public.contact_messages for insert with check (true);
create policy "Admin read contact"       on public.contact_messages for select using (auth.role() = 'authenticated');

-- Members RLS
alter table public.members enable row level security;
create policy "Members read own"   on public.members for select using (auth.uid() = id);
create policy "Members update own" on public.members for update using (auth.uid() = id);
create policy "Members insert own" on public.members for insert with check (auth.uid() = id);
