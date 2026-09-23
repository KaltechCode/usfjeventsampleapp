-- Run once in the Supabase SQL Editor before accepting registrations.
create table if not exists public.registrations (
  id uuid primary key,
  name text not null,
  email text not null,
  phone text not null default '',
  city text not null,
  attendees integer not null check (attendees between 1 and 50),
  attendance_type text not null check (attendance_type in ('Attendee','Volunteer')),
  prayer text not null default '',
  consent_version text not null,
  created_at timestamptz not null default now()
);
create index if not exists registrations_created_at_idx on public.registrations (created_at desc);
alter table public.registrations enable row level security;
-- No public policies: only the private server key can read or write this table.
revoke all on table public.registrations from anon, authenticated;
