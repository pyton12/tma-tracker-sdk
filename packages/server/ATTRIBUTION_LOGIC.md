# 🎯 Attribution Logic - First Touch Attribution

## Концепція

TMA Tracker використовує **First Touch Attribution** - всі платежі приписуються до **першого** UTM параметра, з яким користувач відкрив додаток.

---

## 📊 Як це працює

### Сценарій:

```
День 1: Користувач відкриває додаток по посиланню campaign_111
День 2: Користувач відкриває додаток по посиланню campaign_222
День 3: Користувач робить платіж
```

### Результат:

- ✅ Платіж приписується до **campaign_111** (перший UTM)
- ❌ Платіж НЕ приписується до campaign_222

---

## 🗄️ Структура бази даних

### Таблиця `users`

Зберігає **перший** UTM параметр для кожного користувача:

```sql
CREATE TABLE "users" (
    "id" INTEGER PRIMARY KEY,
    "telegram_user_id" BIGINT UNIQUE NOT NULL,
    "first_utm_parameter" TEXT NOT NULL,  -- ← ПЕРШИЙ UTM!
    "username" TEXT,
    "language_code" TEXT,
    "first_seen_at" DATETIME NOT NULL,
    "last_seen_at" DATETIME NOT NULL
);
```

### Таблиця `app_opens`

Зберігає всі відкриття додатку (для статистики по кампаніях):

```sql
CREATE TABLE "app_opens" (
    "id" INTEGER PRIMARY KEY,
    "utm_parameter" TEXT NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "timestamp" DATETIME NOT NULL
);
```

### Таблиця `payments`

Зберігає платежі з **першим** UTM параметром:

```sql
CREATE TABLE "payments" (
    "id" INTEGER PRIMARY KEY,
    "utm_parameter" TEXT NOT NULL,  -- ← Береться з users.first_utm_parameter
    "telegram_user_id" BIGINT NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_id" TEXT,
    "timestamp" DATETIME NOT NULL
);
```

---

## 🔄 Логіка API

### 1. `POST /api/v1/events` (event_type: app_open)

**Перше відкриття:**
```javascript
// Користувач НЕ існує в таблиці users
→ Створюємо запис з firstUtmParameter = "campaign_111"
```

**Повторне відкриття:**
```javascript
// Користувач вже існує в таблиці users
→ Оновлюємо тільки lastSeenAt
→ firstUtmParameter НЕ змінюється!
```

### 2. `POST /api/v1/events` (event_type: payment)

```javascript
// 1. Знаходимо користувача в таблиці users
const user = await prisma.user.findUnique({ 
  where: { telegramUserId } 
})

// 2. Зберігаємо платіж з ПЕРШИМ UTM
await prisma.payment.create({
  utmParameter: user.firstUtmParameter,  // ← Беремо ПЕРШИЙ UTM!
  telegramUserId,
  amount,
  paymentId
})
```

---

## 📈 Аналітика

### `POST /api/v1/analytics`

**Запит:**
```json
{
  "utm_parameters": ["campaign_111", "campaign_222"]
}
```

**Відповідь:**
```json
{
  "success": true,
  "data": [
    {
      "utm_parameter": "campaign_111",
      "unique_users": 1,        // ← З таблиці users (firstUtmParameter)
      "paying_users": 1,        // ← З таблиці payments
      "total_revenue_stars": 100,
      "conversion_rate": 100
    }
  ]
}
```

---

## ✅ Переваги First Touch Attribution

1. **Справедлива атрибуція** - платіж приписується тому, хто привів користувача
2. **Немає конфліктів** - користувач може відкривати додаток по різних посиланнях
3. **Проста логіка** - завжди зрозуміло, звідки прийшов користувач

---

## 🧪 Приклад тестування

```bash
# 1. Перше відкриття (campaign_111)
curl -X POST http://localhost:3000/api/v1/events \
  -H "x-api-key: YOUR_KEY" \
  -d '{"event_type":"app_open","data":{"utmParameter":"campaign_111","telegramUserId":123}}'

# 2. Повторне відкриття (campaign_222)
curl -X POST http://localhost:3000/api/v1/events \
  -H "x-api-key: YOUR_KEY" \
  -d '{"event_type":"app_open","data":{"utmParameter":"campaign_222","telegramUserId":123}}'

# 3. Платіж (буде приписаний до campaign_111)
curl -X POST http://localhost:3000/api/v1/events \
  -H "x-api-key: YOUR_KEY" \
  -d '{"event_type":"payment","data":{"telegramUserId":123,"amount":100}}'

# 4. Перевірка аналітики
curl -X POST http://localhost:3000/api/v1/analytics \
  -H "x-api-key: AGENCY_KEY" \
  -d '{"utm_parameters":["campaign_111","campaign_222"]}'

# Результат: campaign_111 має 1 користувача та 1 платіж
#            campaign_222 має 0 користувачів та 0 платежів
```

