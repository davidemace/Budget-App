INSERT INTO budget_categories (name, kind, monthly_amount_cents, safe_spending_cents, sort_order) VALUES
  ('Monthly take-home income', 'income', 720000, 0, 10),
  ('Mortgage readiness savings', 'savings', 90000, 0, 20),
  ('Emergency fund savings', 'savings', 40000, 0, 30),
  ('Groceries and household', 'variable', 72500, 65000, 40),
  ('Fuel and transportation', 'variable', 32500, 30000, 50),
  ('Dining and personal spending', 'variable', 42000, 35000, 60),
  ('Utilities', 'fixed', 31500, 0, 70),
  ('Phone and internet', 'fixed', 18500, 0, 80);

INSERT INTO credit_cards (name, balance_cents, credit_limit_cents, apr, minimum_payment_cents, payoff_priority) VALUES
  ('Rewards Visa', 585000, 800000, 24.99, 17500, 1),
  ('Cash Back Mastercard', 214000, 600000, 21.49, 8500, 2),
  ('Store Card', 98000, 250000, 29.99, 4500, 3);

INSERT INTO paychecks (label, pay_date, net_amount_cents, planned_bills_cents, planned_debt_cents, planned_savings_cents, notes) VALUES
  ('First June paycheck', '2026-06-05', 360000, 185000, 45000, 65000, 'Cover early-month fixed bills and keep cash buffer.'),
  ('Second June paycheck', '2026-06-19', 360000, 130000, 55000, 65000, 'Push extra card payment after groceries and fuel are reserved.');

INSERT INTO bills (name, due_day, amount_cents, category) VALUES
  ('Rent or housing reserve', 1, 185000, 'fixed'),
  ('Auto insurance', 8, 14500, 'fixed'),
  ('Utilities', 15, 31500, 'fixed'),
  ('Phone and internet', 20, 18500, 'fixed'),
  ('Student loan minimum', 25, 22500, 'debt');

INSERT INTO savings_goals (name, goal_type, target_cents, current_cents, monthly_target_cents, target_date) VALUES
  ('Down payment fund', 'down_payment', 2400000, 840000, 90000, '2027-12-31'),
  ('Emergency fund', 'emergency_fund', 1800000, 620000, 40000, '2027-06-30'),
  ('Closing costs buffer', 'closing_costs', 900000, 175000, 25000, '2027-12-31');

INSERT INTO mortgage_scenarios (name, home_price_cents, down_payment_cents, rate, term_years, annual_tax_cents, annual_insurance_cents, monthly_hoa_cents) VALUES
  ('$320k starter home', 32000000, 2400000, 6.75, 30, 768000, 240000, 0),
  ('$350k target home', 35000000, 2400000, 6.75, 30, 840000, 260000, 0),
  ('$380k stretch home', 38000000, 2400000, 6.75, 30, 912000, 285000, 0);

INSERT INTO payment_plan_entries (card_id, planned_month, payment_cents, note) VALUES
  (1, '2026-07', 45000, 'First utilization push toward 49%.'),
  (1, '2026-08', 50000, 'Keep attacking highest utilization.'),
  (3, '2026-07', 20000, 'Small extra after minimums.');
