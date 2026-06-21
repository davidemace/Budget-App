import { all } from '../db.js';
import { renderPaycheck } from '../views/paycheckView.js';

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

async function loadPaycheckData(env) {
  const [paychecks, bills] = await Promise.all([
    all(env, 'SELECT * FROM paychecks ORDER BY pay_date DESC'),
    all(env, 'SELECT * FROM bills WHERE is_active = 1 ORDER BY due_day, name')
  ]);
  return { paychecks, bills };
}
