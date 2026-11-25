# Clinix Saúde — Frontend

# Versão do Node: mantenha igual ao .nvmrc
ARG NODE_VERSION=26

# Dependências
FROM node:${NODE_VERSION}-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN HUSKY=0 npm ci

# Build
FROM dependencies AS builder
COPY . .
ARG VITE_APP_ENV=production
ARG VITE_API_URL=/api
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Produção
FROM nginxinc/nginx-unprivileged:stable-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]
CMD ["nginx", "-g", "daemon off;"]
