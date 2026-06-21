import { all, first, run } from '../db.js';
import { centsFromDollars } from '../services/money.js';
import { enrichCards, interestFocusedRecommendation, scoreFocusedRecommendation } from '../services/recommendations.js';
import { renderCards } from '../views/cardsView.js';
import { redirectResponse } from '../views/layout.js';

export async function cardsApi({ env, params }) {
  if (params.id) {
    const card = await first(env, 'SELECT * FROM credit_cards WHERE id = ?', [params.id]);
    if (!card) return { error: 'Card not found' };
    return enrichCards([card])[0];
  }
  const cards = await loadCards(env);
  return buildCardsModel(cards);
}

export async function getCards({ env }) {
  return {
    title: 'Credit Cards',
    active: 'cards',
    body: renderCards(buildCardsModel(await loadCards(env)))
  };
}

export async function createCard({ request, env }) {
  const form = await request.formData();
  await run(env, `INSERT INTO credit_cards
    (name, balance_cents, credit_limit_cents, apr, minimum_payment_cents, payoff_priority, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`, cardBindings(form));
  return redirectResponse('/cards');
}

export async function updateCard({ request, env, params }) {
  const form = await request.formData();
  await run(env, `UPDATE credit_cards
    SET name = ?, balance_cents = ?, credit_limit_cents = ?, apr = ?, minimum_payment_cents = ?, payoff_priority = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`, [...cardBindings(form), params.id]);
  return redirectResponse('/cards');
}

async function loadCards(env) {
  return all(env, 'SELECT * FROM credit_cards ORDER BY payoff_priority, name');
}

function buildCardsModel(cards) {
  const enriched = enrichCards(cards);
  return {
    cards: enriched,
    scoreRecommendation: scoreFocusedRecommendation(cards),
    interestRecommendation: interestFocusedRecommendation(cards)
  };
}

function cardBindings(form) {
  return [
    String(form.get('name') || '').trim(),
    centsFromDollars(form.get('balance')),
    centsFromDollars(form.get('credit_limit')),
    Number(form.get('apr') || 0),
    centsFromDollars(form.get('minimum_payment')),
    Number(form.get('payoff_priority') || 0)
  ];
}
