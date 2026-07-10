# OBS Events — Deployment Runbook (Phase 4.5)

Production topology (plan §13):
- **MongoDB Atlas** — M0 for staging, M10 for prod.
- **API** — Node on an EC2 instance, managed by **pm2**, fronted by **nginx** + **certbot** TLS.
- **Web (React SPA)** — Vite build served either from the same nginx (`deploy/nginx.conf`) or from **S3 + CloudFront**.
- **Payments** — Stripe (all currencies incl. INR) in **test mode first**, then flip to live keys (checklist below).

Actual provisioning is the human sign-off for the Phase 4 EXIT — this repo ships the config + checklists; nothing here reaches AWS on its own.

---

## 1. MongoDB Atlas
1. Create the cluster (M0 staging / M10 prod).
2. **Database Access** → add a user with `readWrite` on the `obs` database.
3. **Network Access** → allowlist the EC2 instance's public IP (or peer the VPC).
4. Copy the `mongodb+srv://…/obs` connection string into `server/.env` → `MONGODB_URI`.
5. Leave `DNS_SERVERS` empty in prod (it's only a dev workaround for routers that block TCP DNS on :53).

## 2. EC2 — API
```bash
# Amazon Linux 2023 / Ubuntu 22.04
sudo dnf install -y git nginx            # or: apt install
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -   # Node 20 LTS (engines: >=20)
sudo dnf install -y nodejs
sudo npm i -g pm2

sudo mkdir -p /var/www/obs /var/log/obs
sudo chown -R "$USER" /var/www/obs /var/log/obs
git clone <repo> /var/www/obs && cd /var/www/obs
npm ci                                   # installs all workspaces

# Server env
cp server/.env.production.example server/.env
$EDITOR server/.env                      # fill EVERY key (see the file's checklist)

# One-time seed (admin + 12 categories + 108 chapters + CMS stubs)
npm run seed --workspace server

# Start under pm2 (fork mode, single instance — crons run in-process)
pm2 start deploy/ecosystem.config.cjs
pm2 save && pm2 startup                  # run the printed command to enable boot-start
pm2 logs obs-events-api                  # verify boot + "cron scheduled" line
```
Smoke test: `curl http://127.0.0.1:4000/api/v1/health` → `{ ok: true }`.

## 3. nginx + TLS
```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/obs
sudo ln -s /etc/nginx/sites-available/obs /etc/nginx/sites-enabled/obs
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d obsevents.com -d www.obsevents.com   # provisions + auto-renews TLS
```
`deploy/nginx.conf` serves the SPA from `/var/www/obs/dist`, proxies `/api/` → `127.0.0.1:4000`, and proxies `/sitemap.xml` + `/robots.txt` to the API (they're generated dynamically — §4.4).

## 4. Web (React SPA)
```bash
cp client/.env.production.example client/.env.production
$EDITOR client/.env.production           # VITE_API_URL, Google client id + Maps key
npm run build --workspace client         # → client/dist
```
**Option A — same host (nginx):** `sudo cp -r client/dist/* /var/www/obs/dist/`.

**Option B — S3 + CloudFront:**
1. Create a **private** S3 bucket; upload `client/dist/*`.
2. CloudFront distribution with an **Origin Access Control** to the bucket; default root object `index.html`.
3. **Custom error responses:** map 403 and 404 → `/index.html` (200) for SPA history routing.
4. Route `/api/*`, `/sitemap.xml`, `/robots.txt` to the API origin (EC2/ALB) via a second CloudFront origin + behaviors — so the app, API, and SEO files share one domain (keeps CORS same-origin).
5. Point DNS (Route 53) at CloudFront; request the ACM cert in **us-east-1** for CloudFront.

## 5. Register live webhook URLs
Stripe is the single source of truth (§8.2), so the dashboard must POST to:
- **Stripe** → Developers → Webhooks → `https://obsevents.com/api/v1/webhooks/stripe`
  - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`.
  - Copy the signing secret → `STRIPE_WEBHOOK_SECRET`.
`pm2 restart obs-events-api` after editing `server/.env`.

## 6. Switch-to-live-keys checklist (do last, deliberately)
- [ ] Stripe: swap `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` test → **live**; re-create the live webhook; update `STRIPE_WEBHOOK_SECRET`. (Stripe handles all currencies incl. INR — confirm INR is enabled on the account.)
- [ ] `SERVICE_FEE_PERCENT`, `ORDER_HOLD_MINUTES`, `REFUND_CUTOFF_HOURS` confirmed for prod.
- [ ] S3 bucket is **private** (no public ACLs); IAM role or scoped keys set; `S3_BUCKET`/`AWS_REGION` correct.
- [ ] SMTP live credentials set; send a real test email (register → check inbox).
- [ ] Google: OAuth client id authorized for the prod origin; Maps keys referrer/API-restricted.
- [ ] `CORS_ORIGINS` lists exactly the prod web origins; `APP_URL`/`API_URL` are the https prod URLs.
- [ ] Strong `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`.
- [ ] `pm2 save` so the process resurrects on reboot; log rotation (`pm2 install pm2-logrotate`).

## 7. Post-deploy smoke test (the EXIT dry run, on prod)
Create → approve → **sell (a live test-mode order)** → export attendees → check in → refund one order, then confirm: tickets in the buyer's account + inbox, invoice downloads via the signed URL, the gateway dashboards show the payment + refund, and `GET /sitemap.xml` lists the new event.
