CREATE TABLE IF NOT EXISTS spending_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  spent_date TEXT NOT NULL,
  merchant TEXT NOT NULL DEFAULT '',
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES budget_categories(id)
);
