# Etapa 1: Build de Angular
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration production

# Etapa 2: Servidor NGINX
FROM nginx:alpine
COPY --from=builder /app/dist/front-banking /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]