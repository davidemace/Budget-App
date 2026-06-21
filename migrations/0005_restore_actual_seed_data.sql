-- Restore David Mace's real planning seed values after the Phase 2 schema repair.
-- This maps the older real-data migration columns into the current schema.

DELETE FROM payment_plan_entries;
DELETE FROM spending_entries;
DELETE FROM bills;
DELETE FROM paychecks;
DELETE FROM mortgage_scenarios;
DELETE FROM savings_goals;
DELETE FROM credit_cards;
DELETE FROM budget_categories;

DELETE FROM sqlite_sequence
WHERE name IN (
  'payment_plan_entries',
  'spending_entries',
  'bills',
  'paychecks',
  'mortgage_scenarios',
  'savings_goals',
  'credit_cards',
  'budget_categories'
);

INSERT INTO budget_categories (name, category_type, monthly_budget_cents, monthly_actual_cents, sort_order) VALUES
  ('Housing', 'fixed', 165000, 0, 10),
  ('Utilities', 'fixed', 28000, 0, 20),
  ('Internet and phones', 'fixed', 19000, 0, 30),
  ('Groceries', 'variable', 72000, 69000, 40),
  ('Fuel and transportation', 'variable', 36000, 34000, 50),
  ('Household and personal', 'variable', 30000, 25000, 60),
  ('Debt minimums', 'debt', 254024, 0, 70),
  ('Down payment savings', 'savings', 125000, 0, 80),
  ('Emergency fund savings', 'savings', 35000, 0, 90);

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

INSERT INTO paychecks (name, pay_date, net_amount_cents, planned_bills_cents, planned_debt_cents, planned_savings_cents, notes) VALUES
  ('McGraw Hill paycheck - 15th', '2026-07-15', 230300, 140000, 86100, 0, 'Recurring McGraw Hill paycheck paid on the 15th. Update net amount if current post-raise net is different.'),
  ('McGraw Hill paycheck - last workday', '2026-07-31', 230300, 65000, 86100, 0, 'Recurring McGraw Hill paycheck paid on the last workday of the month.'),
  ('WISD paycheck', '2026-07-24', 240100, 0, 50000, 125000, 'Recurring WISD paycheck paid on the 24th.');

INSERT INTO bills (name, due_day, amount_cents, category_id, is_fixed) VALUES
  ('Estimated housing payment / rent', 1, 165000, (SELECT id FROM budget_categories WHERE name = 'Housing'), 1),
  ('Estimated electric and gas', 8, 18000, (SELECT id FROM budget_categories WHERE name = 'Utilities'), 1),
  ('Estimated water and trash', 12, 8500, (SELECT id FROM budget_categories WHERE name = 'Utilities'), 1),
  ('Estimated internet', 15, 8500, (SELECT id FROM budget_categories WHERE name = 'Internet and phones'), 1),
  ('Estimated mobile phones', 21, 10500, (SELECT id FROM budget_categories WHERE name = 'Internet and phones'), 1),
  ('Estimated car insurance', 24, 14500, (SELECT id FROM budget_categories WHERE name = 'Fuel and transportation'), 1),
  ('Wells Fargo Reflect minimum', 5, 29600, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('Apple Card minimum', 5, 17000, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('Capital One QuicksilverOne minimum', 5, 8800, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('Capital One Platinum minimum', 5, 7300, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('Chase Freedom Unlimited minimum', 5, 6000, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('Home Depot Consumer minimum', 5, 5700, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('My Best Buy minimum', 5, 4600, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('Zales minimum', 5, 4100, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('MyLowe''s Rewards minimum', 5, 3000, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('Wells Fargo Personal Loan', 15, 35237, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('401k Loan', 15, 27984, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('Capital One Auto Loan', 20, 66798, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1),
  ('City Bank Auto Loan', 20, 37905, (SELECT id FROM budget_categories WHERE name = 'Debt minimums'), 1);

INSERT INTO savings_goals (name, goal_type, target_cents, current_cents, monthly_contribution_cents, target_date, priority) VALUES
  ('Down payment fund', 'down_payment', 1500000, 0, 125000, '2027-06-21', 100),
  ('Emergency fund', 'emergency_fund', 1200000, 0, 35000, '2027-06-30', 90),
  ('Closing costs buffer', 'closing_costs', 900000, 0, 20000, '2027-06-21', 70);

INSERT INTO mortgage_scenarios (name, home_price_cents, down_payment_cents, interest_rate, term_years, annual_tax_cents, annual_insurance_cents, monthly_hoa_cents) VALUES
  ('$320k Waxahachie target - 3% down', 32000000, 960000, 6.75, 30, 736000, 210000, 0),
  ('$350k Waxahachie target - 3% down', 35000000, 1050000, 6.75, 30, 805000, 230000, 0),
  ('$380k Waxahachie stretch - 3% down', 38000000, 1140000, 6.75, 30, 874000, 250000, 0),
  ('$380k Waxahachie stretch - $15k down', 38000000, 1500000, 6.75, 30, 874000, 250000, 0);

INSERT INTO payment_plan_entries (card_id, plan_month, payment_cents, principal_cents, interest_cents, ending_balance_cents, note) VALUES
  ((SELECT id FROM credit_cards WHERE name = 'MyLowe''s Rewards'), '2026-07', 33457, 33457, 0, 0, 'Small-balance cleanup / highest APR card. Principal: $334.57. Estimated interest: $0. Ending balance: $0.'),
  ((SELECT id FROM credit_cards WHERE name = 'Home Depot Consumer'), '2026-07', 50000, 48000, 2000, 44315, 'Score-focused payment on a high-utilization retail card. Principal: $480. Estimated interest: $20. Ending balance: $443.15.'),
  ((SELECT id FROM credit_cards WHERE name = 'My Best Buy'), '2026-07', 50000, 48000, 2000, 46041, 'Score-focused payment on a high-utilization retail card. Principal: $480. Estimated interest: $20. Ending balance: $460.41.');

INSERT INTO spending_entries (category_id, amount_cents, spent_date, merchant, note) VALUES
  ((SELECT id FROM budget_categories WHERE name = 'Groceries'), 69000, '2026-07-01', 'Monthly actual estimate', 'Mapped from safe spending amount in the real seed data.'),
  ((SELECT id FROM budget_categories WHERE name = 'Fuel and transportation'), 34000, '2026-07-01', 'Monthly actual estimate', 'Mapped from safe spending amount in the real seed data.'),
  ((SELECT id FROM budget_categories WHERE name = 'Household and personal'), 25000, '2026-07-01', 'Monthly actual estimate', 'Mapped from safe spending amount in the real seed data.');
