# Оновлене ТЗ для Mini App SDK

## **1. ЗАГАЛЬНИЙ ОПИС**

### **1.1 Мета проєкту**

Розробити SDK для автоматизованого трекінгу ефективності рекламних кампаній у Telegram Mini Apps, яке дозволяє:

- Відстежувати кількість унікальних користувачів по UTM-параметрах/base64 посиланнях
- Збирати дані про платежі в Telegram Stars
- Надавати агентству доступ до аналітики через API без прямого доступу до бази клієнта

### **1.2 Архітектура роботи**

**Сторона агентства:**
1. Генерація посилань незалежно від SDK: `t.me/tmabot/app?startapp=Campaign_1`
2. Збереження в своїй БД: Campaign_1 → Telegram Ads кампанія X
3. Регулярні API запити до TMA для отримання статистики по створених посиланнях

**Сторона клієнта (власника TMA):**
1. Інтеграція SDK в TMA
2. SDK автоматично збирає дані про відкриття та платежі
3. SDK надає API endpoint для запитів агентства

### **1.3 Підтримувані формати посилань**

- UTM параметри: `startapp=Campaign_1`
- Base64 encoded UTM: `startapp=Q2FtcGFpZ25fMQ==`

---

## **2. КОМПОНЕНТИ СИСТЕМИ**

### **2.1 SDK (JavaScript бібліотека)**
- Клієнтська частина для інтеграції в TMA
- Серверна частина (Node.js) для API endpoint

### **2.2 База даних клієнта**
- Зберігає дані трекінгу
- Керується через SDK

### **2.3 API для агентства**
- Надає доступ до статистики по створених кампаніях

---

## **3. ФУНКЦІОНАЛ SDK**

### **3.1 Трекінг відкриттів**

**Автоматичне відстеження при запуску TMA:**
- Витягування `startapp` параметра з URL
- Декодування base64 (якщо застосовано)
- Збереження в БД: `{utm_parameter, telegram_user_id, timestamp}`
- Підрахунок унікальних користувачів по кожному UTM

### **3.2 Трекінг платежів**

**Метод для інтеграції в логіку оплати:**

```javascript
// Клієнт викликає після успішної оплати в Telegram Stars
trackPayment({
  amount: 100, // кількість Stars
  telegram_user_id: 123456789,
  utm_parameter: "Campaign_1" // автоматично підтягується з сесії
})
```

**Що зберігається:**
- `{utm_parameter, telegram_user_id, amount, timestamp, payment_id}`
- Унікальність по `telegram_user_id` для підрахунку платящих користувачів

### **3.3 API для агентства**

**Endpoint: GET /api/v1/analytics**

**Запит:**
```json
{
  "api_key": "agency_secret_key",
  "utm_parameters": ["Campaign_1", "Campaign_2", "Campaign_3"]
}
```

**Відповідь:**
```json
{
  "data": [
    {
      "utm_parameter": "Campaign_1",
      "unique_users": 1523,
      "paying_users": 87,
      "total_revenue_stars": 12400,
      "conversion_rate": 5.71
    },
    {
      "utm_parameter": "Campaign_2",
      "unique_users": 2341,
      "paying_users": 143,
      "total_revenue_stars": 19800,
      "conversion_rate": 6.11
    }
  ]
}
```

---

## **4. ТЕХНІЧНІ ВИМОГИ**

### **4.1 SDK клієнтська частина**

**Підключення:**
- CDN: `<script src="https://cdn.tma-tracker.com/sdk.js"></script>`
- NPM: `npm install @tma-tracker/sdk`

**Ініціалізація:**
```javascript
TMATracks.init({
  apiKey: "client_api_key",
  apiEndpoint: "https://your-server.com/api"
})

// Трекінг платежів
TMATracks.trackPayment({
  amount: 100
})
```

### **4.2 SDK серверна частина**

**Технології:**
- Node.js + Express/Fastify
- База даних: PostgreSQL/MongoDB
- Автентифікація: API ключі

**Функції:**
- Прийом даних від клієнтської частини SDK
- Збереження в БД
- Надання аналітики через API
- Валідація запитів від агентства

### **4.3 Безпека**

- Різні API ключі для клієнта та агентства
- Агентство отримує дані ТІЛЬКИ по своїх UTM параметрах
- Rate limiting на API endpoints

---

## **5. ІНФРАСТРУКТУРА ДЛЯ РОЗРОБКИ**

### **5.1 Структура проєкту**

```
tma-tracker-sdk/
├── packages/
│   ├── client/              # Клієнтський SDK
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── tracker.ts
│   │   │   └── types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── server/              # Серверний SDK
│       ├── src/
│       │   ├── index.ts
│       │   ├── api/
│       │   │   ├── events.ts
│       │   │   └── analytics.ts
│       │   ├── db/
│       │   │   ├── schema.ts
│       │   │   └── queries.ts
│       │   └── middleware/
│       │       └── auth.ts
│       ├── package.json
│       └── tsconfig.json
│
├── examples/                # Приклади інтеграції
│   ├── vanilla-js/
│   ├── react/
│   └── vue/
│
├── tests/
├── docs/
└── package.json
```

### **5.2 Технологічний стек**

**Клієнтська частина:**
- TypeScript
- Rollup/Vite для збірки
- Jest для тестування

**Серверна частина:**
- Node.js 18+
- Express/Fastify
- PostgreSQL + Prisma ORM (або MongoDB + Mongoose)
- JWT для API ключів
- Redis для кешування (опціонально)

### **5.3 База даних (PostgreSQL приклад)**

```sql
-- Таблиця відкриттів
CREATE TABLE app_opens (
  id SERIAL PRIMARY KEY,
  utm_parameter VARCHAR(255) NOT NULL,
  telegram_user_id BIGINT NOT NULL,
  username VARCHAR(255),
  language_code VARCHAR(10),
  timestamp TIMESTAMP DEFAULT NOW(),
  UNIQUE(utm_parameter, telegram_user_id)
);

-- Таблиця платежів
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  utm_parameter VARCHAR(255) NOT NULL,
  telegram_user_id BIGINT NOT NULL,
  amount INTEGER NOT NULL,
  payment_id VARCHAR(255),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Індекси
CREATE INDEX idx_utm ON app_opens(utm_parameter);
CREATE INDEX idx_payments_utm ON payments(utm_parameter);
```

---

## **6. ПЛАН РОЗРОБКИ З CLAUDE CODE**

### **Крок 1: Підготовка проєкту**

```bash
# Створити структуру проєкту
mkdir tma-tracker-sdk && cd tma-tracker-sdk
npm init -w packages/client -w packages/server
```

**Попросити Claude Code:**
```
Створи monorepo структуру для TMA Tracker SDK з двома пакетами:
- packages/client (TypeScript SDK для браузера)
- packages/server (Node.js API сервер)

Налаштуй TypeScript, ESLint, Prettier для обох пакетів.
```

### **Крок 2: Розробка клієнтського SDK**

**Попросити Claude Code:**
```
Створи клієнтський SDK в packages/client/ з наступним функціоналом:

1. Клас TMATracks з методами:
   - init({ apiKey, apiEndpoint })
   - trackPayment({ amount })
   
2. Автоматичне відстеження app_open при ініціалізації:
   - Витягування startapp параметра з Telegram WebApp
   - Декодування base64 якщо потрібно
   - Відправка даних на apiEndpoint
   
3. Підтримка різних форматів:
   - UMD для CDN
   - ES Modules для bundlers
   - TypeScript типи

4. Обробка помилок та retry логіка
```

### **Крок 3: Розробка серверної частини**

**Попросити Claude Code:**
```
Створи API сервер в packages/server/ з наступними endpoints:

1. POST /api/v1/events
   - Приймає дані від клієнтського SDK
   - Валідує client API key
   - Зберігає в PostgreSQL

2. GET /api/v1/analytics
   - Приймає agency API key та список UTM параметрів
   - Повертає статистику: unique_users, paying_users, revenue
   - Обмежує доступ тільки до запитуваних UTM

3. База даних:
   - Prisma ORM з PostgreSQL
   - Схема для app_opens та payments
   - Міграції

4. Middleware:
   - Автентифікація через API ключі
   - Rate limiting
   - CORS
```

### **Крок 4: Приклади інтеграції**

**Попросити Claude Code:**
```
Створи приклади інтеграції в examples/:

1. examples/vanilla-js/
   - HTML сторінка з підключенням через CDN
   - Демонстрація trackPayment()

2. examples/react/
   - React компонент з хуком useTMATracker
   - Інтеграція з Telegram Stars payment flow

3. examples/vue/
   - Vue 3 композабл для трекінгу
```

### **Крок 5: Документація**

**Попросити Claude Code:**
```
Створи документацію в docs/:

1. README.md - швидкий старт
2. INTEGRATION.md - детальна інтеграція
3. API.md - опис всіх методів та endpoints
4. SECURITY.md - best practices по безпеці
```

### **Крок 6: Тестування**

**Попросити Claude Code:**
```
Напиши тести для:

1. Клієнтський SDK:
   - Unit тести для витягування параметрів
   - Тести декодування base64
   - Mock тести API викликів

2. Серверна частина:
   - Integration тести для endpoints
   - Тести автентифікації
   - Тести запитів до БД
```

### **Крок 7: CI/CD та Deploy**

**Попросити Claude Code:**
```
Налаштуй:

1. GitHub Actions для:
   - Автоматичного тестування
   - Публікації в NPM
   - Деплою на CDN

2. Docker конфігурацію для серверної частини
3. Environment variables management
```

---

## **7. ПРИКЛАД ВИКОРИСТАННЯ**

### **7.1 Інтеграція в TMA (клієнт)**

```javascript
// 1. Підключення SDK
import TMATracks from '@tma-tracker/sdk'

// 2. Ініціалізація (app_open відбувається автоматично)
TMATracks.init({
  apiKey: 'client_secret_key_from_dashboard',
  apiEndpoint: 'https://api.your-tma.com'
})

// 3. Трекінг платежу після успішної оплати
async function handlePayment() {
  const invoice = await WebApp.openInvoice(invoiceLink)
  
  if (invoice.status === 'paid') {
    await TMATracks.trackPayment({
      amount: 100
    })
  }
}
```

### **7.2 Запит статистики (агентство)**

```javascript
// Node.js скрипт агентства
const response = await fetch('https://api.client-tma.com/api/v1/analytics', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'agency_secret_key'
  },
  body: JSON.stringify({
    utm_parameters: ['Campaign_1', 'Campaign_2']
  })
})

const stats = await response.json()
console.log(stats)
```

---

## **8. БЕЗПЕКА ТА МАСШТАБОВАНІСТЬ**

### **8.1 Безпека**
- API ключі зберігаються в змінних середовища
- Двофакторна система ключів (client/agency)
- Rate limiting: 100 req/min для analytics endpoint
- HTTPS only

### **8.2 Масштабованість**
- Horizontal scaling серверів
- Database indexing на utm_parameter
- Кешування популярних запитів (Redis)
- CDN для клієнтського SDK

---

## **9. ДОДАТКОВІ ВИМОГИ**

### **9.1 Логування та моніторинг**
- Логування всіх API запитів
- Метрики продуктивності
- Alert система для критичних помилок

### **9.2 Документація API**
- OpenAPI/Swagger специфікація
- Інтерактивна документація
- Приклади для різних мов програмування

### **9.3 Підтримка**
- Детальні повідомлення про помилки
- FAQ для типових проблем
- Email підтримка для клієнтів

---

Це технічне завдання готове для початку розробки через Claude Code!
