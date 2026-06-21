import { all } from '../db.js';
import { buildBudgetModel, renderBudget } from '../views/budgetView.js';

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

async function loadBudgetData(env) {
  const [categories, bills, cards, goals] = await Promise.all([
    all(env, 'SELECT * FROM budget_categories ORDER BY sort_order, name'),
    all(env, 'SELECT * FROM bills WHERE is_active = 1 ORDER BY due_day, name'),
    all(env, 'SELECT * FROM credit_cards ORDER BY payoff_priority, name'),
    all(env, 'SELECT * FROM savings_goals ORDER BY goal_type, name')
  ]);
  return { categories, bills, cards, goals };
}
