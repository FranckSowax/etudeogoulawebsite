# Netlify Functions — RDV en ligne

Fonctions serveur pour la prise de RDV : confirmation WhatsApp,
synchronisation Google Calendar, rappels automatiques, gestion de
l'annulation.

## Arborescence

```
netlify/
├── functions/
│   ├── appointment-created.ts    POST /api/appointments/created
│   ├── appointment-cancel.ts     POST /api/appointments/cancel
│   └── appointment-reminder.ts   Scheduled (*/15 * * * *)
└── lib/
    ├── whapi.ts                  Whapi.cloud client + templates
    ├── gcal.ts                   Google Calendar via Service Account
    └── supabase.ts               Singleton admin client
```

## Flux

### À la création d'un RDV

```
[Wizard] -- INSERT --> [Supabase appointments]
                            |
                            v
[Wizard] -- POST /api/appointments/created --> [Netlify Function]
                                                    |
                                                    +-- POST GCal event (Meet si visio)
                                                    +-- POST WhatsApp via Whapi
                                                    +-- UPDATE row (status='confirmed', gcal_event_id, ...)
```

L'appel HTTP est en *fire-and-forget* depuis le wizard. Si la fonction
échoue, le RDV reste enregistré (statut `pending`) — la fonction est
**idempotente** (vérifie `gcal_event_id` avant de retraiter).

### Au moment d'un rappel J-1 / H-2

```
[Cron */15 min] --> appointment-reminder
                          |
                          +-- SELECT appointments WHERE status IN ('pending','confirmed')
                          +-- POUR chaque RDV non encore rappelé :
                              POST WhatsApp via Whapi
                              UPDATE reminder_24h_sent_at / reminder_2h_sent_at
```

### À l'annulation

```
[Page Annulation] -- RPC cancel_appointment_by_token --> [Supabase]
                            |
                            v
[Page Annulation] -- POST /api/appointments/cancel --> [Netlify Function]
                                                            |
                                                            +-- DELETE GCal event
                                                            +-- POST WhatsApp d'accusé
```

## Variables d'environnement

À configurer dans **Netlify → Site settings → Environment variables** :

| Nom | Notes |
|---|---|
| `SUPABASE_URL` | ex. `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API |
| `WHAPI_TOKEN` | Dashboard Whapi → API Token |
| `GCAL_CALENDAR_ID` | email ou `*@group.calendar.google.com` |
| `GCAL_TIMEZONE` | `Africa/Libreville` |
| `GCAL_SERVICE_ACCOUNT_KEY` | JSON brut OU base64 |
| `SITE_URL` | ex. `https://etudeogoulankondawiri.netlify.app` |

### Préparer le Service Account Google

1. https://console.cloud.google.com/ → créer un projet (ou réutiliser)
2. APIs & Services → activer **Google Calendar API**
3. IAM & Admin → Service Accounts → Create
4. Keys → Add Key → JSON (télécharger le fichier)
5. Dans Google Calendar (calendar.google.com) → ouvrir l'agenda visé
   → Settings → "Share with specific people" → ajouter l'email du
   service account avec le rôle "Make changes to events"
6. Coller le contenu du JSON dans `GCAL_SERVICE_ACCOUNT_KEY` (ou son
   encodage base64 si la valeur dépasse les limites Netlify).

## Tester en local

```bash
npm install -g netlify-cli
netlify login
netlify link        # lie au site Netlify

# Lance Vite + les Netlify Functions sur http://localhost:8888
netlify dev

# Tester l'endpoint manuellement :
curl -X POST http://localhost:8888/api/appointments/created \
  -H "Content-Type: application/json" \
  -d '{"token":"<cancellation_token_d_un_RDV_existant>"}'
```

Variables d'environnement locales : créer `.env` à la racine avec
toutes les vars ci-dessus (Netlify CLI les charge automatiquement).

## Déploiement

Aucun script à lancer : `git push origin main` déclenche le build
Netlify, qui détecte `netlify/functions/` et déploie les fonctions
ainsi que le scheduled trigger.

Les Scheduled Functions sont configurées **dans le code** (champ
`config.schedule`), pas dans le dashboard. Le cron démarre ~10 min
après le premier déploiement.

## Coûts

Forfait Free Netlify :
- Functions : 125k invocations/mois inclus
- Scheduled Functions : comptent comme des invocations standard
- À ~10 RDV/jour, on consomme < 1k invocations/mois → confortable

## Sécurité

- Les fonctions valident le `token` (UUID) ou l'`id` (UUID), pas de PII
  passée par le client.
- Les fonctions sont **idempotentes** (relancer 2× ne crée pas 2 events
  GCal grâce au check `gcal_event_id`).
- La `service_role_key` ne sort jamais de Netlify (utilisée uniquement
  côté serveur). Le client utilise la `anon key` + RLS.
