# Novicovs

React/Vite landing page. Build with Node.js 22 and npm:

```sh
cp .env.example .env
# Fill in the EmailJS values in .env.
npm ci
npm run build
npm start
```

The production server serves `dist/` on `0.0.0.0:1488`. Set `PORT` to choose another port. It supports direct navigation to `/`, `/tech-rider`, and `/order`. For local development use `npm run dev`.

## Server

The deployment directory is `/mnt/server/storage/novicovs`. After building there, start or reload the PM2 application:

```sh
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
```

The PM2 configuration uses the server's installed Node.js 22 runtime. On another host, adjust `cwd` and `interpreter` in `ecosystem.config.cjs`. The server needs no installed npm dependencies once `dist/` has been built. The router must forward the chosen port for access from the Internet.

## GitLab CI

Every push runs `npm ci` and `npm run build` using `node:22-bookworm` on a runner accepting untagged jobs. The job publishes `dist/`, `server.mjs`, and `ecosystem.config.cjs` as artifacts, retained for 30 days. Deployment is performed separately.

Configure these GitLab CI/CD variables for builds with a working contact form:

- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`

Vite embeds these client-side EmailJS identifiers in the generated JavaScript at build time. They must be available to every branch that needs a functional form. Changing them requires a new build. Keep local `.env` files out of Git; `.env.example` contains only variable names.

`npm run lint` is available, but existing UI lint errors currently prevent it from passing; it is not a required CI build step.
