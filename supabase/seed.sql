-- Seed data for testing
-- Note: Profiles are auto-created via trigger when users sign up through Supabase Auth.
-- This file provides sample data for manual testing.

-- Insert a test IP entry for anonymous rate-limit testing
insert into public.ip_checks (ip_address, checks_today, last_reset)
values ('127.0.0.1', 0, current_date)
on conflict (ip_address) do nothing;
