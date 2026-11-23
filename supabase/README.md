# Supabase setup

The site works without Supabase (it falls back to `src/config/siteConfig.ts`).
Follow these steps to let the business owner edit content from `/admin`.

## 1. Create a project
Go to https://supabase.com, create a project, then open
**Project Settings -> API** and copy the **Project URL** and the **anon public** key.

## 2. Add environment variables
Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

On Vercel (or any host) add the same two variables, then redeploy.
Never put the `service_role` key in these variables.

## 3. Run the schema
**SQL Editor -> New query**, paste `supabase/schema.sql`, click **Run**.
This creates the tables, Row-Level Security policies, the `site-images` bucket
and its storage policies.

## 4. Create the admin user
1. **Authentication -> Users -> Add user -> Create new user** (email + password,
   tick "Auto Confirm User").
2. In the SQL Editor run (use your email):

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'owner@example.com'
on conflict do nothing;
```

3. **Authentication -> Sign In / Providers -> Email**: turn **off** "Allow new
   users to sign up". Only users in the `admins` table can edit content, but
   there is no reason to leave sign-ups open.

## 5. Storage bucket (`site-images`)
`schema.sql` already creates it. To create it by hand instead:

1. **Storage -> New bucket**, name `site-images`, switch **Public bucket** on.
2. Under the bucket settings set file size limit to 5 MB and allowed types to
   `image/jpeg, image/png, image/webp, image/gif`.
3. Still run `schema.sql` so the upload/delete policies exist.

## 6. Load the demo content
Run `supabase/seed.sql` in the SQL Editor. It fills in the Apex Solar &
Electrical data and never overwrites existing rows, so it is safe to re-run.

## 7. Run and sign in
```
npm install
npm run dev
```
Open http://localhost:3000/admin/login and sign in. Edits appear on the public
site within moments (the admin portal triggers a refresh of cached pages).

## Rebranding for a new client
Create a new Supabase project per client, run `schema.sql` and `seed.sql`,
edit the content from `/admin`, and set that client's two env vars on their
deployment.

## Security notes
- Public visitors can only **read** (RLS).
- Writes require a logged-in user whose id is in `public.admins`.
- The browser only ever holds the anon key.
