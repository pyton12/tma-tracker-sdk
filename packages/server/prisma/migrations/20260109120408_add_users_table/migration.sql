-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telegram_user_id" BIGINT NOT NULL,
    "first_utm_parameter" TEXT NOT NULL,
    "username" TEXT,
    "language_code" TEXT,
    "first_seen_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "app_opens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utm_parameter" TEXT NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "username" TEXT,
    "language_code" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utm_parameter" TEXT NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_id" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_user_id_key" ON "users"("telegram_user_id");

-- CreateIndex
CREATE INDEX "users_first_utm_parameter_idx" ON "users"("first_utm_parameter");

-- CreateIndex
CREATE INDEX "app_opens_utm_parameter_idx" ON "app_opens"("utm_parameter");

-- CreateIndex
CREATE UNIQUE INDEX "app_opens_utm_parameter_telegram_user_id_key" ON "app_opens"("utm_parameter", "telegram_user_id");

-- CreateIndex
CREATE INDEX "payments_utm_parameter_idx" ON "payments"("utm_parameter");

-- CreateIndex
CREATE INDEX "payments_telegram_user_id_idx" ON "payments"("telegram_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "api_keys_key_idx" ON "api_keys"("key");
