# ЭТАП 1: Сборка (Build)
FROM node:18-alpine as build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код фронтенда
COPY . .

# Собираем проект в папку dist
RUN npm run build

# ЭТАП 2: Запуск (Production)
FROM nginx:alpine

# Копируем собранные файлы из этапа 1 в Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем наш конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
