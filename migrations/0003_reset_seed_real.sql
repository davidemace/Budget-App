-- Replace the starter seed data with David Mace's known real planning values as of June 2026.
-- The source file used slightly different column names, so this migration maps it to the current D1 schema.

DELETE FROM payment_plan_entries;
DELETE FROM bills;
DELETE FROM paychecks;
DELETE FROM mortgage_scenarios;
DELETE FROM savings_goals;
DELETE FROM credit_cards;
DELETE FROM budget_categories;

DELETE FROM sqlite_sequence
WHERE name IN (
  'payment_plan_entries',
  'bills',
  'paychecks',
  'mortgage_scenarios',
  'savings_goals',
  'credit_cards',
  'budget_categories'
);

INSERT INTO budget_categories (name, kind, monthly_amount_cents, safe_spending_cents, sort_order) VALUES
  ('Housing', 'fixed', 165000, 0, 10),
  ('Utilities', 'fixed', 28000, 0, 20),
  ('Internet and phones', 'fixed', 19000, 0, 30),
  ('Groceries', 'variable', 72000, 69000, 40),
  ('Fuel and transportation', 'variable', 36000, 34000, 50),
  ('Household and personal', 'variable', 30000, 25000, 60),
  ('Debt minimums', 'debt', 254024, 0, 70),
  ('Down payment savings', 'savings', 125000, 0, 80),
  ('Emergency fund savings', 'savings', 35000, 0, 90),
  ('Monthly take-home income', 'income', 700700, 0, 100);

INSERT INTO credit_cards (name, balance_cents, credit_limit_cents, apr, minimum_payment_cents, payoff_priority) VALUES
  ('Wells Fargo Reflect', 908012, 1005000, 25.00, 29600, 55),
  ('Apple Card', 532300, 625000, 26.24, 17000, 60),
  ('Capital One QuicksilverOne', 268393, 555000, 26.40, 8800, 70),
  ('Capital One Platinum', 219815, 500000, 28.40, 7300, 75),
  ('Chase Freedom Unlimited', 168700, 200000, 29.00, 6000, 80),
  ('Home Depot Consumer', 92315, 190000, 29.00, 5700, 95),
  ('My Best Buy', 94041, 200000, 29.00, 4600, 90),
  ('Zales', 89317, 320000, 29.00, 4100, 85),
  ('MyLowe''s Rewards', 33457, 160000, 31.99, 3000, 100),
  ('Rooms To Go', 0, 1000000, 0.00, 0, 10);

INSERT INTO paychecks (label, pay_date, net_amount_cents, planned_bills_cents, planned_debt_cents, planned_savings_cents, notes) VALUES
  ('McGraw Hill paycheck - first half', '2026-07-15', 230300, 140000, 86100, 0, 'Known historical net paycheck amount used for planning; update if current post-raise net is different.'),
  ('McGraw Hill paycheck - second half', '2026-07-31', 230300, 65000, 86100, 0, 'Known historical net paycheck amount used for planning; update if current post-raise net is different.'),
  ('Additional monthly check', '2026-07-31', 240100, 0, 50000, 125000, 'Monthly additional check earmarked for debt payoff and down payment savings.');

INSERT INTO bills (name, due_day, amount_cents, category) VALUES
  ('Housing payment / rent placeholder', 1, 165000, 'fixed'),
  ('Electric and gas placeholder', 8, 18000, 'fixed'),
  ('Water and trash placeholder', 12, 8500, 'fixed'),
  ('Internet placeholder', 15, 8500, 'fixed'),
  ('Mobile phones placeholder', 21, 10500, 'fixed'),
  ('Car insurance placeholder', 24, 14500, 'fixed'),
  ('Wells Fargo Reflect minimum', 5, 29600, 'debt'),
  ('Apple Card minimum', 5, 17000, 'debt'),
  ('Capital One QuicksilverOne minimum', 5, 8800, 'debt'),
  ('Capital One Platinum minimum', 5, 7300, 'debt'),
  ('Chase Freedom Unlimited minimum', 5, 6000, 'debt'),
  ('Home Depot Consumer minimum', 5, 5700, 'debt'),
  ('My Best Buy minimum', 5, 4600, 'debt'),
  ('Zales minimum', 5, 4100, 'debt'),
  ('MyLowe''s Rewards minimum', 5, 3000, 'debt'),
  ('Wells Fargo Personal Loan', 15, 35237, 'debt'),
  ('401k Loan', 15, 27984, 'debt'),
  ('Capital One Auto Loan', 20, 66798, 'debt'),
  ('City Bank Auto Loan', 20, 37905, 'debt');

INSERT INTO savings_goals (name, goal_type, target_cents, current_cents, monthly_target_cents, target_date) VALUES
  ('Down payment fund', 'down_payment', 1500000, 0, 125000, '2027-06-21'),
  ('Emergency fund', 'emergency_fund', 1200000, 0, 35000, '2027-06-30'),
  ('Closing costs buffer', 'closing_costs', 900000, 0, 20000, '2027-06-21');

INSERT INTO mortgage_scenarios (name, home_price_cents, down_payment_cents, rate, term_years, annual_tax_cents, annual_insurance_cents, monthly_hoa_cents) VALUES
  ('$320k Waxahachie target - 3% down', 32000000, 960000, 6.75, 30, 736000, 210000, 0),
  ('$350k Waxahachie target - 3% down', 35000000, 1050000, 6.75, 30, 805000, 230000, 0),
  ('$380k Waxahachie stretch - 3% down', 38000000, 1140000, 6.75, 30, 874000, 250000, 0),
  ('$380k Waxahachie stretch - $15k down', 38000000, 1500000, 6.75, 30, 874000, 250000, 0);

INSERT INTO payment_plan_entries (card_id, planned_month, payment_cents, note) VALUES
  ((SELECT id FROM credit_cards WHERE name = 'MyLowe''s Rewards'), '2026-07', 33457, 'Small-balance cleanup / highest APR card. Principal: $334.57. Estimated interest: $0. Ending balance: $0.'),
  ((SELECT id FROM credit_cards WHERE name = 'Home Depot Consumer'), '2026-07', 50000, 'Score-focused payment on a high-utilization retail card. Principal: $480. Estimated interest: $20. Ending balance: $443.15.'),
  ((SELECT id FROM credit_cards WHERE name = 'My Best Buy'), '2026-07', 50000, 'Score-focused payment on a high-utilization retail card. Principal: $480. Estimated interest: $20. Ending balance: $460.41.');
