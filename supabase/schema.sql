-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  tier text not null default 'free' check (tier in ('free', 'pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  checks_today integer not null default 0,
  last_check_reset date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Checks table
create table public.checks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  input_text text not null,
  result_json jsonb not null,
  scam_score integer,
  verdict text,
  scam_type text,
  ip_address inet,
  created_at timestamptz not null default now()
);

-- Index for fast history queries
create index idx_checks_user_id on public.checks(user_id);
create index idx_checks_created_at on public.checks(created_at desc);
create index idx_checks_user_created on public.checks(user_id, created_at desc);

-- IP-based rate tracking for anonymous users
create table public.ip_checks (
  ip_address inet primary key,
  checks_today integer not null default 0,
  last_reset date not null default current_date
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.checks enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Checks: users can read their own checks
create policy "Users can view own checks" on public.checks
  for select using (auth.uid() = user_id);
-- Checks: insert allowed via service role (API route)
create policy "Service can insert checks" on public.checks
  for insert with check (true);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to reset daily check counters
create or replace function public.reset_daily_checks()
returns void as $$
begin
  update public.profiles
  set checks_today = 0, last_check_reset = current_date
  where last_check_reset < current_date;

  update public.ip_checks
  set checks_today = 0, last_reset = current_date
  where last_reset < current_date;
end;
$$ language plpgsql security definer;
