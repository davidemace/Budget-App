import { all, run } from '../db.js';
import { centsFromDollars } from '../services/money.js';
import { buildMortgageModel, renderMortgage } from '../views/mortgageView.js';
import { redirectResponse } from '../views/layout.js';

export async function mortgageApi({ env }) {
  return buildMortgageModel(await loadMortgageData(env));
}

export async function getMortgage({ env }) {
  return {
    title: 'Mortgage Readiness',
    active: 'mortgage',
    body: renderMortgage(buildMortgageModel(await loadMortgageData(env)))
  };
}

export async function createMortgageScenario({ request, env }) {
  const form = await request.formData();
  await run(env, `INSERT INTO mortgage_scenarios
    (name, home_price_cents, down_payment_cents, rate, term_years, annual_tax_cents, annual_insurance_cents, monthly_hoa_cents, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`, scenarioBindings(form));
  return redirectResponse('/mortgage');
}

export async function updateMortgageScenario({ request, env, params }) {
  const form = await request.formData();
  await run(env, `UPDATE mortgage_scenarios
    SET name = ?, home_price_cents = ?, down_payment_cents = ?, rate = ?, term_years = ?, annual_tax_cents = ?, annual_insurance_cents = ?, monthly_hoa_cents = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`, [...scenarioBindings(form), params.id]);
  return redirectResponse('/mortgage');
}

async function loadMortgageData(env) {
  const [categories, cards, goals, scenarios] = await Promise.all([
    all(env, 'SELECT * FROM budget_categories ORDER BY sort_order, name'),
    all(env, 'SELECT * FROM credit_cards ORDER BY payoff_priority, name'),
    all(env, 'SELECT * FROM savings_goals ORDER BY goal_type, name'),
    all(env, 'SELECT * FROM mortgage_scenarios ORDER BY home_price_cents')
  ]);
  return { categories, cards, goals, scenarios };
}

function scenarioBindings(form) {
  return [
    String(form.get('name') || '').trim(),
    centsFromDollars(form.get('home_price')),
    centsFromDollars(form.get('down_payment')),
    Number(form.get('rate') || 0),
    Number(form.get('term_years') || 30),
    centsFromDollars(form.get('annual_tax')),
    centsFromDollars(form.get('annual_insurance')),
    centsFromDollars(form.get('monthly_hoa'))
  ];
}
