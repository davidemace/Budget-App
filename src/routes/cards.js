import { all, first } from '../db.js';
import { enrichCards, interestFocusedRecommendation, scoreFocusedRecommendation } from '../services/recommendations.js';
import { renderCards } from '../views/cardsView.js';

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
