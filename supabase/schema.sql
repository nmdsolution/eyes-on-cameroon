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
  title       text not null,
  description text,
  date        timestamptz not null,
  end_date    timestamptz,
  location    text,
  image_url   text,
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
  created_at  timestamptz default now()
);

-- Contact messages
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  created_at  timestamptz default now()
);

-- Row Level Security
alter table public.articles        enable row level security;
alter table public.events          enable row level security;
alter table public.team_members    enable row level security;
alter table public.partners        enable row level security;
alter table public.contact_messages enable row level security;

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

-- Anyone can submit contact messages
create policy "Public insert contact"    on public.contact_messages for insert with check (true);
create policy "Admin read contact"       on public.contact_messages for select using (auth.role() = 'authenticated');
