import { centsToDollars, inputDollars, percent } from '../services/money.js';
import { pageHeader, moneyCell } from './components.js';
import { escapeHtml } from './layout.js';

export function renderCards({ cards, scoreRecommendation, interestRecommendation }) {
  return `${pageHeader('Credit cards', 'Utilization optimizer', 'Prioritize payments for credit-score movement, mortgage readiness, and interest savings.')}
    <section class="two-column">
      ${recommendationCard('Score-focused', scoreRecommendation)}
      ${recommendationCard('Interest-focused', interestRecommendation)}
    </section>
    <section class="panel">
      <h2>Payment targets</h2>
      <div class="edit-list cards-edit">${cards.map(cardForm).join('')}</div>
    </section>
    <section class="panel">
      <h2>Add card</h2>
      ${cardForm({ id: '', name: '', balance_cents: 0, credit_limit_cents: 0, apr: 0, minimum_payment_cents: 0, payoff_priority: 100, utilization: 0, needed_49_cents: 0, needed_29_cents: 0, needed_9_cents: 0 }, true)}
    </section>`;
}

function recommendationCard(label, recommendation) {
  if (!recommendation) return `<article class="panel"><h2>${label}</h2><p>Add cards to calculate recommendations.</p></article>`;
  return `<article class="panel recommendation"><p class="eyebrow">${label}</p><h2>${escapeHtml(recommendation.card.name)}</h2><p>${escapeHtml(recommendation.message)}</p><small>${escapeHtml(recommendation.reason)} &middot; ${centsToDollars(recommendation.card.balance_cents)} balance</small></article>`;
}

function utilClass(utilization) {
  if (utilization > 89) return 'danger';
  if (utilization > 49) return 'warning';
  if (utilization > 29) return 'notice';
  return 'good';
}

function cardForm(card, isNew = false) {
  const action = isNew ? '/cards' : `/cards/${card.id}`;
  return `<form class="edit-card" method="post" action="${action}">
    <div class="field wide"><label>Card</label><input name="name" value="${escapeHtml(card.name)}" required></div>
    <div class="field"><label>Balance</label><input name="balance" inputmode="decimal" value="${inputDollars(card.balance_cents)}"></div>
    <div class="field"><label>Limit</label><input name="credit_limit" inputmode="decimal" value="${inputDollars(card.credit_limit_cents)}"></div>
    <div class="field"><label>APR</label><input name="apr" inputmode="decimal" value="${Number(card.apr || 0).toFixed(2)}"></div>
    <div class="field"><label>Minimum</label><input name="minimum_payment" inputmode="decimal" value="${inputDollars(card.minimum_payment_cents)}"></div>
    <div class="field"><label>Priority</label><input name="payoff_priority" type="number" value="${Number(card.payoff_priority || 0)}"></div>
    <div class="target-strip">
      <span><strong class="pill ${utilClass(card.utilization)}">${percent(card.utilization)}</strong> utilization</span>
      <span>49%: ${moneyCell(card.needed_49_cents)}</span>
      <span>29%: ${moneyCell(card.needed_29_cents)}</span>
      <span>9%: ${moneyCell(card.needed_9_cents)}</span>
    </div>
    <button type="submit">${isNew ? 'Add card' : 'Save'}</button>
  </form>`;
}
