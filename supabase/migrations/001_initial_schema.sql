-- CLAUDIO: Content Management Dashboard Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================================
-- 1. Profiles (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. Instagram Posts
-- ============================================================
create type post_type as enum ('image', 'carousel', 'reel', 'story');
create type post_status as enum ('scheduled', 'draft', 'published', 'backlog');

create table public.instagram_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  caption text not null,
  post_type post_type not null default 'image',
  status post_status not null default 'backlog',
  scheduled_date date,
  published_date date,
  tags text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.instagram_posts enable row level security;

create policy "Users can manage own posts"
  on public.instagram_posts for all
  using (auth.uid() = user_id);

create index idx_instagram_posts_user on public.instagram_posts(user_id);
create index idx_instagram_posts_status on public.instagram_posts(user_id, status);

-- ============================================================
-- 3. Competitors
-- ============================================================
create table public.competitors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  notes text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.competitors enable row level security;

create policy "Users can manage own competitors"
  on public.competitors for all
  using (auth.uid() = user_id);

create index idx_competitors_user on public.competitors(user_id);

-- ============================================================
-- 4. Competitor Accounts (multi-platform)
-- ============================================================
create type social_platform as enum ('instagram', 'youtube', 'tiktok', 'twitter', 'linkedin', 'facebook');

create table public.competitor_accounts (
  id uuid default gen_random_uuid() primary key,
  competitor_id uuid references public.competitors(id) on delete cascade not null,
  platform social_platform not null,
  handle text not null,
  followers integer default 0,
  followers_growth numeric(5,2) default 0,
  engagement_rate numeric(5,2) default 0,
  posts_per_week numeric(4,1) default 0,
  last_post_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.competitor_accounts enable row level security;

-- RLS through parent competitor
create policy "Users can manage own competitor accounts"
  on public.competitor_accounts for all
  using (
    exists (
      select 1 from public.competitors
      where competitors.id = competitor_accounts.competitor_id
      and competitors.user_id = auth.uid()
    )
  );

create index idx_competitor_accounts_competitor on public.competitor_accounts(competitor_id);

-- ============================================================
-- 5. Calendar Items
-- ============================================================
create type content_status as enum ('scheduled', 'published', 'draft');

create table public.calendar_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  platform social_platform not null,
  status content_status not null default 'draft',
  content_type text not null default 'post',
  date date not null,
  time time,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.calendar_items enable row level security;

create policy "Users can manage own calendar items"
  on public.calendar_items for all
  using (auth.uid() = user_id);

create index idx_calendar_items_user_date on public.calendar_items(user_id, date);

-- ============================================================
-- 6. Saved News
-- ============================================================
create table public.saved_news (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  source text not null,
  topic text not null,
  saved_at timestamptz default now() not null
);

alter table public.saved_news enable row level security;

create policy "Users can manage own saved news"
  on public.saved_news for all
  using (auth.uid() = user_id);

create index idx_saved_news_user on public.saved_news(user_id);

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_instagram_posts_updated_at
  before update on public.instagram_posts
  for each row execute function public.update_updated_at();

create trigger update_competitors_updated_at
  before update on public.competitors
  for each row execute function public.update_updated_at();

create trigger update_competitor_accounts_updated_at
  before update on public.competitor_accounts
  for each row execute function public.update_updated_at();

create trigger update_calendar_items_updated_at
  before update on public.calendar_items
  for each row execute function public.update_updated_at();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();
