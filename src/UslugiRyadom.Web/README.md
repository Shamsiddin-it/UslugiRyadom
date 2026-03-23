# Uslugi Ryadom Web

Frontend MVP для платформы "Услуги рядом" на `React + TypeScript + Vite`.

## Что внутри

- авторизация и хранение JWT
- роли `client`, `master`, `admin`
- публичные страницы
- кабинет клиента
- кабинет мастера
- административная панель
- `Zustand` для auth-state
- `TanStack Query` для серверных данных
- `Axios` с interceptor для токена и `401`
- формы на `React Hook Form + Zod`
- адаптивный UI на `Tailwind CSS`

## Запуск

1. Перейдите в папку проекта:

```bash
cd src/UslugiRyadom.Web
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте `.env` на основе примера:

```bash
cp .env.example .env
```

4. Укажите адрес backend API:

```env
VITE_API_URL=http://localhost:5000
```

5. Запустите dev-сервер:

```bash
npm run dev
```

6. Production build:

```bash
npm run build
```

## Подключение к backend

Frontend ожидает ASP.NET Core Web API с базовым префиксом:

```text
http://localhost:5000/api
```

Используемые endpoint'ы:

- `/auth/register`
- `/auth/login`
- `/auth/logout`
- `/auth/me`
- `/users/me`
- `/users/{id}`
- `/masters`
- `/masters/{id}`
- `/masters/me`
- `/categories`
- `/categories/{id}`
- `/orders`
- `/orders/{id}`
- `/orders/my`
- `/orders/available`
- `/orders/{id}/accept`
- `/orders/{id}/status`
- `/orders/{id}/cancel`
- `/cities`
- `/districts?city=...`
- `/admin/users`
- `/admin/masters`
- `/admin/orders`
- `/admin/stats`
- `/admin/users/{id}/block`
- `/admin/masters/{id}/verify`

## Основные маршруты

Публичные:

- `/`
- `/login`
- `/register`
- `/categories`
- `/masters`
- `/masters/:id`
- `/orders` — экран с мягким требованием входа, так как backend защищает список заказов

Client:

- `/profile`
- `/orders/create`
- `/orders/my`

Master:

- `/profile`
- `/orders/available`
- `/master/dashboard`

Admin:

- `/admin`
- `/admin/users`
- `/admin/masters`
- `/admin/orders`

## Структура

```text
src/
  app/
    providers/
    router/
  components/
    admin/
    categories/
    forms/
    layout/
    masters/
    orders/
    shared/
    ui/
  features/
    admin/
    auth/
    categories/
    locations/
    masters/
    orders/
  hooks/
  layouts/
  lib/
  pages/
  routes/
  services/
  store/
  types/
  utils/
```

## Что легко добавить дальше

- отзывы и рейтинг с отзывами по заказу
- чат между клиентом и мастером
- изображения и портфолио
- геолокацию и карту
- онлайн-оплату

Текущая архитектура уже разделяет страницы, компоненты, сервисы, store и типы, поэтому расширение можно делать без большого рефакторинга.
