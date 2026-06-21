export async function all(env, sql, bindings = []) {
  return (await env.DB.prepare(sql).bind(...bindings).all()).results || [];
}

export async function first(env, sql, bindings = []) {
  return await env.DB.prepare(sql).bind(...bindings).first();
}

export async function run(env, sql, bindings = []) {
  return await env.DB.prepare(sql).bind(...bindings).run();
}

export async function getCreditCards(env) {
  return all(env, 'SELECT * FROM credit_cards ORDER BY payoff_priority DESC, balance_cents DESC, name');
}

export async function getCreditCard(env, id) {
  return first(env, 'SELECT * FROM credit_cards WHERE id = ?', [id]);
}

export async function getBudgetCategories(env) {
  return all(env, `SELECT budget_categories.*,
      COALESCE(SUM(spending_entries.amount_cents), 0) AS actual_spending_cents
    FROM budget_categories
    LEFT JOIN spending_entries ON spending_entries.category_id = budget_categories.id
    GROUP BY budget_categories.id
    ORDER BY budget_categories.sort_order, budget_categories.name`);
}

export async function getBills(env) {
  return all(env, `SELECT bills.*, budget_categories.name AS category_name
    FROM bills
    LEFT JOIN budget_categories ON budget_categories.id = bills.category_id
    ORDER BY bills.due_day, bills.name`);
}

export async function getPaychecks(env) {
  return all(env, 'SELECT * FROM paychecks ORDER BY pay_date');
}

export async function getSavingsGoals(env) {
  return all(env, 'SELECT * FROM savings_goals ORDER BY priority DESC, target_date, name');
}

export async function getMortgageScenarios(env) {
  return all(env, 'SELECT * FROM mortgage_scenarios ORDER BY home_price_cents');
}

export async function getPaymentPlanEntries(env) {
  return all(env, `SELECT payment_plan_entries.*, credit_cards.name AS card_name
    FROM payment_plan_entries
    LEFT JOIN credit_cards ON credit_cards.id = payment_plan_entries.card_id
    ORDER BY payment_plan_entries.plan_month, payment_plan_entries.id`);
}

export async function getSpendingEntries(env) {
  return all(env, `SELECT spending_entries.*, budget_categories.name AS category_name
    FROM spending_entries
    LEFT JOIN budget_categories ON budget_categories.id = spending_entries.category_id
    ORDER BY spending_entries.spent_date DESC, spending_entries.id DESC`);
}
