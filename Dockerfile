# ── Stage 1: dependencias ──────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# ── Stage 2: build (compila TypeScript a dist/) ────────────
FROM deps AS build
COPY . .
RUN npm run build

# ── Stage 3 (default): imagen de PRODUCCIÓN ────────────────
FROM node:20-alpine AS prod
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
