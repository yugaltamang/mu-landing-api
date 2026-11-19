# mu-landing-api

Small API for the landing page editor. Runs on Vercel, stores data in Supabase.

## Environment variables (Vercel → Settings → Environment Variables)

| Name | Value |
|---|---|
| SUPABASE_URL | Supabase Project URL |
| SUPABASE_SECRET_KEY | Supabase Secret key (sb_secret_...) |
| EDITOR_PASSWORD | Long password the marketing team will use |
| ALLOWED_ORIGINS | Comma-separated site URLs, e.g. https://mastersunionuniversity.org,https://staging.example.com |
| WIDGETS_STATIC | (optional, until the widget API is connected) JSON list of {id,name} |
| WIDGET_API_URL / WIDGET_API_KEY | (later) widget provider endpoint and key |

## Endpoints

| Endpoint | Password | What it does |
|---|---|---|
| GET /api/list | yes | All pages incl. drafts |
| POST /api/pages | yes | Create (no id) or update (with id) |
| POST /api/delete | yes | Delete { id } |
| POST /api/upload-url | yes | One-time image upload link |
| GET /api/slug-check?slug= | no | free / taken / reserved / invalid |
| GET /api/widgets | no | Widget dropdown list |

Password is sent in the `x-editor-password` header.

Add every real website route to `RESERVED` in `api/_lib.js`.
