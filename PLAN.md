<<<<<<< Updated upstream
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
=======
# План разработки Telegram-бота и веб‑приложения

## Цель
- Создать бота в Telegram и веб‑приложение с клубом по подписке и обучающим пространством.
- Структура уроков: темы и вкладки‑подуроки.
- Внизу веб‑приложения — панель навигации: «о клубе», «поддержка», «подписка», «домой».
- Минимальный бекэнд на SQLite, простой UI на Next.js.

## Технологии
- Бекэнд: `Node.js` + лёгкий HTTP‑фреймворк (например, `Express`) + `SQLite` (через `better-sqlite3` или `sqlite3`).
- Бот: `Node.js` + библиотека для Telegram (например, `telegraf`).
- Фронтенд: `Next.js` (App Router), CSS‑библиотека по вкусу (например, `Tailwind` или минимальные CSS‑модули).
- Аутентификация: Telegram Login Widget или OAuth‑связка учётки и Telegram‑ID.

## Структура проекта
- `backend/` — сервер, API, вебхуки оплаты и бота.
- `frontend/` — Next.js приложение.
- `database/` — файл базы `sqlite` и миграции.

## Архитектура
- Связка Telegram‑бот ↔ бекэнд:
  - Бот получает команды/кнопки, обращается к API.
  - Бекэнд хранит пользователей, подписки, уроки, прогресс.
- Веб‑приложение ↔ бекэнд:
  - UI отображает темы, уроки, статус подписки.
  - Доступ к контенту ограничен активной подпиской.

## База данных (SQLite)
- Таблицы:
  - `users` (id, telegram_id, email?, created_at)
  - `subscriptions` (id, user_id, status [active|inactive], start_at, end_at)
  - `topics` (id, title, description, order)
  - `lessons` (id, topic_id, title, content_md, order)
  - `lesson_tabs` (id, lesson_id, title, content_md, order)
  - `progress` (id, user_id, lesson_id, tab_id?, status, updated_at)
  - `payments` (id, user_id, provider, amount, currency, status, external_id, created_at)
  - `support_tickets` (id, user_id, subject, message, status, created_at)

## API (черновой список)
- Публичные:
  - `POST /api/auth/telegram` — верификация логина через Telegram.
  - `GET /api/topics` — список тем.
  - `GET /api/topics/:id/lessons` — уроки в теме.
  - `GET /api/lessons/:id` — содержимое урока и вкладок.
- Приватные (требуют авторизации):
  - `GET /api/me/subscription` — состояние подписки.
  - `POST /api/subscribe` — создание подписки/инициация оплаты.
  - `POST /api/payments/webhook` — обработка вебхуков провайдера оплаты.
  - `POST /api/support` — отправка обращения в поддержку.
  - `POST /api/progress` — отметки прохождения уроков/вкладок.

## Telegram‑бот (черновой сценарий)
- Команды: `/start`, `/subscribe`, `/lessons`, `/support`, `/about`.
- Потоки:
  - `/start` — привязка Telegram‑ID, выдача ссылки в веб‑приложение.
  - `/subscribe` — кнопка инициирует оплату, после успеха — активация подписки.
  - `/lessons` — показывает доступные темы/уроки, ссылки в веб.
  - `/support` — сбор сообщения, создание тикета.
  - `/about` — краткая информация о клубе.

## Веб‑приложение (Next.js)
- Экран «Домой» — приветствие, статус подписки, быстрые ссылки.
- «Темы» — список тем; экран «Урок» — контент и вкладки.
- «Подписка» — состояние, кнопки оплаты/продления.
- «О клубе» — описание миссии/контента.
- «Поддержка» — форма обращения.
- Нижняя панель навигации с пунктами: «домой», «о клубе», «поддержка», «подписка».

## Подписки и платежи
- Провайдер оплаты: вариант — Stripe/CloudPayments/ЮKassa (на выбор).
- Требуется вебхук для подтверждения оплаты → активация `subscriptions.status=active`.
- Альтернатива: Telegram Payments/Stars (если подходит по бизнес‑логике).

## Безопасность и доступ
- Верификация подписи Telegram Login.
- Ограничение контента по активной подписке на уровне API.
- Минимальное логирование, без хранения чувствительных данных.

## Развёртывание
- Локально: `sqlite` файл в `database/app.sqlite`.
- Прод: фронтенд на Vercel; бекэнд на Railway/Render/VM.
- Предупреждение: `SQLite` требует персистентного диска в проде. При отсутствии — рассмотреть переход на Postgres.

## Этапы (MVP → расширение)
1) Инициализация проекта и базовая структура.
2) База данных, минимальные миграции.
3) API: темы/уроки (чтение), аутентификация Telegram.
4) Бот: `/start`, ссылки, отображение тем.
5) Фронтенд: страницы, нижняя панель, рендер контента.
6) Оплата: единый провайдер, вебхук, активация подписки.
7) Ограничение доступа к урокам по подписке.
8) Поддержка: форма + тикеты.
9) Тесты и развёртывание.

## Переменные окружения
- `BOT_TOKEN` — токен Telegram‑бота.
- `WEBAPP_URL` — базовый URL фронтенда.
- `DATABASE_URL` — путь к SQLite (`file:database/app.sqlite`).
- `PAYMENT_PROVIDER_*` — ключи провайдера оплаты.

## Тестирование
- Юнит‑тесты критических модулей.
- Интеграционные тесты API.
- Ручные сценарии бота.
>>>>>>> Stashed changes
