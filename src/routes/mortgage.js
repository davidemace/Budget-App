import { all } from '../db.js';
import { buildMortgageModel, renderMortgage } from '../views/mortgageView.js';

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

async function loadMortgageData(env) {
  const [categories, cards, goals, scenarios] = await Promise.all([
    all(env, 'SELECT * FROM budget_categories ORDER BY sort_order, name'),
    all(env, 'SELECT * FROM credit_cards ORDER BY payoff_priority, name'),
    all(env, 'SELECT * FROM savings_goals ORDER BY goal_type, name'),
    all(env, 'SELECT * FROM mortgage_scenarios ORDER BY home_price_cents')
  ]);
  return { categories, cards, goals, scenarios };
}
