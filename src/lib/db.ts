import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { appEnv } from "@/src/lib/env";

declare global {
  var __ideaFinderDb: Database.Database | undefined;
}

type ColumnInfo = {
  name: string;
  notnull: number;
};

function getTableInfo(db: Database.Database, table: string) {
  return db.prepare(`PRAGMA table_info(${table})`).all() as ColumnInfo[];
}

function hasColumn(db: Database.Database, table: string, column: string) {
  const rows = getTableInfo(db, table);
  return rows.some((row) => row.name === column);
}

function ensureColumn(db: Database.Database, table: string, column: string, definition: string) {
  if (!hasColumn(db, table, column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function ensurePaymentOrdersSchema(db: Database.Database) {
  const tableInfo = getTableInfo(db, "payment_orders");
  const taskColumn = tableInfo.find((column) => column.name === "task_id");
  const hasCustomerId = tableInfo.some((column) => column.name === "customer_id");
  const hasSubscriptionPlanId = tableInfo.some((column) => column.name === "subscription_plan_id");
  const needsTaskIdRelax = Boolean(taskColumn && taskColumn.notnull === 1);

  if (!needsTaskIdRelax && hasCustomerId && hasSubscriptionPlanId) {
    return;
  }

  db.exec(`
    ALTER TABLE payment_orders RENAME TO payment_orders_legacy;

    CREATE TABLE payment_orders (
      id TEXT PRIMARY KEY,
      task_id TEXT,
      customer_id TEXT,
      locale TEXT NOT NULL,
      status TEXT NOT NULL,
      purchase_type TEXT NOT NULL DEFAULT 'one_time_pack',
      subscription_plan_id TEXT,
      subscription_duration_months INTEGER,
      subscription_auto_renew INTEGER NOT NULL DEFAULT 0,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      checkout_url TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_session_id TEXT,
      created_at TEXT NOT NULL,
      paid_at TEXT,
      FOREIGN KEY(task_id) REFERENCES idea_tasks(task_id) ON DELETE CASCADE
    );

    INSERT INTO payment_orders (
      id, task_id, customer_id, locale, status, purchase_type, subscription_plan_id, subscription_duration_months,
      subscription_auto_renew, amount, currency, checkout_url, provider, provider_session_id, created_at, paid_at
    )
    SELECT
      id, task_id, NULL, locale, status, purchase_type, NULL, NULL, 0, amount, currency, checkout_url, provider,
      provider_session_id, created_at, paid_at
    FROM payment_orders_legacy;

    DROP TABLE payment_orders_legacy;
  `);
}

function createDatabase() {
  const directory = path.dirname(appEnv.databasePath);
  fs.mkdirSync(directory, { recursive: true });

  const db = new Database(appEnv.databasePath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS idea_tasks (
      task_id TEXT PRIMARY KEY,
      keyword TEXT NOT NULL,
      market TEXT NOT NULL,
      locale TEXT NOT NULL,
      customer_id TEXT,
      requested_idea_count INTEGER NOT NULL DEFAULT 6,
      status TEXT NOT NULL,
      is_unlocked INTEGER NOT NULL DEFAULT 0,
      entitlement_type TEXT NOT NULL DEFAULT 'none',
      free_idea_count INTEGER NOT NULL DEFAULT 2,
      total_idea_count INTEGER NOT NULL DEFAULT 0,
      price_amount INTEGER NOT NULL DEFAULT 9,
      price_currency TEXT NOT NULL DEFAULT 'USD',
      error_message TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      name TEXT NOT NULL,
      one_line TEXT NOT NULL,
      target_users_json TEXT NOT NULL,
      why_text TEXT NOT NULL,
      signal_summary_json TEXT NOT NULL DEFAULT '{}',
      aso_title TEXT NOT NULL,
      aso_subtitle TEXT NOT NULL,
      aso_description TEXT NOT NULL DEFAULT '',
      aso_keywords_json TEXT NOT NULL,
      aso_hero_hook TEXT NOT NULL DEFAULT '',
      aso_value_bullets_json TEXT NOT NULL DEFAULT '[]',
      aso_paywall_copy TEXT NOT NULL DEFAULT '',
      opportunity_scores_json TEXT NOT NULL DEFAULT '{}',
      build_package_json TEXT NOT NULL DEFAULT '{}',
      FOREIGN KEY(task_id) REFERENCES idea_tasks(task_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payment_orders (
      id TEXT PRIMARY KEY,
      task_id TEXT,
      customer_id TEXT,
      locale TEXT NOT NULL,
      status TEXT NOT NULL,
      purchase_type TEXT NOT NULL DEFAULT 'one_time_pack',
      subscription_plan_id TEXT,
      subscription_duration_months INTEGER,
      subscription_auto_renew INTEGER NOT NULL DEFAULT 0,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      checkout_url TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_session_id TEXT,
      created_at TEXT NOT NULL,
      paid_at TEXT,
      FOREIGN KEY(task_id) REFERENCES idea_tasks(task_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL UNIQUE,
      plan TEXT NOT NULL,
      status TEXT NOT NULL,
      monthly_generation_limit INTEGER NOT NULL,
      monthly_download_limit INTEGER NOT NULL,
      remaining_generations INTEGER NOT NULL,
      remaining_downloads INTEGER NOT NULL,
      renews_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_generation_usage (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      usage_date_tokyo TEXT NOT NULL,
      generation_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(customer_id, usage_date_tokyo)
    );
  `);

  ensureColumn(db, "idea_tasks", "customer_id", "TEXT");
  ensureColumn(db, "idea_tasks", "requested_idea_count", "INTEGER NOT NULL DEFAULT 6");
  ensureColumn(db, "idea_tasks", "entitlement_type", "TEXT NOT NULL DEFAULT 'none'");
  ensureColumn(db, "ideas", "signal_summary_json", "TEXT NOT NULL DEFAULT '{}'");
  ensureColumn(db, "ideas", "aso_description", "TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "ideas", "build_package_json", "TEXT NOT NULL DEFAULT '{}'");
  ensureColumn(db, "ideas", "aso_hero_hook", "TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "ideas", "aso_value_bullets_json", "TEXT NOT NULL DEFAULT '[]'");
  ensureColumn(db, "ideas", "aso_paywall_copy", "TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "ideas", "opportunity_scores_json", "TEXT NOT NULL DEFAULT '{}'");
  ensureColumn(db, "payment_orders", "purchase_type", "TEXT NOT NULL DEFAULT 'one_time_pack'");
  ensureColumn(db, "payment_orders", "subscription_plan_id", "TEXT");
  ensureColumn(db, "payment_orders", "subscription_duration_months", "INTEGER");
  ensureColumn(db, "payment_orders", "subscription_auto_renew", "INTEGER NOT NULL DEFAULT 0");
  ensurePaymentOrdersSchema(db);

  return db;
}

export function getDb() {
  if (!globalThis.__ideaFinderDb) {
    globalThis.__ideaFinderDb = createDatabase();
  }

  return globalThis.__ideaFinderDb;
}
