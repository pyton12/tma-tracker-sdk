# 📱 Гайд з імплементації TMA Tracker SDK у ваш TMA бот

## 🎯 Передумови

Перед початком переконайтесь, що:
- ✅ Серверна частина задеплоєна (див. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md))
- ✅ У вас є production URL API: `https://tma-trackerserver-production.up.railway.app`
- ✅ У вас є Client API Key: `5f2fd2e61108fb4ffb2d55c13b315eb19892dc18567e37dda5021081b82e32ed`
- ✅ Ваш TMA бот вже працює: `https://t.me/playdiceebot/app`

---

## 🚀 Покрокова імплементація

### Крок 1: Встановлення SDK у ваш TMA проект

#### Варіант А: Через NPM (рекомендовано)

```bash
cd /path/to/your/tma/project
npm install @tma-tracker/client
```

#### Варіант Б: Через CDN

Додайте в `index.html` перед закриваючим тегом `</head>`:

```html
<script src="https://your-cdn.com/tma-tracker.umd.js"></script>
```

#### Варіант В: Локальна копія

Скопіюйте файл з SDK:
```bash
cp /home/deploy/tma-tracker-sdk/packages/client/dist/index.esm.js /path/to/your/tma/src/
```

---

### Крок 2: Ініціалізація SDK у вашому TMA

Відкрийте головний файл вашого додатку (зазвичай `main.js`, `app.js`, або `index.js`).

#### Приклад для React/Vite проекту:

```javascript
// src/main.jsx або src/App.jsx
import { useEffect } from 'react';
import TMATracks from '@tma-tracker/client';

function App() {
  useEffect(() => {
    // Ініціалізація SDK при завантаженні додатку
    const initTracker = async () => {
      try {
        await TMATracks.init({
          apiKey: 'YOUR_CLIENT_API_KEY_HERE',
          apiEndpoint: 'https://your-api-domain.com',
          debug: false // true для dev режиму
        });

        console.log('TMA Tracker initialized');
        console.log('UTM parameter:', TMATracks.getUtmParameter());
      } catch (error) {
        console.error('Failed to init TMA Tracker:', error);
      }
    };

    initTracker();
  }, []);

  return (
    <div className="App">
      {/* Ваш TMA контент */}
    </div>
  );
}

export default App;
```

#### Приклад для Vanilla JS:

```javascript
// main.js
import TMATracks from './tma-tracker.esm.js';

// Ініціалізація при завантаженні сторінки
window.addEventListener('DOMContentLoaded', async () => {
  try {
    await TMATracks.init({
      apiKey: 'YOUR_CLIENT_API_KEY_HERE',
      apiEndpoint: 'https://your-api-domain.com',
      debug: false
    });

    console.log('TMA Tracker initialized');
    const utm = TMATracks.getUtmParameter();
    console.log('Current campaign:', utm);
  } catch (error) {
    console.error('Tracker init failed:', error);
  }
});
```

#### Приклад для Next.js:

```javascript
// pages/_app.js
import { useEffect } from 'react';
import TMATracks from '@tma-tracker/client';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Ініціалізація тільки на клієнті
    if (typeof window !== 'undefined') {
      TMATracks.init({
        apiKey: 'YOUR_CLIENT_API_KEY_HERE',
        apiEndpoint: 'https://your-api-domain.com',
        debug: process.env.NODE_ENV === 'development'
      }).catch(console.error);
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

---

### Крок 3: Трекінг платежів у Telegram Stars

Додайте трекінг платежів там, де користувачі здійснюють оплату.

#### Приклад для Telegram WebApp Invoice:

```javascript
// PaymentButton.jsx або де ви обробляєте платежі

async function handlePayment() {
  try {
    // Відкрити Telegram invoice
    const invoiceLink = 'https://t.me/$YOUR_BOT_INVOICE_LINK';
    const result = await window.Telegram.WebApp.openInvoice(invoiceLink);

    // Перевірити статус платежу
    if (result.status === 'paid') {
      // Трекнути успішний платіж
      await TMATracks.trackPayment({
        amount: 100, // Кількість Telegram Stars
        paymentId: result.invoice_id || `payment_${Date.now()}`
      });

      console.log('Payment tracked successfully');

      // Ваша логіка після успішної оплати
      showSuccessMessage();
    } else if (result.status === 'cancelled') {
      console.log('Payment cancelled by user');
    } else if (result.status === 'failed') {
      console.error('Payment failed');
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
}
```

#### Приклад з кастомною логікою:

```javascript
// Якщо ви обробляєте платежі через webhook або інший спосіб

async function onPaymentSuccess(paymentData) {
  try {
    await TMATracks.trackPayment({
      amount: paymentData.stars_amount,
      paymentId: paymentData.transaction_id
    });

    console.log('Payment tracked:', paymentData);
  } catch (error) {
    console.error('Failed to track payment:', error);
  }
}
```

---

### Крок 4: Тестування з різними UTM параметрами

Ваш бот: `https://t.me/playdiceebot/app`

Тестові посилання для перевірки:

1. **Campaign 1:**
   ```
   https://t.me/playdiceebot/app?startapp=campaign_1
   ```

2. **Campaign 2:**
   ```
   https://t.me/playdiceebot/app?startapp=campaign_2
   ```

3. **Campaign 3:**
   ```
   https://t.me/playdiceebot/app?startapp=campaign_3
   ```

#### Як перевірити, що трекінг працює:

1. **Відкрийте Developer Console у Telegram WebApp**
   - У Desktop Telegram: `Ctrl+Shift+I` (Windows/Linux) або `Cmd+Option+I` (Mac)
   - У Mobile: Використайте remote debugging

2. **Перевірте логи:**
   ```
   TMA Tracker initialized
   UTM parameter: campaign_1
   ```

3. **Перевірте мережеві запити:**
   - Має бути POST запит на `https://your-api.com/api/v1/events`
   - Відповідь: `{"success":true,"message":"App open tracked successfully"}`

4. **Перевірте дані на сервері:**
   ```bash
   # Через API
   curl -X POST https://your-api.com/api/v1/analytics \
     -H "X-API-Key: YOUR_AGENCY_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"utm_parameters": ["campaign_1", "campaign_2", "campaign_3"]}'

   # Або через Prisma Studio
   cd /home/deploy/tma-tracker-sdk
   npm run prisma:studio -w packages/server
   ```

---

### Крок 5: Отримання аналітики

#### Через API (програмно):

```javascript
// analytics.js
async function getAnalytics(campaigns) {
  try {
    const response = await fetch('https://your-api.com/api/v1/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'YOUR_AGENCY_API_KEY'
      },
      body: JSON.stringify({
        utm_parameters: campaigns
      })
    });

    const data = await response.json();
    console.log('Analytics:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
  }
}

// Виклик
getAnalytics(['campaign_1', 'campaign_2', 'campaign_3']).then(data => {
  data.data.forEach(campaign => {
    console.log(`${campaign.utm_parameter}:`);
    console.log(`  Унікальних користувачів: ${campaign.unique_users}`);
    console.log(`  Платників: ${campaign.paying_users}`);
    console.log(`  Дохід: ${campaign.total_revenue_stars} Stars`);
    console.log(`  Конверсія: ${campaign.conversion_rate}%`);
  });
});
```

#### Через cURL:

```bash
curl -X POST https://your-api.com/api/v1/analytics \
  -H "X-API-Key: YOUR_AGENCY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "utm_parameters": ["campaign_1", "campaign_2", "campaign_3"]
  }'
```

#### Приклад відповіді:

```json
{
  "success": true,
  "data": [
    {
      "utm_parameter": "campaign_1",
      "unique_users": 1523,
      "paying_users": 87,
      "total_revenue_stars": 12400,
      "conversion_rate": 5.71
    },
    {
      "utm_parameter": "campaign_2",
      "unique_users": 892,
      "paying_users": 34,
      "total_revenue_stars": 5100,
      "conversion_rate": 3.81
    },
    {
      "utm_parameter": "campaign_3",
      "unique_users": 2341,
      "paying_users": 156,
      "total_revenue_stars": 28900,
      "conversion_rate": 6.66
    }
  ]
}
```

---

## 🔍 Відлагодження (Troubleshooting)

### Проблема: SDK не ініціалізується

**Симптоми:**
- Помилка в консолі: `Failed to init TMA Tracker`
- Немає запитів до API

**Рішення:**
1. Перевірте, що API endpoint доступний:
   ```bash
   curl https://your-api.com/health
   ```

2. Перевірте CORS налаштування на сервері:
   ```javascript
   // packages/server/src/index.ts
   cors({
     origin: 'https://t.me', // Має бути налаштовано
     credentials: true,
   })
   ```

3. Перевірте API ключ:
   ```bash
   # У базі даних має бути активний ключ
   npm run prisma:studio -w packages/server
   # Відкрити таблицю api_keys, перевірити active = true
   ```

### Проблема: UTM параметр не визначається

**Симптоми:**
- `TMATracks.getUtmParameter()` повертає `null` або `undefined`

**Рішення:**
1. Перевірте, що посилання містить `startapp`:
   ```
   https://t.me/playdiceebot/app?startapp=campaign_1
   ```

2. Перевірте Telegram WebApp InitData:
   ```javascript
   console.log(window.Telegram.WebApp.initDataUnsafe);
   // Має містити start_param: "campaign_1"
   ```

3. Якщо UTM закодований в base64, SDK автоматично його декодує.

### Проблема: Події не відправляються

**Симптоми:**
- Немає запитів у Network Tab
- Помилка 401 або 403

**Рішення:**
1. Перевірте API ключ у коді:
   ```javascript
   apiKey: 'YOUR_CLIENT_API_KEY_HERE' // Має бути правильний ключ
   ```

2. Перевірте тип ключа (має бути `client`, не `agency`):
   ```bash
   # Через Prisma Studio або SQLite
   SELECT * FROM api_keys WHERE key = 'YOUR_KEY';
   # Переконайтесь, що type = 'client'
   ```

3. Перевірте rate limiting:
   ```javascript
   // Якщо відправляєте багато запитів, може спрацювати rate limiter
   // Налаштування: packages/server/src/middleware/rateLimit.ts
   ```

### Проблема: Платежі не трекаються

**Симптоми:**
- `trackPayment()` повертає помилку
- Платежі не відображаються в аналітиці

**Рішення:**
1. Перевірте формат даних:
   ```javascript
   await TMATracks.trackPayment({
     amount: 100, // Має бути number, не string
     paymentId: 'optional_id' // Опціонально
   });
   ```

2. Перевірте, що SDK ініціалізований перед викликом `trackPayment()`:
   ```javascript
   // Спочатку init(), потім trackPayment()
   ```

3. Перевірте логи на сервері:
   ```bash
   railway logs
   # або
   pm2 logs tma-tracker
   ```

---

## 📊 Моніторинг та аналітика

### Створення дашборду для перегляду статистики

Ви можете створити простий дашборд для перегляду аналітики:

```html
<!-- dashboard.html -->
<!DOCTYPE html>
<html>
<head>
  <title>TMA Analytics Dashboard</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #4CAF50; color: white; }
    tr:hover { background: #f5f5f5; }
  </style>
</head>
<body>
  <h1>TMA Campaign Analytics</h1>
  <div id="stats"></div>

  <script>
    const API_ENDPOINT = 'https://your-api.com/api/v1/analytics';
    const AGENCY_KEY = 'YOUR_AGENCY_API_KEY';
    const CAMPAIGNS = ['campaign_1', 'campaign_2', 'campaign_3'];

    async function loadStats() {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': AGENCY_KEY
          },
          body: JSON.stringify({ utm_parameters: CAMPAIGNS })
        });

        const result = await response.json();
        displayStats(result.data);
      } catch (error) {
        console.error('Failed to load stats:', error);
        document.getElementById('stats').innerHTML =
          '<p style="color: red;">Error loading stats</p>';
      }
    }

    function displayStats(data) {
      const html = `
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Unique Users</th>
              <th>Paying Users</th>
              <th>Revenue (Stars)</th>
              <th>Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(campaign => `
              <tr>
                <td><strong>${campaign.utm_parameter}</strong></td>
                <td>${campaign.unique_users}</td>
                <td>${campaign.paying_users}</td>
                <td>${campaign.total_revenue_stars}</td>
                <td>${campaign.conversion_rate.toFixed(2)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      document.getElementById('stats').innerHTML = html;
    }

    // Auto-refresh кожні 30 секунд
    loadStats();
    setInterval(loadStats, 30000);
  </script>
</body>
</html>
```

---

## ✅ Фінальний чеклист

Перед запуском у production:

- [ ] SDK ініціалізується при завантаженні TMA
- [ ] UTM параметри коректно визначаються з посилань
- [ ] Події `app_open` відправляються автоматично
- [ ] Платежі трекаються через `trackPayment()`
- [ ] Analytics API повертає коректні дані
- [ ] Протестовані всі 3 кампанії (campaign_1, campaign_2, campaign_3)
- [ ] Debug режим вимкнений у production (`debug: false`)
- [ ] API ключі збережені у безпечному місці (.env файл)
- [ ] CORS налаштований правильно
- [ ] Сервер має HTTPS

---

## 🎉 Готово!

Тепер ваш TMA бот `https://t.me/playdiceebot/app` інтегрований з TMA Tracker SDK!

### Що відбувається автоматично:

1. **Користувач відкриває посилання:**
   ```
   https://t.me/playdiceebot/app?startapp=campaign_1
   ```

2. **SDK автоматично:**
   - Визначає UTM параметр: `campaign_1`
   - Отримує Telegram User ID користувача
   - Відправляє подію `app_open` на сервер
   - Зберігає дані в базу (унікальна пара: UTM + User ID)

3. **Якщо користувач платить:**
   - Викликається `trackPayment({ amount: 100 })`
   - Дані зберігаються з прив'язкою до UTM параметра

4. **Ви отримуєте аналітику:**
   - Скільки унікальних користувачів по кожній кампанії
   - Скільки з них заплатили
   - Загальний дохід в Stars
   - Conversion rate

---

**Потрібна допомога?** Перевірте [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) або відкрийте issue на GitHub.
