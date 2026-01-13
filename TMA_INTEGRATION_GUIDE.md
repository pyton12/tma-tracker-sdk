# � TMA Tracker - API Integration Guide

Повний гайд по інтеграції TMA Tracker API в ваш Telegram Mini App без SDK.

---

## 📊 Production конфігурація

```javascript
API Endpoint: https://tma-trackerserver-production.up.railway.app
Client API Key: YOUR_CLIENT_API_KEY  // ← Отримайте від агенції
```

**Приклад для Play Dice:**
```javascript
Client API Key: 5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed
Client ID: playdice  // ← Автоматично визначається по API ключу
TMA Bot: https://t.me/playdiceebot/app
```

**Важливо:** Client ID автоматично визначається по вашому API ключу. Це дозволяє агенції розділяти дані різних клієнтів, навіть якщо у них однакові назви UTM кампаній.

---

## 🚀 Швидкий старт (30 секунд)

### Варіант A: Мінімальна інтеграція (2 рядки коду)

Додай в кінець свого головного файла (main.js, app.js):

```javascript
// Замініть YOUR_API_KEY на ваш ключ
fetch('https://tma-trackerserver-production.up.railway.app/api/v1/events',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':'YOUR_API_KEY'},body:JSON.stringify({event_type:'app_open',data:{utmParameter:window.Telegram.WebApp.initDataUnsafe?.start_param||'direct',telegramUserId:window.Telegram.WebApp.initDataUnsafe?.user?.id}})})
```

**Для Play Dice:**
```javascript
fetch('https://tma-trackerserver-production.up.railway.app/api/v1/events',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':'5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed'},body:JSON.stringify({event_type:'app_open',data:{utmParameter:window.Telegram.WebApp.initDataUnsafe?.start_param||'direct',telegramUserId:window.Telegram.WebApp.initDataUnsafe?.user?.id}})})
```

✅ **Готово!** Тепер відкриття додатку відстежуються автоматично.

**Трекінг платежів (опціонально):**

Коли користувач платить, додай цей рядок:
```javascript
// Замініть amount та paymentId на реальні значення
fetch('https://tma-trackerserver-production.up.railway.app/api/v1/events',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':'YOUR_API_KEY'},body:JSON.stringify({event_type:'payment',data:{utmParameter:'dummy',telegramUserId:window.Telegram.WebApp.initDataUnsafe?.user?.id,amount:100,paymentId:'payment_123'}})})
```

---

### Варіант B: Повна інтеграція (з трекінгом платежів)

Скопіюй цей код в головний файл (main.js, app.js, або App.jsx):

```javascript
// ============================================
// TMA Tracker API Integration
// ============================================

const TMA_TRACKER_CONFIG = {
  apiEndpoint: 'https://tma-trackerserver-production.up.railway.app',
  apiKey: 'YOUR_CLIENT_API_KEY'  // ← Замініть на ваш ключ
}

// Відправити app_open при завантаженні
async function trackAppOpen() {
  try {
    const tg = window.Telegram.WebApp
    const user = tg.initDataUnsafe?.user
    const startParam = tg.initDataUnsafe?.start_param

    if (!user || !startParam) {
      console.log('⚠️ No user or start_param, skipping tracking')
      return
    }

    const response = await fetch(`${TMA_TRACKER_CONFIG.apiEndpoint}/api/v1/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TMA_TRACKER_CONFIG.apiKey
      },
      body: JSON.stringify({
        event_type: 'app_open',
        data: {
          utmParameter: startParam,
          telegramUserId: user.id,
          username: user.username,
          languageCode: user.language_code
        }
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ App open tracked:', startParam)
    } else {
      console.error('❌ Failed to track app open:', result.error)
    }
  } catch (error) {
    console.error('❌ Error tracking app open:', error)
  }
}

// Відправити payment після оплати
async function trackPayment(amount, paymentId) {
  try {
    const tg = window.Telegram.WebApp
    const user = tg.initDataUnsafe?.user

    if (!user) {
      console.error('❌ No user found')
      return
    }

    const response = await fetch(`${TMA_TRACKER_CONFIG.apiEndpoint}/api/v1/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TMA_TRACKER_CONFIG.apiKey
      },
      body: JSON.stringify({
        event_type: 'payment',
        data: {
          utmParameter: 'dummy',  // API автоматично візьме firstUtmParameter
          telegramUserId: user.id,
          amount: amount,
          paymentId: paymentId
        }
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Payment tracked:', amount, 'stars')
    } else {
      console.error('❌ Failed to track payment:', result.error)
    }
  } catch (error) {
    console.error('❌ Error tracking payment:', error)
  }
}

// Ініціалізація при завантаженні TMA
function initTMATracker() {
  const tg = window.Telegram.WebApp
  tg.ready()
  
  // Відправляємо app_open автоматично
  trackAppOpen()
  
  console.log('🎯 TMA Tracker initialized')
}

// Викликати при завантаженні додатку
initTMATracker()
```

**Як використовувати:**

1. Скопіюй весь код вище в свій файл
2. Замініть `YOUR_CLIENT_API_KEY` на ваш ключ
3. При оплаті викликай `trackPayment(amount, paymentId)`

**Приклад трекінгу платежу:**
```javascript
// Коли користувач успішно заплатив
async function onPaymentSuccess(stars, invoiceId) {
  // Твоя логіка оплати...

  // Відправити в TMA Tracker
  await trackPayment(stars, invoiceId)
}
```

---

## 🧪 Тестування

### Варіант A: Через консоль браузера (найшвидший)

1. Відкрий Play Dice TMA з UTM параметром:
   ```
   https://t.me/playdiceebot/app?startapp=test_campaign_123
   ```

2. Відкрий консоль браузера (F12)

3. Вставити і запустити:

```javascript
// Тест 1: app_open
await fetch('https://tma-trackerserver-production.up.railway.app/api/v1/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed'
  },
  body: JSON.stringify({
    event_type: 'app_open',
    data: {
      utmParameter: 'test_campaign_123',
      telegramUserId: window.Telegram.WebApp.initDataUnsafe.user.id,
      username: window.Telegram.WebApp.initDataUnsafe.user.username,
      languageCode: window.Telegram.WebApp.initDataUnsafe.user.language_code
    }
  })
}).then(r => r.json()).then(console.log)
// Очікуваний результат: {success: true, message: "App open tracked successfully"}

// Тест 2: payment
await fetch('https://tma-trackerserver-production.up.railway.app/api/v1/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed'
  },
  body: JSON.stringify({
    event_type: 'payment',
    data: {
      utmParameter: 'dummy',
      telegramUserId: window.Telegram.WebApp.initDataUnsafe.user.id,
      amount: 100,
      paymentId: 'test_' + Date.now()
    }
  })
}).then(r => r.json()).then(console.log)
// Очікуваний результат: {success: true, message: "Payment tracked successfully"}
```

### Варіант B: Через curl (з терміналу)

```bash
# Тест app_open
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: 5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed" \
  -d '{
    "event_type": "app_open",
    "data": {
      "utmParameter": "test_campaign_123",
      "telegramUserId": 123456,
      "username": "test_user",
      "languageCode": "en"
    }
  }'

# Тест payment
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: 5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed" \
  -d '{
    "event_type": "payment",
    "data": {
      "utmParameter": "dummy",
      "telegramUserId": 123456,
      "amount": 100,
      "paymentId": "test_payment_1"
    }
  }'
```

---

## 📊 Як працює атрибуція

### First Touch Attribution

TMA Tracker використовує **First Touch Attribution** - платежі завжди приписуються до **першого** UTM параметра.

**Приклад:**
```
День 1: Користувач відкриває TMA по посиланню campaign_111
        → Зберігається firstUtmParameter = "campaign_111"

День 2: Користувач відкриває TMA по посиланню campaign_222
        → firstUtmParameter залишається "campaign_111" (не змінюється!)

День 3: Користувач робить платіж 100 Stars
        → Платіж приписується до campaign_111 ✅
```

**Результат аналітики:**
```json
{
  "campaign_111": {
    "unique_users": 1,
    "paying_users": 1,
    "total_revenue_stars": 100
  },
  "campaign_222": {
    "unique_users": 0,
    "paying_users": 0,
    "total_revenue_stars": 0
  }
}
```

---

## 🎯 Приклади інтеграції для різних фреймворків

### Vanilla JavaScript

```javascript
// main.js
window.addEventListener('DOMContentLoaded', () => {
  initTMATracker()
})

// При оплаті
document.getElementById('payButton').addEventListener('click', async () => {
  const stars = 100
  const invoiceId = await processPayment(stars)
  await trackPayment(stars, invoiceId)
})
```

### React

```javascript
// App.jsx
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    initTMATracker()
  }, [])

  const handlePayment = async (stars) => {
    const invoiceId = await processPayment(stars)
    await trackPayment(stars, invoiceId)
  }

  return (
    <button onClick={() => handlePayment(100)}>
      Pay 100 Stars
    </button>
  )
}
```

### Vue 3

```javascript
// App.vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  initTMATracker()
})

const handlePayment = async (stars) => {
  const invoiceId = await processPayment(stars)
  await trackPayment(stars, invoiceId)
}
</script>

<template>
  <button @click="handlePayment(100)">Pay 100 Stars</button>
</template>
```

---

##  Troubleshooting

### Помилка: "Invalid or inactive API key"
**Причина:** API ключ не знайдено в базі даних

**Рішення:** Перевір що використовуєш правильний ключ:
```
5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed
```

### Помилка: "User not found" при payment
**Причина:** Користувач не відкривав додаток (немає в таблиці users)

**Рішення:** Спочатку відправ `app_open`, потім `payment`

### CORS помилка
**Причина:** Домен TMA не дозволений на сервері

**Рішення:** Зверніться до адміністратора сервера для додавання домену в CORS whitelist

### Немає start_param
**Причина:** Користувач відкрив TMA не по UTM посиланню

**Рішення:** Це нормально, трекінг просто пропускається. Переконайся що тестуєш з UTM:
```
https://t.me/playdiceebot/app?startapp=test_campaign_123
```

---

## ✅ Чеклист інтеграції

- [ ] Додав код `trackAppOpen()` та `trackPayment()` в TMA
- [ ] Викликав `initTMATracker()` при завантаженні
- [ ] Викликав `trackPayment()` після успішної оплати
- [ ] Протестував через консоль браузера
- [ ] Перевірив що app_open відправляється
- [ ] Перевірив що payment відправляється

---

## 🎉 Готово!

Тепер ваш TMA інтегрований з TMA Tracker API!

**Що далі:**
1. Створюй унікальні UTM посилання для кожної кампанії
2. Заливай трафік
3. Агенція надасть вам доступ до статистики

**Підтримка:** Якщо щось не працює - перевір консоль браузера (F12) для помилок.

