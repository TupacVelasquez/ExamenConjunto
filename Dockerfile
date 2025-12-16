# =======================================================
# ETAPA 1: BUILD (Construcción)
# =======================================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Este comando crea la carpeta 'dist'
RUN npm run build

# =======================================================
# ETAPA 2: RUNTIME (Servir con Nginx)
# =======================================================
FROM nginx:alpine
# Copia la configuración de Nginx (para manejar el proxy y el routing de React)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copia los archivos estáticos compilados desde la etapa 'builder'
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]