import { buildDashboardModel } from './dashboard.js';
import { run } from '../db.js';
import { formCents, formNumber, formString } from '../services/forms.js';
import { renderMortgageView } from '../views/mortgageView.js';

export async function mortgage({ request, env, api }) {
  if (request.method === 'POST') {
    await handleMortgagePost(request, env);
    return { redirect: '/mortgage' };
  }

  const dashboard = await buildDashboardModel(env);
  const model = {
    budget: dashboard.budget,
    cards: dashboard.cards,
    goals: dashboard.goals,
    scenarios: dashboard.scenarios,
    readiness: dashboard.readiness
  };

  if (api) return { data: model };
  return {
    title: 'Mortgage',
    body: renderMortgageView(model)
  };
}

async function handleMortgagePost(request, env) {
  const form = await request.formData();
  const action = formString(form, '_action');

  if (action === 'save_scenario') {
    const id = formString(form, 'id');
    const values = [
      formString(form, 'name'),
      formCents(form, 'home_price'),
      formCents(form, 'down_payment'),
      formNumber(form, 'interest_rate'),
      formNumber(form, 'term_years', 30),
      formCents(form, 'annual_tax'),
      formCents(form, 'annual_insurance'),
      formCents(form, 'monthly_hoa')
    ];
    if (id) {
      await run(env, `UPDATE mortgage_scenarios
        SET name = ?, home_price_cents = ?, down_payment_cents = ?, interest_rate = ?, term_years = ?, annual_tax_cents = ?, annual_insurance_cents = ?, monthly_hoa_cents = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`, [...values, id]);
    } else {
      await run(env, `INSERT INTO mortgage_scenarios
        (name, home_price_cents, down_payment_cents, interest_rate, term_years, annual_tax_cents, annual_insurance_cents, monthly_hoa_cents)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, values);
    }
  }

  if (action === 'delete_scenario') {
    await run(env, 'DELETE FROM mortgage_scenarios WHERE id = ?', [formString(form, 'id')]);
  }
}
