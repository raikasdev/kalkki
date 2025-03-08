FROM oven/bun:1.2-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install


FROM oven/bun:1.2-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV VITE_DESKTOP_BUILD=true
RUN apk add git && bun run build


FROM nginx:1.27.4-alpine
WORKDIR /usr/share/nginx/html/
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80