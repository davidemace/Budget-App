DROP TABLE IF EXISTS payment_plan_entries;
DROP TABLE IF EXISTS spending_entries;
DROP TABLE IF EXISTS mortgage_scenarios;
DROP TABLE IF EXISTS savings_goals;
DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS paychecks;
DROP TABLE IF EXISTS credit_cards;
DROP TABLE IF EXISTS budget_categories;

CREATE TABLE budget_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category_type TEXT NOT NULL CHECK (category_type IN ('fixed','variable','debt','savings')),
  monthly_budget_cents INTEGER NOT NULL DEFAULT 0,
  monthly_actual_cents INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE credit_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  balance_cents INTEGER NOT NULL DEFAULT 0,
  credit_limit_cents INTEGER NOT NULL DEFAULT 0,
  apr REAL NOT NULL DEFAULT 0,
  minimum_payment_cents INTEGER NOT NULL DEFAULT 0,
  payoff_priority INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paychecks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  pay_date TEXT NOT NULL,
  net_amount_cents INTEGER NOT NULL DEFAULT 0,
  planned_bills_cents INTEGER NOT NULL DEFAULT 0,
  planned_debt_cents INTEGER NOT NULL DEFAULT 0,
  planned_savings_cents INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  due_day INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),
  amount_cents INTEGER NOT NULL DEFAULT 0,
  category_id INTEGER,
  is_fixed INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES budget_categories(id)
);

CREATE TABLE spending_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  spent_date TEXT NOT NULL,
  merchant TEXT NOT NULL DEFAULT '',
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES budget_categories(id)
);

CREATE TABLE savings_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('down_payment','emergency_fund','closing_costs','other')),
  target_cents INTEGER NOT NULL DEFAULT 0,
  current_cents INTEGER NOT NULL DEFAULT 0,
  monthly_contribution_cents INTEGER NOT NULL DEFAULT 0,
  target_date TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mortgage_scenarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  home_price_cents INTEGER NOT NULL,
  down_payment_cents INTEGER NOT NULL DEFAULT 0,
  interest_rate REAL NOT NULL DEFAULT 0,
  term_years INTEGER NOT NULL DEFAULT 30,
  annual_tax_cents INTEGER NOT NULL DEFAULT 0,
  annual_insurance_cents INTEGER NOT NULL DEFAULT 0,
  monthly_hoa_cents INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_plan_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id INTEGER NOT NULL,
  plan_month TEXT NOT NULL,
  payment_cents INTEGER NOT NULL DEFAULT 0,
  principal_cents INTEGER NOT NULL DEFAULT 0,
  interest_cents INTEGER NOT NULL DEFAULT 0,
  ending_balance_cents INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES credit_cards(id)
);
