import { all, run } from '../db.js';
import { centsFromDollars } from '../services/money.js';
import { buildBudgetModel, renderBudget } from '../views/budgetView.js';
import { redirectResponse } from '../views/layout.js';

export async function budgetApi({ env }) {
  return buildBudgetModel(await loadBudgetData(env));
}

export async function getBudget({ env }) {
  return {
    title: 'Budget',
    active: 'budget',
    body: renderBudget(buildBudgetModel(await loadBudgetData(env)))
  };
}

export async function createBudgetCategory({ request, env }) {
  const form = await request.formData();
  await run(env, `INSERT INTO budget_categories
    (name, kind, monthly_amount_cents, safe_spending_cents, sort_order, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`, categoryBindings(form));
  return redirectResponse('/budget');
}

export async function updateBudgetCategory({ request, env, params }) {
  const form = await request.formData();
  await run(env, `UPDATE budget_categories
    SET name = ?, kind = ?, monthly_amount_cents = ?, safe_spending_cents = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`, [...categoryBindings(form), params.id]);
  return redirectResponse('/budget');
}

export async function createBill({ request, env }) {
  const form = await request.formData();
  await run(env, `INSERT INTO bills
    (name, due_day, amount_cents, category, is_active, updated_at)
    VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`, billBindings(form));
  return redirectResponse('/budget');
}

export async function updateBill({ request, env, params }) {
  const form = await request.formData();
  await run(env, `UPDATE bills
    SET name = ?, due_day = ?, amount_cents = ?, category = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`, [...billBindings(form), form.get('is_active') ? 1 : 0, params.id]);
  return redirectResponse('/budget');
}

async function loadBudgetData(env) {
  const [categories, bills, cards, goals] = await Promise.all([
    all(env, 'SELECT * FROM budget_categories ORDER BY sort_order, name'),
    all(env, 'SELECT * FROM bills WHERE is_active = 1 ORDER BY due_day, name'),
    all(env, 'SELECT * FROM credit_cards ORDER BY payoff_priority, name'),
    all(env, 'SELECT * FROM savings_goals ORDER BY goal_type, name')
  ]);
  return { categories, bills, cards, goals };
}

function categoryBindings(form) {
  return [
    String(form.get('name') || '').trim(),
    String(form.get('kind') || 'variable'),
    centsFromDollars(form.get('monthly_amount')),
    centsFromDollars(form.get('safe_spending')),
    Number(form.get('sort_order') || 0)
  ];
}

function billBindings(form) {
  return [
    String(form.get('name') || '').trim(),
    Number(form.get('due_day') || 1),
    centsFromDollars(form.get('amount')),
    String(form.get('category') || 'fixed')
  ];
}
