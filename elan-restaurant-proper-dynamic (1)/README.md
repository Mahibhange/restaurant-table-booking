# ÉLAN Restaurant — Dynamic Vercel Version

This project is a real dynamic website. Menu data and customer requests are stored server-side in Supabase and are managed through the protected admin panel.

## 1. Create the database
Create a Supabase project, open SQL Editor, and run `schema.sql`.

## 2. Add Vercel Environment Variables
Add these to the Vercel project:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_PASSWORD
- NOTIFY_EMAIL
- RESEND_API_KEY (for email notifications)
- FROM_EMAIL (optional)
- META_WA_TOKEN / META_WA_PHONE_ID / WA_RECIPIENT (optional WhatsApp Cloud API)

Never put the Supabase service-role key into frontend JavaScript.

## 3. Deploy
No `vercel.json` is required. Do not add a `functions.runtime` setting. Vercel automatically detects the Node.js serverless functions under `/api`.

Framework: Other
Build command: empty
Output directory: empty

## Admin
Open `/admin/` after deployment. The password is the `ADMIN_PASSWORD` environment variable. The session is server-side authenticated with an HttpOnly cookie.

## Dynamic features
- Admin menu edits update the live menu for all visitors.
- New dishes are stored in the database.
- Menu deletions are permanent.
- Reservation/contact forms save centrally in the database.
- Admin can confirm/cancel requests.
- Email notifications can be sent through Resend.
- WhatsApp notifications can be enabled with Meta Cloud API credentials.
