# --- Build stage ---
FROM node:20-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Run stage ---
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# Cloud Run sets PORT automatically; server.ts already reads process.env.PORT
EXPOSE 8080
CMD ["node", "dist/server.cjs"]
