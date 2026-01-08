# 🚀 Гайд з підготовки SDK до Production

## ✅ Статус перевірки (2026-01-08)

### Що протестовано:
- ✅ Сервер запущений і працює на порту 3000
- ✅ Health endpoint відповідає: `/health` → `{"status":"ok"}`
- ✅ База даних SQLite працює (dev.db, 44KB)
- ✅ API ключі згенеровані та працюють:
  - Client API Key: `073dc2bd3f34f2ecda8d76c7f1a354243e9f601e5c951203555f5fb08ae89f5a`
  - Agency API Key: `4fec482b12cff09e66480cb12dbf1caeb78713f84622f5764c68fc0e775d9c16`
- ✅ Клієнтський SDK зібраний (UMD, ESM, CJS)
- ✅ Трекінг події `app_open` працює для всіх кампаній
- ✅ Трекінг платежів працює
- ✅ Analytics API повертає коректні дані

### Тестові результати аналітики:
```json
{
  "success": true,
  "data": [
    {
      "utm_parameter": "campaign_1",
      "unique_users": 1,
      "paying_users": 1,
      "total_revenue_stars": 100,
      "conversion_rate": 100
    },
    {
      "utm_parameter": "campaign_2",
      "unique_users": 1,
      "paying_users": 0,
      "total_revenue_stars": 0,
      "conversion_rate": 0
    },
    {
      "utm_parameter": "campaign_3",
      "unique_users": 1,
      "paying_users": 0,
      "total_revenue_stars": 0,
      "conversion_rate": 0
    }
  ]
}
```

---

## 📋 Покроковий план підготовки SDK до імплементації

### Етап 1: Деплой серверної частини (ОБОВ'ЯЗКОВО)

SDK працює локально, але для використання в реальному TMA потрібен публічний HTTPS endpoint.

#### Варіант А: Деплой на Railway (найпростіше, безкоштовно) ⭐ РЕКОМЕНДОВАНО

**Крок 1: Підготувати GitHub репозиторій**

```bash
cd /home/deploy/tma-tracker-sdk

# Ініціалізувати Git (якщо ще не зроблено)
git init

# Додати всі файли
git add .

# Створити перший коміт
git commit -m "Initial commit: TMA Tracker SDK"

# Створити репозиторій на GitHub (через веб-інтерфейс або gh CLI)
# Якщо використовуєте GitHub CLI:
gh repo create tma-tracker-sdk --public --source=. --remote=origin --push

# Або вручну додати remote та запушити:
git remote add origin https://github.com/YOUR_USERNAME/tma-tracker-sdk.git
git branch -M main
git push -u origin main
```

**Крок 2: Створити конфігурацію для Railway**

Створіть файл `railway.json` у корені проекту:

```bash
cd /home/deploy/tma-tracker-sdk

cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd packages/server && npm run start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

# Додати до Git
git add railway.json
git commit -m "Add Railway configuration"
git push
```

**Крок 3: Створити акаунт на Railway та підключити GitHub**

1. Відкрити https://railway.app і натиснути **Start a New Project**
2. Авторизуватись через GitHub
3. Надати Railway доступ до вашого репозиторію

**Крок 4: Створити новий проект на Railway**

1. На Dashboard натиснути **New Project**
2. Вибрати **Deploy from GitHub repo**
3. Вибрати репозиторій `tma-tracker-sdk`
4. Railway автоматично визначить налаштування та почне деплой

**Крок 5: Налаштувати змінні оточення (Environment Variables)**

У Railway Dashboard:

1. Перейти в **Variables** (ліва панель)
2. Додати наступні змінні:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=file:./prisma/prod.db
CORS_ORIGIN=https://t.me
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

**НЕ додавайте** API ключі зараз - їх ми згенеруємо пізніше!

3. Натиснути **Deploy** для рестарту з новими змінними

**Крок 6: Отримати публічний URL**

1. У Railway Dashboard перейти в **Settings** → **Networking**
2. Натиснути **Generate Domain**
3. Railway надасть URL типу: `https://tma-tracker-production.up.railway.app`
4. Скопіювати цей URL - він вам знадобиться

**Крок 7: Перевірити деплой**

```bash
# Замініть URL на ваш Railway URL
curl https://your-app.up.railway.app/health

# Очікуваний результат:
# {"status":"ok"}
```

**Крок 8: Згенерувати production API ключі**

Є два способи:

**Спосіб A: Через Railway CLI (швидше)**

```bash
# Встановити Railway CLI
npm install -g @railway/cli

# Залогінитись
railway login

# Підключитись до проекту
railway link

# Відкрити shell на Railway сервері
railway run npm run generate-keys --workspace packages/server

# Скопіювати згенеровані ключі
```

**Спосіб Б: Через веб-консоль Railway (без CLI)**

1. У Railway Dashboard натиснути на три крапки → **View Logs**
2. Згори справа натиснути **Terminal**
3. У терміналі виконати:
```bash
cd packages/server
npm run generate-keys
```
4. Скопіювати згенеровані ключі з виводу

**Крок 9: Додати API ключі в Environment Variables**

1. Повернутись у **Variables**
2. Додати згенеровані ключі:
```env
CLIENT_API_KEY=ваш_згенерований_client_key
AGENCY_API_KEY=ваш_згенерований_agency_key
```
3. Натиснути **Deploy** для застосування змін

**Крок 10: Фінальна перевірка**

```bash
# Перевірити трекінг події
curl -X POST https://your-app.up.railway.app/api/v1/events \
  -H "X-API-Key: YOUR_CLIENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "app_open",
    "data": {
      "utmParameter": "railway_test",
      "telegramUserId": 123456789
    }
  }'

# Очікуваний результат:
# {"success":true,"message":"Event tracked successfully"}

# Перевірити аналітику
curl -X POST https://your-app.up.railway.app/api/v1/analytics \
  -H "X-API-Key: YOUR_AGENCY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"utm_parameters": ["railway_test"]}'

# Очікуваний результат: JSON з аналітикою
```

**Крок 11: Налаштувати автоматичні деплої (вже працює!)**

Railway автоматично деплоїть при кожному `git push` на `main` гілку.

Щоб задеплоїти зміни:
```bash
git add .
git commit -m "Your changes"
git push
```

Railway автоматично:
- Виявить зміни
- Зберіть проект
- Задеплоїть нову версію
- Покаже логи в Dashboard

**Troubleshooting**

Якщо деплой не працює:

1. **Перевірити логи**: Railway Dashboard → **View Logs**
2. **Перевірити build логи**: Railway Dashboard → **Deployments** → клік на останній деплой
3. **Перевірити змінні**: Railway Dashboard → **Variables** - переконайтесь, що всі змінні встановлені
4. **Ручний редеплой**: Railway Dashboard → три крапки → **Redeploy**

**Моніторинг та обслуговування**

```bash
# Переглянути логи
railway logs

# Переглянути логи в реальному часі
railway logs --follow

# Відкрити веб-термінал
# Railway Dashboard → Terminal (згори справа)

# Відкрити Prisma Studio для перегляду даних
railway run npx prisma studio --workspace packages/server
```

#### Варіант Б: Деплой на VPS (DigitalOcean, AWS, Hetzner)

1. **Встановити Node.js на сервер**
   ```bash
   ssh user@your-server.com

   # Встановити Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Встановити PM2
   sudo npm install -g pm2
   ```

2. **Скопіювати проект на сервер**
   ```bash
   # На локальній машині
   rsync -avz /home/deploy/tma-tracker-sdk user@your-server.com:/var/www/
   ```

3. **Налаштувати на сервері**
   ```bash
   ssh user@your-server.com
   cd /var/www/tma-tracker-sdk

   # Встановити залежності
   npm install

   # Зібрати проект
   npm run build

   # Налаштувати .env
   cd packages/server
   cp .env.example .env
   nano .env  # Відредагувати налаштування

   # Запустити міграції
   npm run prisma:migrate

   # Згенерувати API ключі
   npm run generate-keys
   ```

4. **Запустити з PM2**
   ```bash
   cd /var/www/tma-tracker-sdk/packages/server
   pm2 start dist/index.js --name tma-tracker
   pm2 save
   pm2 startup
   ```

5. **Налаштувати NGINX reverse proxy**
   ```bash
   sudo nano /etc/nginx/sites-available/tma-tracker
   ```

   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/tma-tracker /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx

   # Встановити SSL (Let's Encrypt)
   sudo certbot --nginx -d api.yourdomain.com
   ```

---

### Етап 2: Підготовка клієнтського SDK

#### Опція 1: NPM пакет (рекомендовано)

```bash
cd /home/deploy/tma-tracker-sdk/packages/client

# Опублікувати на NPM
npm login
npm publish --access public
```

Після публікації можна встановлювати:
```bash
npm install @tma-tracker/client
```

#### Опція 2: CDN (швидкий старт)

Завантажити файл `packages/client/dist/index.umd.js` на CDN (наприклад, jsDelivr, unpkg).

Або розмістити на власному сервері та підключати через `<script>`:
```html
<script src="https://your-cdn.com/tma-tracker.umd.js"></script>
```

---

### Етап 3: Перевірка готовності

Перед імплементацією в TMA перевірте:

```bash
# 1. Перевірити health endpoint
curl https://your-production-api.com/health

# 2. Перевірити трекінг події
curl -X POST https://your-production-api.com/api/v1/events \
  -H "X-API-Key: YOUR_CLIENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "app_open",
    "data": {
      "utmParameter": "test",
      "telegramUserId": 123456789
    }
  }'

# 3. Перевірити аналітику
curl -X POST https://your-production-api.com/api/v1/analytics \
  -H "X-API-Key: YOUR_AGENCY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"utm_parameters": ["test"]}'
```

---

## ✅ Чеклист готовності до production

- [ ] Сервер задеплоєний і доступний через HTTPS
- [ ] Згенеровані production API ключі
- [ ] База даних налаштована (SQLite або PostgreSQL)
- [ ] CORS налаштований на `https://t.me`
- [ ] Health endpoint відповідає
- [ ] Клієнтський SDK опублікований або доступний через CDN
- [ ] Протестовані всі endpoints (events, analytics)
- [ ] Налаштований моніторинг (опціонально, але рекомендовано)

---

## 🔧 Корисні команди для обслуговування

```bash
# Переглянути логи (Railway)
railway logs

# Переглянути логи (PM2)
pm2 logs tma-tracker

# Перезапустити сервер (PM2)
pm2 restart tma-tracker

# Відкрити Prisma Studio для перегляду даних
npm run prisma:studio -w packages/server

# Створити бекап бази даних (SQLite)
cp packages/server/prisma/prod.db packages/server/prisma/backup-$(date +%Y%m%d).db

# Очистити дані за певний період (опціонально)
# Використовуйте Prisma Studio або напишіть власний скрипт
```

---

**Наступний крок:** Перейдіть до файлу `IMPLEMENTATION_GUIDE.md` для інструкцій з імплементації SDK у ваш TMA бот.
