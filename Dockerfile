FROM node:22-alpine AS base

# ─── Deps ────────────────────────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ─── Builder ─────────────────────────────────────────────────────
FROM base AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ─── Runner ──────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

RUN apk add --no-cache openssl
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Public assets
COPY --from=builder /app/public ./public
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public

# Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma (schema + migrations + client via pnpm store)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Startup script
COPY --chown=nextjs:nodejs scripts/docker-start.sh ./docker-start.sh
RUN chmod +x ./docker-start.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["sh", "./docker-start.sh"]
