import { centsToDollars, pct } from '../services/money.js';
import { escapeHtml, pageHeader, metricCard, section, table } from './components.js';

export function renderCardsView(model) {
  const rows = model.cards.map((card) => `<tr>
    <td>${escapeHtml(card.name)}</td>
    <td>${centsToDollars(card.balance_cents)}</td>
    <td>${centsToDollars(card.credit_limit_cents)}</td>
    <td>${pct(card.utilization_percent)}</td>
    <td>${centsToDollars(card.needed_to_49_cents)}</td>
    <td>${centsToDollars(card.needed_to_29_cents)}</td>
    <td>${centsToDollars(card.needed_to_9_cents)}</td>
    <td>${pct(card.apr)}</td>
    <td>${centsToDollars(card.minimum_payment_cents)}</td>
  </tr>`);

  const editors = model.cards.map((card) => cardEditor(card)).join('');
  const simulator = renderSimulation(model);

  return `${pageHeader('Credit Utilization Optimizer', 'Prioritize payments for credit score impact, mortgage readiness, and interest savings.')}
    <div class="grid metrics">
      ${metricCard('Total Balance', centsToDollars(model.recommendations.totalBalanceCents), 'All cards')}
      ${metricCard('Total Limit', centsToDollars(model.recommendations.totalLimitCents), 'Reported limits')}
      ${metricCard('Aggregate Utilization', pct(model.recommendations.aggregateUtilizationPercent), 'Goal: under 29%', model.recommendations.aggregateUtilizationPercent <= 29 ? 'good' : 'warn')}
      ${metricCard('Score Priority', model.scoreCardName, 'Highest-impact next card')}
    </div>
    <div class="grid two">
      ${section('Score-focused recommendation', `<p>${escapeHtml(model.scoreText)}</p>`)}
      ${section('Interest-focused recommendation', `<p>${escapeHtml(model.interestText)}</p>`)}
    </div>
    <div class="grid two">
      ${section('Payment Simulator', simulator)}
      ${section('Add Credit Card', cardEditor())}
    </div>
    ${table(['Card', 'Balance', 'Limit', 'Utilization', 'To 49%', 'To 29%', 'To 9%', 'APR', 'Minimum'], rows, 'No credit cards found.')}
    ${section('Edit Cards', editors || '<p>No cards yet.</p>', 'editor-card')}`;
}

function renderSimulation(model) {
  const options = model.cards.map((card) => `<option value="${card.id}" ${model.simulation?.cardId === card.id ? 'selected' : ''}>${escapeHtml(card.name)}</option>`).join('');
  const result = model.simulation ? `<div class="simulation-result">
    <strong>${escapeHtml(model.simulation.cardName)}</strong>
    <p>New balance: ${centsToDollars(model.simulation.newBalanceCents)}</p>
    <p>New utilization: ${pct(model.simulation.newUtilization)}</p>
    <p>${model.simulation.crossedThresholds.length
      ? `Crosses: ${model.simulation.crossedThresholds.map((threshold) => `${threshold}%`).join(', ')}`
      : 'No utilization threshold crossed yet.'}</p>
    <form method="post" class="form-grid compact">
      <input type="hidden" name="_action" value="record_payment">
      <input type="hidden" name="id" value="${model.simulation.cardId}">
      <input type="hidden" name="payment" value="${moneyInput(model.simulation.paymentCents)}">
      <label>Month<input name="plan_month" value="${new Date().toISOString().slice(0, 7)}"></label>
      <label class="full">Note<input name="note" value="Recorded from payment simulator"></label>
      <button type="submit">Record Payment</button>
    </form>
  </div>` : '<p>Enter a payment amount to preview the new balance and utilization threshold impact.</p>';

  return `<form method="get" class="form-grid">
    <label>Card<select name="simulate_card_id" required>${options}</select></label>
    <label>Payment<input name="payment" inputmode="decimal" placeholder="250.00" required></label>
    <button type="submit">Simulate Payment</button>
  </form>${result}`;
}

function cardEditor(card = {}) {
  const id = card.id || '';
  const deleteButton = id ? `<button class="danger" type="submit" form="delete-card-${id}">Delete</button>` : '';
  return `<form method="post" class="form-grid compact">
    <input type="hidden" name="_action" value="save_card">
    <input type="hidden" name="id" value="${id}">
    <label>Name<input name="name" value="${escapeHtml(card.name || '')}" required></label>
    <label>Balance<input name="balance" inputmode="decimal" value="${moneyInput(card.balance_cents)}"></label>
    <label>Limit<input name="credit_limit" inputmode="decimal" value="${moneyInput(card.credit_limit_cents)}"></label>
    <label>APR<input name="apr" inputmode="decimal" value="${card.apr ?? ''}"></label>
    <label>Minimum<input name="minimum_payment" inputmode="decimal" value="${moneyInput(card.minimum_payment_cents)}"></label>
    <label>Priority<input name="payoff_priority" inputmode="numeric" value="${card.payoff_priority || 0}"></label>
    <button type="submit">${id ? 'Save card' : 'Add card'}</button>
    ${deleteButton}
  </form>${id ? `<form id="delete-card-${id}" method="post"><input type="hidden" name="_action" value="delete_card"><input type="hidden" name="id" value="${id}"></form>` : ''}`;
}

function moneyInput(cents = 0) {
  return cents ? (Number(cents) / 100).toFixed(2) : '';
}
