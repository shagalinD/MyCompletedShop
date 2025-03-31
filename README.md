# React Shop

Этот проект представляет собой простое React-приложение, реализующее магазин, которое использует Mock API на основе `json-server` для имитации backend-сервера. Проект предназначен для разработки и тестирования frontend-логики без необходимости подключения к реальному backend.

## Требования

Для запуска проекта необходимо установить следующие инструменты:

- [Node.js](https://nodejs.org/) (версия 16 или выше)
- [npm](https://www.npmjs.com/) (обычно устанавливается вместе с Node.js)
- [json-server](https://github.com/typicode/json-server) (устанавливается через npm)

## Установка

1. Склонируйте репозиторий:

   ```bash
   git clone https://github.com/ваш-username/ваш-репозиторий.git
   cd ваш-репозиторий
   ```

2. Установите зависимости:

   ```bash
   npm install
   ```

3. Установите `json-server` глобально (если еще не установлен):

   ```bash
   npm install -g json-server
   ```

## Запуск проекта

1. Запустите `json-server` для Mock API:

   ```bash
   json-server --watch public/data.json --port 3001
   ```

   Это запустит Mock API на порту `3001`, используя файл `public/data.json` в качестве базы данных.

2. В отдельном терминале запустите React-приложение:

   ```bash
   npm run dev
   ```

   Это запустит React-приложение на порту `3000` (или другом, если порт занят).

3. Откройте браузер и перейдите по адресу:

   - React-приложение: [http://localhost:5173](http://localhost:5173)
   - Mock API: [http://localhost:3001](http://localhost:3001)

## Структура проекта

- `src/` — исходный код React-приложения.
- `public/` — статические файлы, включая `data.json`, который используется `json-server`.
- `package.json` — файл с зависимостями и скриптами для запуска проекта.

## Использование Mock API

Mock API предоставляет RESTful-интерфейс на основе данных из `public/data.json`. Вы можете выполнять GET, POST, PUT, PATCH и DELETE запросы к API.

Пример данных в `public/data.json`:

```json
{
  "products": [
    {
      "id": 1,
      "title": "Ноутбук ASUS VivoBook 15",
      "price": 45000,
      "description": "15.6 дюймов, Intel Core i5, 8 ГБ ОЗУ, 512 ГБ SSD",
      "image": "/assets/cat-surprised.gif",
      "category": "electronics",
      "rating": 4.7
    },
],
}
```
