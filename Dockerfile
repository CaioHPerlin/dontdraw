# Base builder
FROM node:lts-alpine AS builder
WORKDIR /app

# Enable pnpm (project uses pnpm)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only files needed to install & build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.json tsconfig.build.json nest-cli.json eslint.config.mjs ./
COPY src ./src
COPY client ./client

# Install and build
RUN pnpm install --frozen-lockfile \
    && pnpm build \
    && pnpm prune --prod

# Runtime image
FROM node:lts-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy production assets
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client ./client

# Respect .env defaults (attachment shows PORT=5000)
ENV PORT=5000
EXPOSE 5000

CMD ["node", "dist/main.js"]
