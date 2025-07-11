-- CreateTable
CREATE TABLE "system_params" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',
    "category" TEXT NOT NULL DEFAULT 'general',
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'menu',
    "parent_id" INTEGER,
    "path" TEXT,
    "icon" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "permissions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "permissions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dictionary_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dictionary_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "description" TEXT,
    "parent_id" INTEGER,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "dictionary_items_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "dictionary_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dictionary_items_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "dictionary_items" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "user_real_name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "request_data" TEXT,
    "response_data" TEXT,
    "status" TEXT NOT NULL DEFAULT 'success',
    "error_message" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "variables" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "notification_records" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "template_id" INTEGER NOT NULL,
    "template_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "recipient_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sent_at" DATETIME,
    "read_at" DATETIME,
    "error_message" TEXT,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notification_records_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "notification_templates" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "backups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'full',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "file_path" TEXT,
    "file_size" INTEGER,
    "description" TEXT,
    "error_message" TEXT,
    "started_at" DATETIME,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "system_params_key_key" ON "system_params"("key");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "dictionary_types_code_key" ON "dictionary_types"("code");
