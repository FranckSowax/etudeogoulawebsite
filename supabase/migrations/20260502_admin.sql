-- Admin extension: staff profiles, unavailabilities, RLS on appointments.
-- Applied via Supabase MCP; stored here for repo history.

-- Staff profiles (linked to Supabase Auth users)
create table if not exists public.staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'secretariat' check (role in ('notaire', 'secretariat')),
  created_at timestamptz default now()
);
alter table public.staff_profiles enable row level security;

create policy "staff_view_own" on public.staff_profiles
  for select using (auth.uid() = id);

-- Unavailabilities: full-day blocks that grey out the booking calendar
create table if not exists public.unavailabilities (
  id uuid primary key default gen_random_uuid(),
  "date" date not null unique,
  reason text,
  created_by uuid references public.staff_profiles(id),
  created_at timestamptz default now()
);
create index if not exists idx_unavailabilities_date on public.unavailabilities ("date");
alter table public.unavailabilities enable row level security;

create policy "public_read_unavailabilities" on public.unavailabilities
  for select using (true);
create policy "staff_manage_unavailabilities" on public.unavailabilities
  for all using (exists (select 1 from public.staff_profiles where id = auth.uid()));

-- RLS on appointments
-- Anon can insert (booking wizard uses anon key)
alter table public.appointments enable row level security;
create policy "anon_insert_appointments" on public.appointments
  for insert to anon with check (true);
-- Staff can read/update all appointments
create policy "staff_select_appointments" on public.appointments
  for select using (exists (select 1 from public.staff_profiles where id = auth.uid()));
create policy "staff_update_appointments" on public.appointments
  for update using (exists (select 1 from public.staff_profiles where id = auth.uid()));

-- Update get_busy_slots to also block unavailable days
create or replace function public.get_busy_slots(start_date date, end_date date)
returns table("date" date, "time" text, duration_minutes int)
language sql security definer set search_path = public stable as $$
  select a.date, a.time, coalesce(a.duration_minutes, 30) as duration_minutes
  from public.appointments a
  where a.date between start_date and end_date
    and a.status in ('pending', 'confirmed')
  union all
  -- Full-day unavailabilities: return a single 9999-min slot that blocks the whole day
  select u."date", '07:30'::text as "time", 9999 as duration_minutes
  from public.unavailabilities u
  where u."date" between start_date and end_date
$$;

revoke all on function public.get_busy_slots(date, date) from public;
grant execute on function public.get_busy_slots(date, date) to anon, authenticated;
