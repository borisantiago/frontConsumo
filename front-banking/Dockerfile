# Etapa 1: Build Angular
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration=production

# Etapa 2: Servir con NGINX
FROM nginx:alpine

# 🚨 AQUÍ está el cambio importante
COPY --from=builder /app/dist/front-banking/browser /usr/share/nginx/html

# (Opcional) nginx.conf para rutas
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



