# Dependencias compartilhadas entre desenvolvimento e build
FROM node:20-alpine AS dependencies
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Desenvolvimento com os arquivos locais montados pelo Compose
FROM dependencies AS development
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]

# 1 - Build
FROM dependencies AS builder
COPY . .

ARG VITE_APP_ENV
ARG VITE_API_URL

ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# 2 - Runtime
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=builder /app/dist .

# Usaremos a configuração customizada do Nginx para servir o frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
