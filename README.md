# Novicovs

React/Vite landing page. Build with Node.js 22 and npm:

```sh
cp .env.example .env
# Fill in the EmailJS values in .env.
npm ci
npm run build
npm start
```

The production server serves `dist/` on `0.0.0.0:1488`. Set `PORT` to choose another port. It supports direct navigation to `/`, `/tech-rider`, `/order`, and `/admin`. For local development use `npm run dev`.

## Server

The deployment directory is `/mnt/server/storage/novicovs`. Build there, then recreate the existing `novicovs` entry once to switch it from cluster mode to fork mode. This briefly stops this application; its private `var/` data and other PM2 applications remain intact:

```sh
pm2 delete novicovs
pm2 start ecosystem.config.cjs --only novicovs
readlink /proc/$(pm2 pid novicovs)/exe
pm2 save
```

For subsequent deployments, use `pm2 startOrReload ecosystem.config.cjs --only novicovs --update-env`, verify the executable again, then `pm2 save`.

The PM2 configuration explicitly uses fork mode and the server's installed Node.js 22 runtime. Cluster mode inherits the PM2 daemon's Node executable and can ignore the configured interpreter. Verify that the `readlink` command reports the Node.js 22 path before saving the process list. The server refuses to start on Node.js below 22. On another host, adjust `cwd`, `interpreter` and the commands above. The server needs no installed npm dependencies once `dist/` has been built. The router must forward the chosen port for access from the Internet.

## GitLab CI

Every push runs `npm ci` and `npm run build` using `node:22-bookworm` on a runner accepting untagged jobs. The job publishes the built frontend, backend modules, seed content, provisioning script and PM2 configuration as artifacts, retained for 30 days. Deployment is performed separately.

Configure these GitLab CI/CD variables for builds with a working contact form:

- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`

Vite embeds these client-side EmailJS identifiers in the generated JavaScript at build time. They must be available to every branch that needs a functional form. Changing them requires a new build. Keep local `.env` files out of Git; `.env.example` contains only variable names.

`npm run lint` is available, but existing UI lint errors currently prevent it from passing; it is not a required CI build step.

## Content administration

Open `/admin` directly. The public navigation has no administration link. The editor covers the home page's blocks, groups and their media, equipment, contacts, order-form copy, shared navigation and footer. Expand a section to edit its fields. Arrays support adding, duplication, removal and reordering. Duplicate a block of the desired type to add another section. Save publishes the complete document to all visitors. Uploaded media can be selected from field upload controls or managed in the Files tab. File deletion is immediate; remove references before deleting a file.

The Node server stores content, media, password hashes and lockout state in `DATA_DIR` (default `var/` beside `server.mjs`). This directory is private runtime state, excluded from Git and CI artifacts. The first content document is seeded from `content/default-content.json`; subsequent deployments keep saved content. Back up this directory before deployment. Never include it in a deployment command that deletes untracked files or replaces the deployment directory. To move it outside the code checkout, set an absolute `DATA_DIR` in PM2's environment and restart with `--update-env`.

Initialize an administrator on the server once, supplying credentials interactively (the password is not echoed or placed in shell history):

```bash
read -r -p 'Administrator login: ' ADMIN_USERNAME
read -r -s -p 'Administrator password: ' ADMIN_PASSWORD
export ADMIN_USERNAME ADMIN_PASSWORD
npm run admin:init
unset ADMIN_USERNAME ADMIN_PASSWORD
```

Use the requested initial credentials when provisioning. No default password is embedded in the source or build. The same initialization command is the operator's password-reset procedure; it replaces the account hash and resets its lockout. Restart the service after resetting credentials to invalidate existing sessions. The production runtime does not need npm dependencies: deploy `dist/`, `server.mjs`, `server/`, `scripts/`, `content/` and the PM2 configuration together.

Passwords use scrypt. The account locks for 24 hours after 20 failed login attempts; the failure counter and lock survive server restarts. Sessions use HttpOnly, SameSite=Strict cookies, server-side random tokens and CSRF protection. HTTP is supported; set `COOKIE_SECURE=true` when the site is served through HTTPS. Restrict access to runtime backups, which contain private authentication state. Uploads accept only supported media/PDF signatures, up to 25 MB each, and are served without script execution. SVG/HTML uploads are intentionally unsupported.

Run `npm test` for backend security/integration checks and `npm run build` for frontend validation. For local development, run `npm start` for the API (after a build), plus `npm run dev` for Vite; Vite proxies API and upload requests to port 1488. Every CI push now runs tests before building and includes the backend and seed content in its artifacts.
