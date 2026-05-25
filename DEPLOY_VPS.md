# VPS Deploy

This service is ready to run from:

`/var/www/systems/app/scrapper`

## 1. Install dependencies

```bash
cd /var/www/systems/app/scrapper
npm install
```

If `npm` is not available, install Node.js 22 first.

## 2. Configure environment

Create or update `.env` in `/var/www/systems/app/scrapper`:

```env
HOST=0.0.0.0
PORT=5000

DB_HOST=187.127.131.17
DB_PORT=3306
DB_USER=career_user
DB_PASSWORD=career4sl1234
DB_NAME=db_4sl_career_plus
DB_CONNECTION_LIMIT=10

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

SCRAPE_ENABLED=true
SCRAPE_CRON=*/30 * * * *
SCRAPE_URL=https://in.indeed.com/jobs?q=software+developer
SCRAPE_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36
```

## 3. Quick run without PM2

```bash
cd /var/www/systems/app/scrapper
node server.js
```

Worker:

```bash
cd /var/www/systems/app/scrapper
node workers/scrape.worker.js
```

## 4. Run with PM2

Install PM2 once:

```bash
npm install -g pm2
```

Start:

```bash
cd /var/www/systems/app/scrapper
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Check logs:

```bash
pm2 logs job-scrapper-api
pm2 logs job-scrapper-worker
```

## 5. Open firewall

If UFW is enabled:

```bash
ufw allow 5000/tcp
ufw reload
```

## 6. Test

```bash
curl http://127.0.0.1:5000/health
curl "http://127.0.0.1:5000/api/jobs?search=developer"
```

## CORS

The API is currently configured to allow all origins:

- `origin: *`
- methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`

## Likely VPS blockers

If `/health` fails, check:

- outbound MySQL access to `187.127.131.17:3306`
- DB firewall whitelist for the VPS IP
- Redis access if your apply worker runs from another codebase
- target site blocking scraper traffic
