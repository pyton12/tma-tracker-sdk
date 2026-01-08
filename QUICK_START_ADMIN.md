# 🚀 Быстрый старт Admin API

## Шаг 1: Добавь ADMIN_SECRET в Railway

1. Открой Railway Dashboard
2. Нажми на сервис **@tma-tracker/server**
3. Перейди на вкладку **Variables**
4. Нажми **New Variable**
5. Добавь:
   - **Name:** `ADMIN_SECRET`
   - **Value:** `admin_12345` (или любой другой секретный пароль)

**💡 Совет:** Сгенерируй случайный секрет:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Шаг 2: Задеплой изменения

```bash
git push origin main
```

Railway автоматически задеплоит новую версию с Admin API.

---

## Шаг 3: Создай первые API ключи

### Вариант A: Через скрипт (рекомендуется)

```bash
cd packages/server
./scripts/setup-initial-keys.sh https://tma-trackerserver-production.up.railway.app admin_12345
```

### Вариант B: Вручную через curl

**Создать Client ключ:**
```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/generate \
  -H "x-admin-secret: admin_12345" \
  -H "Content-Type: application/json" \
  -d '{"type": "client", "name": "Client SDK Key"}'
```

**Создать Agency ключ:**
```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/generate \
  -H "x-admin-secret: admin_12345" \
  -H "Content-Type: application/json" \
  -d '{"type": "agency", "name": "Agency Analytics Key"}'
```

---

## Шаг 4: Добавь ключи в Railway Variables

1. Скопируй сгенерированные ключи
2. В Railway Variables добавь:
   - `CLIENT_API_KEY=<твой_client_ключ>`
   - `AGENCY_API_KEY=<твой_agency_ключ>`

---

## 🎯 Готово!

Теперь у тебя есть:
- ✅ Admin API для управления ключами
- ✅ Client и Agency API ключи в базе данных
- ✅ Возможность генерировать новые ключи когда угодно

---

## 📚 Дополнительно

### Посмотреть все ключи

```bash
curl https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/list \
  -H "x-admin-secret: admin_12345"
```

### Удалить (деактивировать) ключ

```bash
curl -X DELETE https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/delete \
  -H "x-admin-secret: admin_12345" \
  -H "Content-Type: application/json" \
  -d '{"key": "ключ_который_нужно_удалить"}'
```

---

## 🔐 Безопасность

- **Никогда не коммить ADMIN_SECRET в git**
- **Использовать HTTPS** для всех запросов
- **Хранить ADMIN_SECRET в безопасном месте**

---

Полная документация: `packages/server/ADMIN_API.md`

