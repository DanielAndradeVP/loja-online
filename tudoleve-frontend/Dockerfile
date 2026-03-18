# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app

# Instala dependencias para o build.
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Nitro (Nuxt 3 server engine) reads HOST and PORT — not NUXT_HOST/NUXT_PORT.
ENV HOST=0.0.0.0
ENV PORT=3000

# O preset node-server gera .output auto-contido com seus proprios node_modules.
# Nenhum npm install adicional e necessario na imagem final.
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

