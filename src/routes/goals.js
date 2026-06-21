import { all, run } from '../db.js';
import { centsFromDollars } from '../services/money.js';
import { renderGoals } from '../views/goalsView.js';
import { redirectResponse } from '../views/layout.js';

export async function goalsApi({ env }) {
  return loadGoals(env);
}

export async function getGoals({ env }) {
  return {
    title: 'Goals',
    active: 'goals',
    body: renderGoals(await loadGoals(env))
  };
}

export async function createGoal({ request, env }) {
  const form = await request.formData();
  await run(env, `INSERT INTO savings_goals
    (name, goal_type, target_cents, current_cents, monthly_target_cents, target_date, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`, goalBindings(form));
  return redirectResponse('/goals');
}

export async function updateGoal({ request, env, params }) {
  const form = await request.formData();
  await run(env, `UPDATE savings_goals
    SET name = ?, goal_type = ?, target_cents = ?, current_cents = ?, monthly_target_cents = ?, target_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`, [...goalBindings(form), params.id]);
  return redirectResponse('/goals');
}

async function loadGoals(env) {
  return all(env, 'SELECT * FROM savings_goals ORDER BY goal_type, target_date, name');
}

function goalBindings(form) {
  return [
    String(form.get('name') || '').trim(),
    String(form.get('goal_type') || 'other'),
    centsFromDollars(form.get('target')),
    centsFromDollars(form.get('current')),
    centsFromDollars(form.get('monthly_target')),
    String(form.get('target_date') || '')
  ];
}
