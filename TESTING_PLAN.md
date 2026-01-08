# 🧪 План тестування TMA Tracker SDK

## 📋 Перевірка згідно ТЗ

### ✅ Що вже реалізовано:

1. **Клієнтська частина SDK**
   - ✅ Автоматичне витягування `startapp` параметра
   - ✅ Декодування base64
   - ✅ Автоматичний трекінг app_open при ініціалізації
   - ✅ Метод `trackPayment()` для трекінгу платежів
   - ✅ Підтримка UMD/ESM/CJS форматів

2. **Серверна частина SDK**
   - ✅ POST /api/v1/events - прийом даних від клієнта
   - ✅ POST /api/v1/analytics - надання аналітики агентству
   - ✅ Різні API ключі для client/agency
   - ✅ Rate limiting
   - ✅ Валідація даних через Zod

3. **База даних**
   - ✅ SQLite з Prisma ORM
   - ✅ Таблиці: app_opens, payments, api_keys
   - ✅ Унікальний індекс по (utm_parameter, telegram_user_id)

---

## 🎯 План тестування на реальному TMA

### Етап 1: Підготовка серверної частини

#### 1.1 Деплой API сервера на VPS

**Варіант A: На поточному сервері (134.209.244.254)**

```bash
# Переконайтесь що ви в директорії проекту
cd ~/tma-tracker-sdk

# Зберіть проект
npm run build

# Запустіть сервер в production режимі з PM2
npm install -g pm2
cd packages/server
pm2 start dist/index.js --name tma-tracker-api
pm2 save
pm2 startup
```

**Варіант B: Використати існуючий dev сервер для тестів**

```bash
# Просто запустіть в окремому терміналі
npm run dev:server
```

#### 1.2 Налаштування NGINX (для production)

Створіть конфігурацію `/etc/nginx/sites-available/tma-tracker`:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # або IP адреса

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Активувати конфігурацію
sudo ln -s /etc/nginx/sites-available/tma-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 1.3 Перевірка API сервера

```bash
# Здоров'я сервера
curl http://YOUR_SERVER_IP:3000/health

# Тест трекінгу події (має працювати)
curl -X POST http://YOUR_SERVER_IP:3000/api/v1/events \
  -H "X-API-Key: 073dc2bd3f34f2ecda8d76c7f1a354243e9f601e5c951203555f5fb08ae89f5a" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "app_open",
    "data": {
      "utmParameter": "TestCampaign",
      "telegramUserId": 999999999,
      "username": "test_user"
    }
  }'

# Перевірка що дані збереглися
npm run prisma:studio -w packages/server
# Відкрийте http://localhost:5555 та подивіться таблицю app_opens
```

---

### Етап 2: Створення тестового Telegram Mini App

#### 2.1 Створення бота через @BotFather

1. Відкрийте [@BotFather](https://t.me/BotFather) в Telegram
2. Відправте `/newbot`
3. Вкажіть назву бота: `TMA Tracker Test`
4. Вкажіть username: `tma_tracker_test_bot` (має бути унікальним)
5. Збережіть токен бота

#### 2.2 Створення простого HTML Mini App

Створіть файл `test-miniapp/index.html`:

```html
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TMA Tracker Test</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: var(--tg-theme-bg-color, #fff);
            color: var(--tg-theme-text-color, #000);
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        h1 { margin-top: 0; }
        .info-block {
            background: var(--tg-theme-secondary-bg-color, #f0f0f0);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .info-item {
            margin: 8px 0;
            font-size: 14px;
        }
        .label {
            font-weight: 600;
            color: var(--tg-theme-hint-color, #999);
        }
        button {
            width: 100%;
            padding: 12px;
            background: var(--tg-theme-button-color, #3390ec);
            color: var(--tg-theme-button-text-color, #fff);
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin: 10px 0;
        }
        button:active {
            opacity: 0.8;
        }
        .status {
            padding: 10px;
            border-radius: 6px;
            margin: 10px 0;
            font-size: 14px;
        }
        .success {
            background: #d4edda;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 TMA Tracker SDK Test</h1>

        <div class="info-block">
            <div class="info-item">
                <span class="label">User ID:</span>
                <span id="userId">Loading...</span>
            </div>
            <div class="info-item">
                <span class="label">Username:</span>
                <span id="username">Loading...</span>
            </div>
            <div class="info-item">
                <span class="label">UTM Parameter:</span>
                <span id="utmParam">Loading...</span>
            </div>
            <div class="info-item">
                <span class="label">SDK Status:</span>
                <span id="sdkStatus">Not initialized</span>
            </div>
        </div>

        <button id="testPaymentBtn">💳 Тест платежу (100 Stars)</button>

        <div id="statusMessage"></div>
    </div>

    <!-- Підключення TMA Tracker SDK -->
    <script type="module">
        // ВАЖЛИВО: Замініть на адресу вашого API сервера
        const API_ENDPOINT = 'http://YOUR_SERVER_IP:3000';
        const CLIENT_API_KEY = '073dc2bd3f34f2ecda8d76c7f1a354243e9f601e5c951203555f5fb08ae89f5a';

        // Імпорт SDK (використаємо локальну збірку для тестів)
        import TMATracks from '/dist/index.esm.js';

        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        // Відображення інформації про користувача
        const user = tg.initDataUnsafe?.user;
        if (user) {
            document.getElementById('userId').textContent = user.id;
            document.getElementById('username').textContent = user.username || 'N/A';
        }

        // Ініціалізація SDK
        (async () => {
            try {
                await TMATracks.init({
                    apiKey: CLIENT_API_KEY,
                    apiEndpoint: API_ENDPOINT,
                    debug: true  // Увімкнути логування в консоль
                });

                document.getElementById('sdkStatus').textContent = '✅ Initialized';
                document.getElementById('sdkStatus').style.color = 'green';

                // Показати UTM параметр
                const utm = TMATracks.getUtmParameter();
                document.getElementById('utmParam').textContent = utm || 'Not set';

                showStatus('✅ SDK ініціалізовано! App open відстежено.', 'success');
            } catch (error) {
                console.error('SDK Init Error:', error);
                document.getElementById('sdkStatus').textContent = '❌ Failed';
                document.getElementById('sdkStatus').style.color = 'red';
                showStatus('❌ Помилка ініціалізації: ' + error.message, 'error');
            }
        })();

        // Тест платежу
        document.getElementById('testPaymentBtn').addEventListener('click', async () => {
            try {
                // В реальному додатку тут буде виклик Telegram Stars payment
                // const invoice = await tg.openInvoice(invoiceUrl);

                // Для тесту просто трекаємо платіж
                await TMATracks.trackPayment({
                    amount: 100,
                    paymentId: 'test_' + Date.now()
                });

                showStatus('✅ Платіж 100 Stars відстежено!', 'success');

                tg.showPopup({
                    title: 'Успіх!',
                    message: 'Платіж відстежено в TMA Tracker',
                    buttons: [{type: 'ok'}]
                });
            } catch (error) {
                console.error('Payment Track Error:', error);
                showStatus('❌ Помилка трекінгу платежу: ' + error.message, 'error');
            }
        });

        function showStatus(message, type) {
            const statusDiv = document.getElementById('statusMessage');
            statusDiv.textContent = message;
            statusDiv.className = 'status ' + type;
        }
    </script>
</body>
</html>
```

#### 2.3 Розміщення Mini App

**Варіант A: GitHub Pages (рекомендовано для тестів)**

```bash
# В корені проекту створіть директорію для тесту
mkdir -p test-miniapp/dist

# Скопіюйте зібраний SDK
cp packages/client/dist/index.esm.js test-miniapp/dist/

# Створіть index.html (код вище)
# Редагуйте API_ENDPOINT на вашу адресу

# Створіть git репозиторій та запуште на GitHub
cd test-miniapp
git init
git add .
git commit -m "Test TMA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tma-tracker-test.git
git push -u origin main

# Увімкніть GitHub Pages в Settings → Pages
# Source: main branch, / (root)
```

**Варіант B: На вашому VPS через NGINX**

```bash
# Створіть директорію для статики
sudo mkdir -p /var/www/tma-test
sudo cp test-miniapp/index.html /var/www/tma-test/
sudo cp -r packages/client/dist /var/www/tma-test/

# Налаштуйте NGINX для статики
# Додайте location в конфігурацію
```

#### 2.4 Налаштування Mini App в BotFather

1. Відкрийте [@BotFather](https://t.me/BotFather)
2. Відправте `/newapp`
3. Виберіть вашого бота
4. Вкажіть назву: `Tracker Test`
5. Опис: `Testing TMA Tracker SDK`
6. Завантажте іконку 640x640 (будь-яку)
7. Вкажіть URL вашого Mini App:
   - GitHub Pages: `https://YOUR_USERNAME.github.io/tma-tracker-test/`
   - Власний сервер: `http://YOUR_SERVER_IP/test-app/`
8. Виберіть short name: `trackertest`

---

### Етап 3: Тестування функціоналу

#### 3.1 Тест 1: Автоматичний трекінг app_open

**Кроки:**

1. Створіть посилання з UTM параметром:
   ```
   https://t.me/YOUR_BOT_NAME/trackertest?startapp=Campaign_1
   ```

2. Відкрийте посилання в Telegram (мобільний або десктоп)

3. Перевірте логи в консолі браузера (відкрийте Dev Tools)

4. Перевірте що дані потрапили в БД:
   ```bash
   npm run prisma:studio -w packages/server
   ```

   В таблиці `app_opens` має з'явитися запис:
   - `utm_parameter`: Campaign_1
   - `telegram_user_id`: ваш Telegram ID
   - `username`: ваш username
   - `timestamp`: час відкриття

#### 3.2 Тест 2: Base64 encoded UTM

1. Закодуйте Campaign_2 в base64:
   ```bash
   echo -n "Campaign_2" | base64
   # Результат: Q2FtcGFpZ25fMg==
   ```

2. Створіть посилання:
   ```
   https://t.me/YOUR_BOT_NAME/trackertest?startapp=Q2FtcGFpZ25fMg==
   ```

3. Відкрийте в Telegram

4. Перевірте в БД що `utm_parameter` декодовано як "Campaign_2"

#### 3.3 Тест 3: Трекінг платежу

1. В Mini App натисніть кнопку "Тест платежу (100 Stars)"

2. Перевірте в консолі що немає помилок

3. Перевірте в БД таблицю `payments`:
   - `utm_parameter`: Campaign_1 (або який був при відкритті)
   - `telegram_user_id`: ваш ID
   - `amount`: 100
   - `payment_id`: test_TIMESTAMP

#### 3.4 Тест 4: Analytics API (Agency)

1. Відкрийте Mini App 3-5 разів з різними UTM:
   - Campaign_1
   - Campaign_2
   - Campaign_3

2. Зробіть кілька тестових "платежів"

3. Викличте Analytics API:
   ```bash
   curl -X POST http://YOUR_SERVER_IP:3000/api/v1/analytics \
     -H "X-API-Key: 4fec482b12cff09e66480cb12dbf1caeb78713f84622f5764c68fc0e775d9c16" \
     -H "Content-Type: application/json" \
     -d '{
       "utm_parameters": ["Campaign_1", "Campaign_2", "Campaign_3"]
     }'
   ```

4. Перевірте відповідь:
   ```json
   {
     "success": true,
     "data": [
       {
         "utm_parameter": "Campaign_1",
         "unique_users": 1,
         "paying_users": 1,
         "total_revenue_stars": 200,
         "conversion_rate": 100.00
       },
       ...
     ]
   }
   ```

---

### Етап 4: Тестування security

#### 4.1 Тест: Невалідний Client API key

```bash
curl -X POST http://YOUR_SERVER_IP:3000/api/v1/events \
  -H "X-API-Key: invalid_key" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "app_open",
    "data": {"utmParameter": "Test", "telegramUserId": 123}
  }'

# Очікувана відповідь: 401 Unauthorized
```

#### 4.2 Тест: Client key не може викликати Analytics

```bash
curl -X POST http://YOUR_SERVER_IP:3000/api/v1/analytics \
  -H "X-API-Key: 073dc2bd3f34f2ecda8d76c7f1a354243e9f601e5c951203555f5fb08ae89f5a" \
  -H "Content-Type: application/json" \
  -d '{"utm_parameters": ["Campaign_1"]}'

# Очікувана відповідь: 403 Forbidden
```

#### 4.3 Тест: Rate limiting

```bash
# Запустіть 101 запит швидко
for i in {1..101}; do
  curl -X POST http://YOUR_SERVER_IP:3000/api/v1/events \
    -H "X-API-Key: 073dc2bd3f34f2ecda8d76c7f1a354243e9f601e5c951203555f5fb08ae89f5a" \
    -H "Content-Type: application/json" \
    -d "{\"event_type\": \"app_open\", \"data\": {\"utmParameter\": \"Test\", \"telegramUserId\": $i}}" &
done

# 101-й запит має повернути: 429 Too Many Requests
```

---

## 📊 Checklist тестування

### Базовий функціонал
- [ ] Сервер запускається без помилок
- [ ] Health endpoint відповідає
- [ ] SDK ініціалізується в Mini App
- [ ] Автоматичний трекінг app_open працює
- [ ] UTM параметр витягується з startapp
- [ ] Base64 декодування працює
- [ ] trackPayment() зберігає дані
- [ ] Analytics API повертає статистику
- [ ] Conversion rate рахується правильно

### Security
- [ ] Client API key працює для /events
- [ ] Agency API key працює для /analytics
- [ ] Client key НЕ працює для /analytics
- [ ] Agency key НЕ працює для /events
- [ ] Невалідний ключ повертає 401
- [ ] Rate limiting спрацьовує
- [ ] CORS налаштовано правильно

### Унікальність
- [ ] Повторне відкриття з тим же UTM + user_id НЕ дублює запис в app_opens
- [ ] Кожен платіж створює новий запис в payments
- [ ] unique_users рахується правильно
- [ ] paying_users враховує унікальних користувачів

---

## 🚨 Можливі проблеми та рішення

### 1. CORS помилка в браузері
**Рішення:** Додайте в packages/server/.env:
```
CORS_ORIGIN=https://YOUR_MINIAPP_DOMAIN
```

### 2. SDK не ініціалізується
**Перевірте:**
- API endpoint доступний (curl)
- API key правильний
- В консолі браузера немає помилок мережі

### 3. UTM parameter = null
**Причини:**
- Посилання відкрито БЕЗ startapp параметра
- Telegram WebApp не ініціалізований
- Перевірте console.log в getStartParam()

### 4. База даних locked
**Рішення:**
```bash
cd packages/server
rm prisma/dev.db-journal
npx prisma db push
```

---

## 📝 Результати тестування

Після завершення тестів заповніть:

**Дата тестування:** _________________

**Версія SDK:** 1.0.0

**Тестове середовище:**
- Server: _________________
- Mini App URL: _________________
- Bot: @_________________

**Результати:**
- ✅ / ❌ Всі базові тести пройдені
- ✅ / ❌ Security тести пройдені
- ✅ / ❌ Готовий до production

**Знайдені баги:**
1. _________________
2. _________________

**Рекомендації:**
- _________________

---

**Готово до наступного етапу: Production Deploy! 🚀**
