-- Run this in your Supabase SQL Editor to create the required tables

-- Projects table: stores each generation session
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  scenario text not null check (scenario in ('v3', 'v4')),
  product_name text not null,
  product_description text not null,
  input_data jsonb not null default '{}',
  generation_result jsonb,
  status text not null default 'pending' check (status in ('pending', 'generating', 'completed', 'failed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast lookups
create index if not exists idx_projects_scenario on projects (scenario);
create index if not exists idx_projects_status on projects (status);
create index if not exists idx_projects_created_at on projects (created_at desc);

-- Enable Row Level Security (open for now since no auth)
alter table projects enable row level security;

-- Allow all operations (no auth)
create policy "Allow all" on projects for all using (true) with check (true);
