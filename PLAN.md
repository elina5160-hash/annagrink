# План разработки бэкенда (JS) для веб‑приложения и Telegram‑бота

**Контекст фронтенда**
- Приложение на `Next.js 16 (App Router)` с разделами `home`, `podcasts`, `astrostati`, `subscription`, `support`, есть `admin` страница (см. `frontend/src/app/admin/page.tsx`).
- Доступ к материалам регулируется состоянием подписки в UI; требуется серверная проверка и хранение.

**Стек**
- `Node.js` (JS) + `Next.js` route handlers для API (`src/app/api/**/route.js`).
- `Prisma` ORM + `SQLite` база.
- Telegram Web App/ID аутентификация через проверку `initData`/Login Widget.

**Схема БД (Prisma)**
- Модели:
  - `User(id, telegramId, displayName?, createdAt)`
  - `Subscription(id, userId, status, startAt, endAt)`
  - `Podcast(id, slug, title, url?, createdAt)`
  - `AstroArticle(id, slug, title, url?, createdAt)`
  - `View(id, userId, contentType, contentSlug, lastViewedAt, count)`
  - `Payment(id, userId, provider, amount, currency, status, externalId, createdAt)`
  - `Admin(id, userId, role)`

**Файл `prisma/schema.prisma` (набросок)**
- datasource: `sqlite` → `url = env("DATABASE_URL")`
- generator: `client`
- модели как выше, связи: `User 1—N Subscription`, `User 1—N View`, `User 1—N Payment`.

**Инициализация БД**
- `DATABASE_URL=file:./prisma/dev.db`
- Команды: `npx prisma init`, описать модели, затем `npx prisma migrate dev -n init`.

**Аутентификация по Telegram ID**
- Вариант A (Telegram WebApp внутри Telegram):
  - Клиент получает `initData` от Telegram, отправляет на сервер.
  - Сервер валидирует HMAC по боту: `HMAC_SHA256(initData, BOT_TOKEN)`.
  - После проверки — создаёт/находит `User` по `telegramId`, выдаёт сессионный JWT/куку.
- Вариант B (Telegram Login Widget в вебе):
  - Клиент получает объект пользователя от Telegram JS.
  - Сервер валидирует подпись, маппит `telegramId` → `User`.

**API (route.js)**
- `POST /api/auth/telegram/verify` — принять и проверить Telegram `initData`/login, вернуть токен, `user`.
- `GET /api/me` — профиль пользователя, подписка.
- `GET /api/podcasts` — список/метаданные (для admin/пользователей).
- `POST /api/podcasts` — добавить/редактировать (admin).
- `GET /api/astro` — список статей, ссылки.
- `POST /api/astro` — добавить/редактировать (admin).
- `POST /api/progress/view` — инкремент просмотров/прослушиваний.
- `GET /api/subscription` — состояние подписки.
- `POST /api/subscribe` — инициировать оплату (провайдер).
- `POST /api/payments/webhook` — вебхук провайдера, активировать подписку.

**Админ‑панель**
- Ограничить доступ по роли `Admin`.
- Эндпоинты управления: `podcasts`, `astro`, `users`, `subscriptions`.
- Действия: добавить/редактировать название/URL, видеть метрики `View`.

**Интеграция с фронтендом**
- В `frontend/src/app/**` использовать fetch к `/api/...` для данных.
- Состояние подписки (UI) синхронизировать с сервером: на входе приложения — `GET /api/me`.
- Клики «плей»/галочки → `POST /api/progress/view` с `{contentType, contentSlug}`.

**Переменные окружения**
- `DATABASE_URL=file:./prisma/dev.db`
- `BOT_TOKEN=<токен телеграм‑бота>`
- `JWT_SECRET=<секрет для токенов>`
- `PAYMENT_PROVIDER_*` — ключи оплаты.

**Безопасность**
- Обязательная валидация `initData`/подписи Telegram.
- Токены с коротким TTL, refresh по необходимости.
- Ограничение админ‑эндпоинтов по роли.

**План работ (итерации)**
1) Инициализация Prisma/SQLite, описание моделей, `migrate dev`.
2) Реализация `POST /api/auth/telegram/verify`, выпуск JWT/куки, создание `User`.
3) Эндпоинты чтения контента: `GET /api/podcasts`, `GET /api/astro`.
4) Учёт прогресса: `POST /api/progress/view` + возврат агрегатов.
5) Состояние подписки: `GET /api/subscription`, мок + вебхук платежей.
6) Админ API: `POST /api/podcasts`, `POST /api/astro`, `GET /api/users`.
7) Интеграция фронта: замена локального `localStorage` на серверные данные где нужно.
8) Тесты (интеграционные), деплой.

**Примечания по совместимости**
- Next.js 16 (из сборки) поддерживает `route.js` в App Router — удобно держать API внутри `frontend`.
- При переходе на прод‑СУБД (Postgres) достаточно сменить `DATABASE_URL` и запустить `prisma migrate deploy`.
