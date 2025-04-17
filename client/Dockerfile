# Билд стадии
FROM node:22-alpine as builder
# Билд стадия
WORKDIR /app

# Копируем зависимости и кэшируем их
COPY package.json package-lock.json ./
RUN npm ci

# Копируем остальные файлы
COPY . .

# Собираем приложение
RUN npm run build

# Финальная стадия (для production)
FROM node:22-alpine
WORKDIR /app

# Копируем только необходимое из builder стадии
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Для production preview
EXPOSE 4173
CMD ["npm", "run", "preview"]