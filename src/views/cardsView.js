import { centsToDollars, percent } from '../services/money.js';
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
      <table>
        <thead><tr><th>Card</th><th>Balance</th><th>Limit</th><th>APR</th><th>Minimum</th><th>Utilization</th><th>To 49%</th><th>To 29%</th><th>To 9%</th></tr></thead>
        <tbody>${cards.map((card) => `<tr>
          <td>${escapeHtml(card.name)}</td>
          <td>${moneyCell(card.balance_cents)}</td>
          <td>${moneyCell(card.credit_limit_cents)}</td>
          <td>${percent(card.apr, 2)}</td>
          <td>${moneyCell(card.minimum_payment_cents)}</td>
          <td><span class="pill ${utilClass(card.utilization)}">${percent(card.utilization)}</span></td>
          <td>${moneyCell(card.needed_49_cents)}</td>
          <td>${moneyCell(card.needed_29_cents)}</td>
          <td>${moneyCell(card.needed_9_cents)}</td>
        </tr>`).join('')}</tbody>
      </table>
    </section>`;
}

function recommendationCard(label, recommendation) {
  if (!recommendation) return `<article class="panel"><h2>${label}</h2><p>Add cards to calculate recommendations.</p></article>`;
  return `<article class="panel recommendation"><p class="eyebrow">${label}</p><h2>${escapeHtml(recommendation.card.name)}</h2><p>${escapeHtml(recommendation.message)}</p><small>${escapeHtml(recommendation.reason)} · ${centsToDollars(recommendation.card.balance_cents)} balance</small></article>`;
}

function utilClass(utilization) {
  if (utilization > 89) return 'danger';
  if (utilization > 49) return 'warning';
  if (utilization > 29) return 'notice';
  return 'good';
}
