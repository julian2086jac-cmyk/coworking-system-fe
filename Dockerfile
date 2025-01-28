# Etapa de construcción
FROM node:20-alpine as builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src/ ./src/
COPY index.html ./

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Instalar servidor ligero
RUN npm install -g serve

# Copiar archivos de construcción
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 5173

# Comando para iniciar el servidor
CMD ["serve", "-s", "dist", "-l", "5173"]