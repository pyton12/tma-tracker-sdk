# 🚀 Швидкий старт TMA Tracker SDK

## ✅ Що вже зроблено

### 1. Структура проекту створена
```
tma-tracker-sdk/
├── packages/
│   ├── client/          # Клієнтський SDK (зібрано ✅)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── tracker.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   └── dist/        # UMD, ESM, CJS builds
│   │
│   └── server/          # API сервер (зібрано ✅)
│       ├── src/
│       │   ├── index.ts
│       │   ├── api/
│       │   │   ├── events.ts
│       │   │   └── analytics.ts
│       │   ├── db/
│       │   │   └── client.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   └── rateLimit.ts
│       │   └── scripts/
│       │       └── generateApiKeys.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── dev.db        # SQLite база даних ✅
│       └── dist/
```

### 2. База даних налаштована ✅
- SQLite база створена
- API ключі згенеровані:
  - Client API Key: `073dc2bd3f34f2ecda8d76c7f1a354243e9f601e5c951203555f5fb08ae89f5a`
  - Agency API Key: `4fec482b12cff09e66480cb12dbf1caeb78713f84622f5764c68fc0e775d9c16`

### 3. Проект зібрано ✅
- Client SDK зібрано (UMD/ESM/CJS)
- Server API зібрано (TypeScript → JavaScript)

---

## 🔥 Запуск сервера

### Development режим:
```bash
npm run dev:server
```

Сервер запуститься на `http://localhost:3000`

### Перевірка роботи:
```bash
curl http://localhost:3000/health
```

Відповідь:
```json
{
  "status": "ok",
  "timestamp": "2026-01-07T17:32:52.354Z"
}
```

---

## 📡 API Endpoints

### 1. POST /api/v1/events
Отримання подій від клієнтського SDK

**Headers:**
- `X-API-Key`: Client API Key
- `Content-Type`: application/json

**Body:**
```json
{
  "event_type": "app_open",
  "data": {
    "utmParameter": "Campaign_1",
    "telegramUserId": 123456789,
    "username": "john_doe",
    "languageCode": "uk"
  }
}
```

**Приклад запиту:**
```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "X-API-Key: 073dc2bd3f34f2ecda8d76c7f1a354243e9f601e5c951203555f5fb08ae89f5a" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "app_open",
    "data": {
      "utmParameter": "Campaign_1",
      "telegramUserId": 123456789
    }
  }'
```

### 2. POST /api/v1/analytics
Отримання аналітики (тільки для agency)

**Headers:**
- `X-API-Key`: Agency API Key
- `Content-Type`: application/json

**Body:**
```json
{
  "utm_parameters": ["Campaign_1", "Campaign_2"]
}
```

**Приклад запиту:**
```bash
curl -X POST http://localhost:3000/api/v1/analytics \
  -H "X-API-Key": 4fec482b12cff09e66480cb12dbf1caeb78713f84622f5764c68fc0e775d9c16" \
  -H "Content-Type: application/json" \
  -d '{
    "utm_parameters": ["Campaign_1"]
  }'
```

**Відповідь:**
```json
{
  "success": true,
  "data": [
    {
      "utm_parameter": "Campaign_1",
      "unique_users": 1523,
      "paying_users": 87,
      "total_revenue_stars": 12400,
      "conversion_rate": 5.71
    }
  ]
}
```

---

## 💻 Використання клієнтського SDK

### Підключення через NPM:
```bash
npm install ./packages/client
```

### Використання в Telegram Mini App:
```javascript
import TMATracks from '@tma-tracker/client'

// Ініціалізація (автоматично відстежує app_open)
await TMATracks.init({
  apiKey: '073dc2bd3f34f2ecda8d76c7f1a354243e9f601e5c951203555f5fb08ae89f5a',
  apiEndpoint: 'https://your-server.com',
  debug: true // Опціонально для логування
})

// Трекінг платежу після успішної оплати
async function handlePayment() {
  const invoice = await WebApp.openInvoice(invoiceLink)

  if (invoice.status === 'paid') {
    await TMATracks.trackPayment({
      amount: 100, // Telegram Stars
      paymentId: 'optional_payment_id'
    })
  }
}

// Отримати поточний UTM параметр
const utm = TMATracks.getUtmParameter()
console.log('Current UTM:', utm)
```

---

## 🔧 Корисні команди

```bash
# Збірка всього проекту
npm run build

# Запуск в dev режимі
npm run dev:server  # Сервер
npm run dev:client  # Client SDK (watch mode)

# Prisma команди
npm run prisma:studio        # Відкрити Prisma Studio
npm run prisma:generate      # Згенерувати Prisma Client
npm run generate-keys -w packages/server  # Згенерувати нові API ключі

# Linting
npm run lint
npm run lint:fix

# Форматування
npm run format
```

---

## 📊 База даних

База даних знаходиться в `packages/server/prisma/dev.db`

### Таблиці:
1. **app_opens** - відстеження відкриттів
   - Унікальний індекс по (utm_parameter, telegram_user_id)

2. **payments** - відстеження платежів

3. **api_keys** - керування API ключами

### Переглянути дані:
```bash
npm run prisma:studio -w packages/server
```

---

## 🎯 Наступні кроки

1. **Деплой серверної частини**
   - Налаштувати production змінні в `.env`
   - Деплоїти на VPS/Cloud (DigitalOcean, AWS, etc.)
   - Налаштувати NGINX reverse proxy
   - Увімкнути HTTPS

2. **Публікація клієнтського SDK**
   - Опублікувати на NPM: `npm publish` в `packages/client`
   - Або розмістити на CDN для підключення через `<script>`

3. **Тестування**
   - Написати unit тести
   - Інтеграційне тестування API

4. **Документація**
   - API документація (Swagger/OpenAPI)
   - Приклади інтеграції для різних фреймворків

---

## 🐛 Troubleshooting

### Сервер не запускається
```bash
# Перевірити порт
lsof -i :3000

# Перевірити логи
npm run dev:server
```

### База даних заблокована
```bash
cd packages/server
rm prisma/dev.db prisma/dev.db-journal
npx prisma db push
npm run generate-keys -w packages/server
```

### Помилки збірки
```bash
# Очистити і перезібрати
rm -rf node_modules packages/*/node_modules dist packages/*/dist
npm install
npm run build
```

---

## 📚 Додаткові ресурси

- [Повне ТЗ](./TMA_Tracker_SDK_Technical_Specification.md)
- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Docs](https://expressjs.com/)

---

**🎉 SDK готовий до використання!**
