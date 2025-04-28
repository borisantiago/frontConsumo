# Etapa 1: Build de Angular
FROM node:18 AS builder

# Creamos una carpeta de trabajo
WORKDIR /app

# Copiamos el package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto de la aplicación
COPY . .

# Build de Angular para producción
RUN npm run build -- --configuration production --project front-banking

# Etapa 2: Servir con NGINX
FROM nginx:alpine

# Copiamos los archivos de Angular compilados al NGINX
COPY --from=builder /app/dist/front-banking /usr/share/nginx/html

# Opcionalmente puedes reemplazar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80
EXPOSE 80

# Comando para arrancar nginx
CMD ["nginx", "-g", "daemon off;"]
