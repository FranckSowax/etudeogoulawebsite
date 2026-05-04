-- Fix: l'INSERT du wizard de RDV échouait avec 403 si l'utilisateur
-- était connecté (rôle authenticated) — la policy initiale était
-- restreinte à `anon`. On élargit aux deux rôles + on nettoie un doublon.
--
-- Appliqué via Supabase MCP — persisté ici pour l'historique du repo.

drop policy if exists allow_anon_insert_appointments on public.appointments;
drop policy if exists anon_insert_appointments        on public.appointments;

create policy "public_insert_appointments"
  on public.appointments
  for insert
  to anon, authenticated
  with check (true);
