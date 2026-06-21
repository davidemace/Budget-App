import { all } from '../db.js';
import { buildDashboardModel } from '../views/dashboardView.js';
import { renderDashboard } from '../views/dashboardView.js';

export async function dashboardApi({ env }) {
  return buildDashboardModel(await loadDashboardData(env));
}

export async function getDashboard({ env }) {
  return {
    title: 'Dashboard',
    active: 'dashboard',
    body: renderDashboard(buildDashboardModel(await loadDashboardData(env)))
  };
}

async function loadDashboardData(env) {
  const [categories, cards, goals, scenarios, bills] = await Promise.all([
    all(env, 'SELECT * FROM budget_categories ORDER BY sort_order, name'),
    all(env, 'SELECT * FROM credit_cards ORDER BY payoff_priority, name'),
    all(env, 'SELECT * FROM savings_goals ORDER BY goal_type, name'),
    all(env, 'SELECT * FROM mortgage_scenarios ORDER BY home_price_cents'),
    all(env, 'SELECT * FROM bills WHERE is_active = 1 ORDER BY due_day, name')
  ]);
  return { categories, cards, goals, scenarios, bills };
}
