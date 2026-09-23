# Tent of Hope — ScalaHosting deployment

This archive contains a **production/** folder that runs directly on a Linux Node.js server and a **source/** folder for later rebuilds. The site uses Next.js for its pages and Node.js for the registration API. Registration data is sent from the server to Supabase; the private key never goes to the browser.

## 1. Create the database

Create a Supabase project. Open its SQL Editor and run `supabase/schema.sql` from this archive. This creates `public.registrations` with row-level security enabled and no anonymous access policies.

Copy your Project URL and **service_role key** from Supabase project settings. Keep the service role key private. Existing registrations on the earlier hosted site are **not** included in this package; export and import those records separately if you need them in Supabase.

## 2. Upload and configure ScalaHosting

1. Use a Linux hosting plan with Node.js **22.13 or newer**, SSH/file upload access, and a Node.js application manager or reverse proxy. Upload the contents of `production/` to a directory **outside** `public_html` (for example, `~/apps/tent-of-hope`). Keep its `.next` directory and `node_modules` intact.
2. In SPanel's Node.js application manager, select that directory as the application root and `server.js` as the startup file. Select an available Node.js 22 or newer runtime. If you use your own process manager, start with `node server.js` from that directory and route your domain to the assigned port with HTTPS.
3. Set these **server-side** environment variables in the application manager (or in a private `.env` file in the application root):
   - `SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=YOUR_PRIVATE_SERVICE_ROLE_KEY`
   - `NODE_ENV=production`
   - `PORT` to the port assigned by your hosting control panel; standalone Next.js defaults to 3000 if unset.
   - `HOSTNAME=0.0.0.0` if your application manager requires binding to all local interfaces.
4. Point the intended domain/subdomain to the application in SPanel, enable SSL, and restart the Node.js app. Visit `/` and `/events`, then submit a test registration and verify a row appears in Supabase Table Editor.

The `production/` folder is a prebuilt Linux x64 bundle. If your server is another CPU architecture or the Node runtime is incompatible, upload `source/`, install Node.js 22+, run `corepack enable && pnpm install --frozen-lockfile && pnpm build`, then copy `source/.next/standalone/` to the app root along with `source/.next/static/` to `.next/static/` and `source/public/` to `public/`. Run the resulting `server.js`. Keep credentials out of the source repository.

## 3. Updates and operations

Rebuild and restart after source edits. Keep the private key on the server, rotate it if exposed, and back up Supabase regularly. Only the Node server sends registrations to Supabase. The site does not provide a public registration list or administrator login. The existing Sites deployment stays separate and continues to use its own database until you cut over the domain.
