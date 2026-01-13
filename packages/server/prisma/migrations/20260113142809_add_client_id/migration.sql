/*
  Warnings:

  - Added the required column `client_id` to the `api_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `app_opens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_api_keys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" DATETIME
);
INSERT INTO "new_api_keys" ("active", "created_at", "id", "key", "last_used_at", "name", "type", "client_id") SELECT "active", "created_at", "id", "key", "last_used_at", "name", "type", 'playdice' FROM "api_keys";
DROP TABLE "api_keys";
ALTER TABLE "new_api_keys" RENAME TO "api_keys";
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");
CREATE INDEX "api_keys_key_idx" ON "api_keys"("key");
CREATE INDEX "api_keys_client_id_idx" ON "api_keys"("client_id");
CREATE TABLE "new_app_opens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client_id" TEXT NOT NULL,
    "utm_parameter" TEXT NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "username" TEXT,
    "language_code" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_app_opens" ("id", "language_code", "telegram_user_id", "timestamp", "username", "utm_parameter", "client_id") SELECT "id", "language_code", "telegram_user_id", "timestamp", "username", "utm_parameter", 'playdice' FROM "app_opens";
DROP TABLE "app_opens";
ALTER TABLE "new_app_opens" RENAME TO "app_opens";
CREATE INDEX "app_opens_client_id_idx" ON "app_opens"("client_id");
CREATE INDEX "app_opens_utm_parameter_idx" ON "app_opens"("utm_parameter");
CREATE UNIQUE INDEX "app_opens_client_id_utm_parameter_telegram_user_id_key" ON "app_opens"("client_id", "utm_parameter", "telegram_user_id");
CREATE TABLE "new_payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client_id" TEXT NOT NULL,
    "utm_parameter" TEXT NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_id" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_payments" ("amount", "id", "payment_id", "telegram_user_id", "timestamp", "utm_parameter", "client_id") SELECT "amount", "id", "payment_id", "telegram_user_id", "timestamp", "utm_parameter", 'playdice' FROM "payments";
DROP TABLE "payments";
ALTER TABLE "new_payments" RENAME TO "payments";
CREATE INDEX "payments_client_id_idx" ON "payments"("client_id");
CREATE INDEX "payments_utm_parameter_idx" ON "payments"("utm_parameter");
CREATE INDEX "payments_telegram_user_id_idx" ON "payments"("telegram_user_id");
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client_id" TEXT NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "first_utm_parameter" TEXT NOT NULL,
    "username" TEXT,
    "language_code" TEXT,
    "first_seen_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("first_seen_at", "first_utm_parameter", "id", "language_code", "last_seen_at", "telegram_user_id", "username", "client_id") SELECT "first_seen_at", "first_utm_parameter", "id", "language_code", "last_seen_at", "telegram_user_id", "username", 'playdice' FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE INDEX "users_client_id_idx" ON "users"("client_id");
CREATE INDEX "users_first_utm_parameter_idx" ON "users"("first_utm_parameter");
CREATE UNIQUE INDEX "users_client_id_telegram_user_id_key" ON "users"("client_id", "telegram_user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
