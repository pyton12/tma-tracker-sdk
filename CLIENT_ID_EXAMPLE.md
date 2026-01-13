# 🔑 Client ID - How It Works

## Проблема

Уяви, що у тебе є 2 клієнти:
- **Play Dice** (гральний додаток)
- **Crypto Game** (крипто гра)

Обидва клієнти запускають кампанію з назвою `campaign_111`.

**Без Client ID:**
```
❌ Дані змішуються!
campaign_111:
  - 1000 користувачів (але з якого додатку?)
  - 500 платежів (але з якого додатку?)
```

**З Client ID:**
```
✅ Дані розділені!
playdice / campaign_111:
  - 600 користувачів
  - 300 платежів

cryptogame / campaign_111:
  - 400 користувачів
  - 200 платежів
```

---

## Як це працює

### 1. Генерація API ключа з Client ID

```bash
# Для Play Dice
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/generate \
  -H "x-admin-secret: YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "client",
    "clientId": "playdice",
    "name": "Play Dice - Client Key"
  }'

# Відповідь:
{
  "success": true,
  "data": {
    "key": "abc123...",
    "clientId": "playdice"
  }
}
```

```bash
# Для Crypto Game
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/generate \
  -H "x-admin-secret: YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "client",
    "clientId": "cryptogame",
    "name": "Crypto Game - Client Key"
  }'

# Відповідь:
{
  "success": true,
  "data": {
    "key": "def456...",
    "clientId": "cryptogame"
  }
}
```

---

### 2. Клієнт відправляє події

**Play Dice відправляє app_open:**
```javascript
fetch('https://tma-trackerserver-production.up.railway.app/api/v1/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'abc123...'  // ← API ключ Play Dice
  },
  body: JSON.stringify({
    event_type: 'app_open',
    data: {
      utmParameter: 'campaign_111',
      telegramUserId: 123456
    }
  })
})
```

**Що відбувається на сервері:**
1. Сервер отримує API ключ `abc123...`
2. Знаходить в базі: `clientId = "playdice"`
3. Зберігає подію з `clientId = "playdice"`

```sql
INSERT INTO users (client_id, telegram_user_id, first_utm_parameter)
VALUES ('playdice', 123456, 'campaign_111')
```

---

**Crypto Game відправляє app_open:**
```javascript
fetch('https://tma-trackerserver-production.up.railway.app/api/v1/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'def456...'  // ← API ключ Crypto Game
  },
  body: JSON.stringify({
    event_type: 'app_open',
    data: {
      utmParameter: 'campaign_111',  // ← Та сама назва!
      telegramUserId: 789012
    }
  })
})
```

**Що відбувається на сервері:**
1. Сервер отримує API ключ `def456...`
2. Знаходить в базі: `clientId = "cryptogame"`
3. Зберігає подію з `clientId = "cryptogame"`

```sql
INSERT INTO users (client_id, telegram_user_id, first_utm_parameter)
VALUES ('cryptogame', 789012, 'campaign_111')
```

---

### 3. Агенція отримує аналітику

**Для Play Dice:**
```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/analytics \
  -H "x-api-key: AGENCY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "playdice",
    "utm_parameters": ["campaign_111"]
  }'

# Відповідь:
{
  "success": true,
  "data": [{
    "utm_parameter": "campaign_111",
    "unique_users": 600,
    "paying_users": 300
  }]
}
```

**Для Crypto Game:**
```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/analytics \
  -H "x-api-key: AGENCY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "cryptogame",
    "utm_parameters": ["campaign_111"]
  }'

# Відповідь:
{
  "success": true,
  "data": [{
    "utm_parameter": "campaign_111",
    "unique_users": 400,
    "paying_users": 200
  }]
}
```

---

## ✅ Переваги

1. **Ізоляція даних:** Кожен клієнт має свої дані
2. **Однакові назви UTM:** Клієнти можуть використовувати однакові назви кампаній
3. **Автоматичне визначення:** Client ID автоматично витягується з API ключа
4. **Безпека:** Клієнт не може отримати дані іншого клієнта

---

## 🎯 Підсумок

- **Client ID** = унікальний ідентифікатор клієнта
- **API Key** містить Client ID
- **Всі дані** зберігаються з Client ID
- **Analytics** фільтрує по Client ID

