INSERT INTO budget_categories (name, category_type, monthly_budget_cents, monthly_actual_cents, sort_order) VALUES
  ('Rent', 'fixed', 165000, 165000, 10),
  ('Utilities', 'fixed', 28000, 26500, 20),
  ('Internet and phones', 'fixed', 19000, 19000, 30),
  ('Groceries', 'variable', 72000, 69000, 40),
  ('Fuel and transportation', 'variable', 36000, 34000, 50),
  ('Household and personal', 'variable', 30000, 25000, 60),
  ('Credit card minimums', 'debt', 42500, 42500, 70),
  ('Down payment savings', 'savings', 90000, 90000, 80),
  ('Emergency fund savings', 'savings', 35000, 35000, 90);

INSERT INTO credit_cards (name, balance_cents, credit_limit_cents, apr, minimum_payment_cents, payoff_priority) VALUES
  ('Everyday Rewards Visa', 615000, 750000, 24.99, 18500, 90),
  ('Home Project Mastercard', 430000, 1000000, 21.49, 13000, 60),
  ('Travel Points Card', 178000, 600000, 19.99, 6500, 30),
  ('Store Financing Card', 88000, 220000, 27.99, 4500, 40);

INSERT INTO paychecks (name, pay_date, net_amount_cents, planned_bills_cents, planned_debt_cents, planned_savings_cents, notes) VALUES
  ('First paycheck', '2026-07-05', 395000, 214000, 42500, 62500, 'Cover early-month fixed bills and required card minimums.'),
  ('Second paycheck', '2026-07-19', 395000, 140000, 90000, 62500, 'Extra utilization payment plus home-buyer savings.');

INSERT INTO bills (name, due_day, amount_cents, category_id, is_fixed) VALUES
  ('Rent', 1, 165000, (SELECT id FROM budget_categories WHERE name = 'Rent'), 1),
  ('Electric and gas', 8, 18000, (SELECT id FROM budget_categories WHERE name = 'Utilities'), 1),
  ('Water and trash', 12, 8500, (SELECT id FROM budget_categories WHERE name = 'Utilities'), 1),
  ('Internet', 15, 8500, (SELECT id FROM budget_categories WHERE name = 'Internet and phones'), 1),
  ('Mobile phones', 21, 10500, (SELECT id FROM budget_categories WHERE name = 'Internet and phones'), 1),
  ('Car insurance', 24, 14500, (SELECT id FROM budget_categories WHERE name = 'Fuel and transportation'), 1);

INSERT INTO savings_goals (name, goal_type, target_cents, current_cents, monthly_contribution_cents, target_date, priority) VALUES
  ('Down payment fund', 'down_payment', 2800000, 940000, 90000, '2027-12-31', 100),
  ('Emergency fund', 'emergency_fund', 1200000, 465000, 35000, '2027-06-30', 90),
  ('Closing costs buffer', 'closing_costs', 900000, 125000, 20000, '2027-12-31', 70);

INSERT INTO mortgage_scenarios (name, home_price_cents, down_payment_cents, interest_rate, term_years, annual_tax_cents, annual_insurance_cents, monthly_hoa_cents) VALUES
  ('$320k starter home', 32000000, 2800000, 6.75, 30, 736000, 210000, 0),
  ('$350k target home', 35000000, 2800000, 6.75, 30, 805000, 230000, 0),
  ('$380k stretch home', 38000000, 2800000, 6.75, 30, 874000, 250000, 0);

INSERT INTO payment_plan_entries (card_id, plan_month, payment_cents, principal_cents, interest_cents, ending_balance_cents, note) VALUES
  ((SELECT id FROM credit_cards WHERE name = 'Everyday Rewards Visa'), '2026-07', 90000, 77000, 13000, 538000, 'Score-focused payment to move the highest-utilization card down.'),
  ((SELECT id FROM credit_cards WHERE name = 'Store Financing Card'), '2026-07', 25000, 23000, 2000, 65000, 'High APR cleanup after required minimums.');

INSERT INTO spending_entries (category_id, amount_cents, spent_date, merchant, note) VALUES
  ((SELECT id FROM budget_categories WHERE name = 'Groceries'), 18450, '2026-07-03', 'Aldi', 'Weekly groceries'),
  ((SELECT id FROM budget_categories WHERE name = 'Groceries'), 22600, '2026-07-10', 'Costco', 'Pantry restock'),
  ((SELECT id FROM budget_categories WHERE name = 'Fuel and transportation'), 5100, '2026-07-06', 'Shell', 'Fuel'),
  ((SELECT id FROM budget_categories WHERE name = 'Household and personal'), 8900, '2026-07-12', 'Target', 'Household supplies');
