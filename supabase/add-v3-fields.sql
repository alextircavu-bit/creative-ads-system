-- Migration: Add V3 app/feature fields to projects table
-- Run this in your Supabase SQL Editor

-- New columns for V3 (app) scenario
alter table projects add column if not exists app_id text;
alter table projects add column if not exists feature_name text;
alter table projects add column if not exists feature_id text;

-- Index for fast lookups by app_id
create index if not exists idx_projects_app_id on projects (app_id);

-- Backfill existing V3 rows from input_data jsonb (if any exist)
update projects
set
  app_id = lower(regexp_replace(trim(product_name), '[^a-zA-Z0-9]+', '-', 'g')),
  feature_name = input_data->>'featureName',
  feature_id = lower(regexp_replace(trim(coalesce(input_data->>'featureName', '')), '[^a-zA-Z0-9]+', '-', 'g'))
where scenario = 'v3'
  and app_id is null;
