# Supabase — Phase 2 (RDV en ligne)

## Contenu

- `migrations/20260502_appointments_v2.sql` — étend la table `appointments` (motif, type, durée, statut, token d'annulation, IDs GCal/Whapi, horodatages des rappels) et expose 3 RPC publiques :
  - `get_busy_slots(start_date, end_date)` — retourne uniquement les créneaux pris (date/heure/durée), sans données personnelles. Utilisé par le wizard front pour calculer les disponibilités.
  - `cancel_appointment_by_token(uuid)` — annulation 1-clic via le lien envoyé par WhatsApp.
  - `get_appointment_by_token(uuid)` — récap pour la page de confirmation.

- `functions/appointment-created/` — déclenchée à l'insertion d'un rendez-vous : crée un événement Google Calendar (avec lien Meet si visio) et envoie la confirmation WhatsApp via Whapi.
- `functions/appointment-reminder/` — programmée toutes les 15 min : envoie le rappel J-1 et H-2 par WhatsApp.
- `functions/appointment-cancel/` — déclenchée quand un statut passe à `cancelled` : supprime l'événement GCal + envoie un message WhatsApp d'accusé d'annulation.

## Déploiement

### 1. Appliquer la migration

```bash
# Avec la CLI Supabase liée au projet :
supabase db push

# Ou directement via SQL Editor : copier-coller le contenu de
# migrations/20260502_appointments_v2.sql
```

### 2. Variables d'environnement (Settings → Functions → Secrets)

```
SUPABASE_URL                   = https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY      = (copié depuis Project Settings → API)
SITE_URL                       = https://etudeogoulankondawiri.netlify.app

WHAPI_TOKEN                    = (depuis le dashboard Whapi)

GCAL_CALENDAR_ID               = cabinet@notaire-nkondawiri.ga (ou …@group.calendar.google.com)
GCAL_TIMEZONE                  = Africa/Libreville
GCAL_SERVICE_ACCOUNT_KEY       = (JSON brut OU base64 de la clé)
```

Pour le compte de service Google : créer un projet GCP → activer l'API Google
Calendar → créer un service account → générer une clé JSON → partager l'agenda
visé avec l'email du service account (rôle « apporter des modifications aux
événements »).

### 3. Déployer les fonctions

```bash
supabase functions deploy appointment-created
supabase functions deploy appointment-reminder
supabase functions deploy appointment-cancel
```

### 4. Déclencher `appointment-created` à l'insertion

Deux options :

**A. Database Webhook (recommandé)**
Project Settings → Database → Webhooks → Create webhook :
- Table : `appointments`
- Events : `Insert`
- Type : Supabase Edge Function
- Function : `appointment-created`

**B. Postgres Trigger via `pg_net`**
```sql
create or replace function public.notify_appointment_created()
returns trigger language plpgsql security definer as $$
begin
  perform net.http_post(
    url := current_setting('app.functions_url') || '/appointment-created',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  return NEW;
end$$;

create trigger appointments_after_insert
after insert on public.appointments
for each row execute function public.notify_appointment_created();
```

### 5. Cron pour les rappels (J-1 et H-2)

Project Settings → Edge Functions → Schedules :
- Function : `appointment-reminder`
- Schedule : `*/15 * * * *` (toutes les 15 min)

### 6. Webhook d'annulation

Database Webhook sur `appointments` :
- Events : `Update`
- Filter (optionnel) : `status = 'cancelled'`
- Function : `appointment-cancel`

## Tester en local (CLI)

```bash
supabase start
supabase functions serve --env-file ./supabase/.env.local

# Tester appointment-created :
curl -X POST http://localhost:54321/functions/v1/appointment-created \
  -H "Content-Type: application/json" \
  -d '{"record":{"id":"...","name":"Jean","phone":"+24107000000","date":"2026-05-15","time":"10:00","type":"cabinet","motif":"Achat immobilier","duration_minutes":45,"cancellation_token":"..."}}'
```

## Sécurité

- Les RPC `get_busy_slots`, `cancel_appointment_by_token` et `get_appointment_by_token` sont en `security definer` mais **ne renvoient pas** d'informations personnelles à l'anon (pas de nom, téléphone, email).
- Le token d'annulation est un UUID v4 (~122 bits d'entropie), valable une seule fois côté pratique (l'annulation est idempotente sur un statut déjà `cancelled`).
- Les Edge Functions tournent côté serveur et peuvent utiliser la `service_role_key` sans l'exposer au client.
