# Admin API Documentation

Admin API позволяет управлять API ключами через HTTP запросы.

## Настройка

### 1. Установите ADMIN_SECRET

Добавьте в `.env` файл или в переменные окружения Railway:

```env
ADMIN_SECRET=your_super_secret_admin_password_here
```

**⚠️ ВАЖНО:** Используйте сложный, случайный пароль! Это ключ к управлению всеми API ключами.

### 2. Генерация ADMIN_SECRET

Можно сгенерировать случайный секрет:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Эндпоинты

Все запросы требуют заголовок `x-admin-secret` с вашим ADMIN_SECRET.

### 1. Генерация нового API ключа

**POST** `/api/v1/admin/keys/generate`

**Headers:**
```
x-admin-secret: your_admin_secret_here
Content-Type: application/json
```

**Body:**
```json
{
  "type": "client",
  "name": "My Client App Key"
}
```

**Параметры:**
- `type` (обязательно): `"client"` или `"agency"`
- `name` (опционально): Дружественное имя для ключа

**Ответ:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "a1b2c3d4e5f6...",
    "type": "client",
    "name": "My Client App Key",
    "active": true,
    "createdAt": "2024-01-08T12:00:00.000Z"
  }
}
```

**Пример с curl:**
```bash
curl -X POST https://your-app.railway.app/api/v1/admin/keys/generate \
  -H "x-admin-secret: your_admin_secret_here" \
  -H "Content-Type: application/json" \
  -d '{"type": "client", "name": "My App"}'
```

---

### 2. Список всех API ключей

**GET** `/api/v1/admin/keys/list`

**Headers:**
```
x-admin-secret: your_admin_secret_here
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "key": "a1b2c3d4...e5f6g7h8",
      "type": "client",
      "name": "My Client App Key",
      "active": true,
      "createdAt": "2024-01-08T12:00:00.000Z",
      "lastUsedAt": "2024-01-08T13:30:00.000Z"
    }
  ]
}
```

**Примечание:** Полный ключ не показывается в целях безопасности (только первые и последние 8 символов).

**Пример с curl:**
```bash
curl https://your-app.railway.app/api/v1/admin/keys/list \
  -H "x-admin-secret: your_admin_secret_here"
```

---

### 3. Удаление (деактивация) API ключа

**DELETE** `/api/v1/admin/keys/delete`

**Headers:**
```
x-admin-secret: your_admin_secret_here
Content-Type: application/json
```

**Body:**
```json
{
  "key": "a1b2c3d4e5f6..."
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "API key deactivated successfully",
  "data": {
    "id": 1,
    "type": "client",
    "name": "My Client App Key"
  }
}
```

**Пример с curl:**
```bash
curl -X DELETE https://your-app.railway.app/api/v1/admin/keys/delete \
  -H "x-admin-secret: your_admin_secret_here" \
  -H "Content-Type: application/json" \
  -d '{"key": "a1b2c3d4e5f6..."}'
```

---

## Безопасность

1. **Никогда не коммитьте ADMIN_SECRET в git**
2. **Используйте HTTPS** для всех запросов в продакшене
3. **Храните ADMIN_SECRET в безопасном месте** (менеджер паролей, Railway Variables)
4. **Регулярно меняйте ADMIN_SECRET** если есть подозрение на компрометацию

---

## Примеры использования

### Создать новый ключ для клиента

```bash
curl -X POST https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/generate \
  -H "x-admin-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type": "client", "name": "Production Client Key"}'
```

### Посмотреть все ключи

```bash
curl https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/list \
  -H "x-admin-secret: YOUR_SECRET"
```

### Деактивировать старый ключ

```bash
curl -X DELETE https://tma-trackerserver-production.up.railway.app/api/v1/admin/keys/delete \
  -H "x-admin-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"key": "old_key_here"}'
```

