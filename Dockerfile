FROM node:22.23.4-alpine AS base

WORKDIR /usr/src/app

ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps

COPY package*.json ./
RUN npm ci

FROM base AS build

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runtime

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=build --chown=node:node /usr/src/app/.next/standalone ./
COPY --from=build --chown=node:node /usr/src/app/.next/static ./.next/static
COPY --from=build --chown=node:node /usr/src/app/public ./public

USER node

CMD ["node", "server.js"]
