# Uzcategui Stays — Web

Next.js front end for the booking system. Every read and write goes through the
API Gateway.

## Getting started

```bash
cp .env.template .env
npm install
npm run dev
```

The gateway must be running. From `stays-launcher`:

```bash
docker compose up -d
```

## Environment

| Variable | Purpose |
|---|---|
| `API_URL` | API Gateway base URL. Server-side only |
