import { getBills, getCreditCards, getPaychecks, getSavingsGoals, run } from '../db.js';
import { formCents, formString } from '../services/forms.js';
import { sumBy } from '../services/money.js';
import { allocatePaycheck } from '../services/paycheckAllocation.js';
import { renderPaycheckView } from '../views/paycheckView.js';

export async function paycheck({ request, env, api }) {
  if (request.method === 'POST') {
    await handlePaycheckPost(request, env);
    return { redirect: '/paycheck' };
  }

  const url = new URL(request.url);
  const [paychecks, bills, cards, goals] = await Promise.all([
    getPaychecks(env),
    getBills(env),
    getCreditCards(env),
    getSavingsGoals(env)
  ]);
  const amountCents = url.searchParams.has('amount') ? formLikeCents(url.searchParams.get('amount')) : paychecks[0]?.net_amount_cents || 0;
  const payDate = url.searchParams.get('pay_date') || paychecks[0]?.pay_date || new Date().toISOString().slice(0, 10);
  const nextPayDate = url.searchParams.get('next_pay_date') || '';
  const allocation = allocatePaycheck({
    amountCents,
    payDate,
    nextPayDate,
    bills,
    cards,
    goals,
    paychecks
  });

  const model = {
    paychecks,
    bills,
    allocation,
    monthlyIncomeCents: sumBy(paychecks, 'net_amount_cents'),
    plannedBillsCents: sumBy(paychecks, 'planned_bills_cents'),
    plannedDebtCents: sumBy(paychecks, 'planned_debt_cents'),
    plannedSavingsCents: sumBy(paychecks, 'planned_savings_cents')
  };

  if (api) return { data: model };
  return {
    title: 'Paycheck Planner',
    body: renderPaycheckView(model)
  };
}

async function handlePaycheckPost(request, env) {
  const form = await request.formData();
  const action = formString(form, '_action');

  if (action === 'save_paycheck') {
    await run(env, `INSERT INTO paychecks
      (name, pay_date, net_amount_cents, planned_bills_cents, planned_debt_cents, planned_savings_cents, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)`, [
      formString(form, 'name', 'Paycheck'),
      formString(form, 'pay_date'),
      formCents(form, 'net_amount'),
      formCents(form, 'planned_bills'),
      formCents(form, 'planned_debt'),
      formCents(form, 'planned_savings'),
      formString(form, 'notes')
    ]);
  }
}

function formLikeCents(value) {
  return Math.round((Number(String(value ?? '').replace(/[$,\s]/g, '')) || 0) * 100);
}
