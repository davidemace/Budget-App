import { all, run } from '../db.js';
import { centsFromDollars } from '../services/money.js';
import { renderPaycheck } from '../views/paycheckView.js';
import { redirectResponse } from '../views/layout.js';

export async function paycheckApi({ env }) {
  return loadPaycheckData(env);
}

export async function getPaycheck({ env }) {
  return {
    title: 'Paycheck Planner',
    active: 'paycheck',
    body: renderPaycheck(await loadPaycheckData(env))
  };
}

export async function createPaycheck({ request, env }) {
  const form = await request.formData();
  await run(env, `INSERT INTO paychecks
    (label, pay_date, net_amount_cents, planned_bills_cents, planned_debt_cents, planned_savings_cents, notes, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`, paycheckBindings(form));
  return redirectResponse('/paycheck');
}

export async function updatePaycheck({ request, env, params }) {
  const form = await request.formData();
  await run(env, `UPDATE paychecks
    SET label = ?, pay_date = ?, net_amount_cents = ?, planned_bills_cents = ?, planned_debt_cents = ?, planned_savings_cents = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`, [...paycheckBindings(form), params.id]);
  return redirectResponse('/paycheck');
}

async function loadPaycheckData(env) {
  const [paychecks, bills] = await Promise.all([
    all(env, 'SELECT * FROM paychecks ORDER BY pay_date DESC'),
    all(env, 'SELECT * FROM bills WHERE is_active = 1 ORDER BY due_day, name')
  ]);
  return { paychecks, bills };
}

function paycheckBindings(form) {
  return [
    String(form.get('label') || '').trim(),
    String(form.get('pay_date') || ''),
    centsFromDollars(form.get('net_amount')),
    centsFromDollars(form.get('planned_bills')),
    centsFromDollars(form.get('planned_debt')),
    centsFromDollars(form.get('planned_savings')),
    String(form.get('notes') || '').trim()
  ];
}
