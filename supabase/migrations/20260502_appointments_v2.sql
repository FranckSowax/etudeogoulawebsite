-- Phase 2 — extend appointments with multi-step booking metadata
-- Idempotent: uses IF NOT EXISTS / OR REPLACE so it can be re-applied.

alter table public.appointments
  add column if not exists motif text,
  add column if not exists type text check (type in ('cabinet','visio','telephone')),
  add column if not exists duration_minutes int default 30,
  add column if not exists status text not null default 'pending'
    check (status in ('pending','confirmed','cancelled','completed','no_show')),
  add column if not exists cancellation_token uuid default gen_random_uuid(),
  add column if not exists gcal_event_id text,
  add column if not exists gcal_meet_link text,
  add column if not exists whapi_confirm_message_id text,
  add column if not exists reminder_24h_sent_at timestamptz,
  add column if not exists reminder_2h_sent_at timestamptz,
  add column if not exists created_at timestamptz default now();

-- Backfill cancellation tokens for any pre-existing rows
update public.appointments
set cancellation_token = gen_random_uuid()
where cancellation_token is null;

-- Indexes used by the booking wizard and reminder cron
create index if not exists idx_appointments_date on public.appointments (date);
create index if not exists idx_appointments_token on public.appointments (cancellation_token);
create index if not exists idx_appointments_status on public.appointments (status);

-- Public RPC: returns busy time slots for a date range without exposing PII.
-- Used by the booking wizard to compute available slots client-side.
create or replace function public.get_busy_slots(start_date date, end_date date)
returns table(date date, time text, duration_minutes int)
language sql
security definer
set search_path = public
stable
as $$
  select date,
         time,
         coalesce(duration_minutes, 30) as duration_minutes
  from public.appointments
  where date between start_date and end_date
    and status in ('pending', 'confirmed')
$$;

revoke all on function public.get_busy_slots(date, date) from public;
grant execute on function public.get_busy_slots(date, date) to anon, authenticated;

-- Cancellation RPC: anyone with the cancellation_token can cancel their RDV
create or replace function public.cancel_appointment_by_token(token uuid)
returns table(id uuid, name text, date date, time text, type text, motif text, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  rec record;
begin
  update public.appointments
  set status = 'cancelled'
  where cancellation_token = token
    and status in ('pending', 'confirmed')
  returning * into rec;

  if rec is null then
    return;
  end if;

  return query
  select rec.id, rec.name, rec.date, rec.time, rec.type, rec.motif, rec.status;
end;
$$;

revoke all on function public.cancel_appointment_by_token(uuid) from public;
grant execute on function public.cancel_appointment_by_token(uuid) to anon, authenticated;

-- Lookup RPC: returns a single appointment by token (used by confirmation/cancel pages)
create or replace function public.get_appointment_by_token(token uuid)
returns table(id uuid, name text, date date, time text, type text, motif text, duration_minutes int, status text)
language sql
security definer
set search_path = public
stable
as $$
  select id, name, date, time, type, motif, coalesce(duration_minutes, 30), status
  from public.appointments
  where cancellation_token = token
$$;

revoke all on function public.get_appointment_by_token(uuid) from public;
grant execute on function public.get_appointment_by_token(uuid) to anon, authenticated;
