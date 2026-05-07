FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner

# curl is ~1MB but its exit codes and flags are predictable. BusyBox wget's
# `--spider` was returning non-zero even on success in some Alpine builds.
RUN apk add --no-cache curl

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Probe /health — Portainer surfaces this status on the container card.
# -f fails on 4xx/5xx, -s silent, -S still shows real errors.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS http://127.0.0.1/health || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
