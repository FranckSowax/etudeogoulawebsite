# Supabase — schéma & RPC

Cette partie ne contient désormais plus que la migration SQL.
Les fonctions serveur (notifications WhatsApp, sync Google Calendar,
rappels automatiques) sont implémentées en **Netlify Functions** —
voir [`netlify/README.md`](../netlify/README.md).

## Migration

`migrations/20260502_appointments_v2.sql` étend la table `appointments`
et expose 3 RPC publiques (security definer, sans fuite de PII vers
l'anon key) :

- `get_busy_slots(start_date, end_date)` — créneaux pris pour le wizard
- `cancel_appointment_by_token(uuid)` — annulation 1-clic
- `get_appointment_by_token(uuid)` — récap pour la page de confirmation

### Appliquer

```bash
# Avec la CLI Supabase liée :
supabase db push

# Ou directement dans le SQL Editor du dashboard :
# copier-coller le contenu de migrations/20260502_appointments_v2.sql
```

La migration est idempotente (`if not exists` / `or replace`) et peut
être ré-appliquée sans risque.

## Variables d'environnement

Dans Netlify (Site settings → Environment variables) :

| Nom | Description |
|---|---|
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (Project Settings → API) |
| `WHAPI_TOKEN` | Token Whapi.cloud |
| `GCAL_CALENDAR_ID` | ID de l'agenda Google partagé |
| `GCAL_TIMEZONE` | `Africa/Libreville` |
| `GCAL_SERVICE_ACCOUNT_KEY` | Clé JSON du Service Account (raw ou base64) |
| `SITE_URL` | URL publique du site (ex. `https://etudeogoulankondawiri.netlify.app`) |

Les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` doivent
aussi être présentes pour le client Vite.

## Sécurité

- Les RPC sont en `security definer` mais ne renvoient pas le
  téléphone, l'email, le nom (sauf pour `get_appointment_by_token`,
  qui exige le token aléatoire en input).
- Le `cancellation_token` est un UUID v4 (~122 bits d'entropie).
- La `service_role_key` ne quitte jamais Netlify (utilisée uniquement
  côté Functions, jamais exposée au client).
