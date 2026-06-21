import { centsToDollars, pct } from '../services/money.js';
import { escapeHtml, pageHeader, metricCard, section, table } from './components.js';

export function renderCardsView(model) {
  const priority = model.recommendations.score;
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
  const cardTiles = model.cards.map((card) => cardTile(card)).join('');

  return `${pageHeader('Credit Command Desk', 'Make the next payment decision by score impact, interest cost, and mortgage readiness.', 'Credit cards')}
    <section class="command-hero card-command">
      <div>
        <span class="eyebrow">Score-first target</span>
        <h2>${priority ? priority.name : 'Add a card to start'}</h2>
        <strong>${priority?.needed_to_next_threshold_cents ? centsToDollars(priority.needed_to_next_threshold_cents) : 'No threshold payment needed'}</strong>
        <p>${escapeHtml(model.scoreText)}</p>
      </div>
      <div class="threshold-stack">
        <span>Threshold ladder</span>
        <div><b>89%</b><small>Emergency score optics</small></div>
        <div><b>49%</b><small>High utilization cleanup</small></div>
        <div><b>29%</b><small>Mortgage-ready target</small></div>
        <div><b>9%</b><small>Excellent utilization</small></div>
      </div>
    </section>

    <div class="grid metrics">
      ${metricCard('Total Balance', centsToDollars(model.recommendations.totalBalanceCents), 'All cards')}
      ${metricCard('Total Limit', centsToDollars(model.recommendations.totalLimitCents), 'Reported limits')}
      ${metricCard('Aggregate Utilization', pct(model.recommendations.aggregateUtilizationPercent), 'Goal: under 29%', model.recommendations.aggregateUtilizationPercent <= 29 ? 'good' : 'warn')}
      ${metricCard('Score Priority', model.scoreCardName, 'Highest-impact next card')}
    </div>

    <div class="card-rail">${cardTiles || '<p>No cards yet.</p>'}</div>

    <div class="grid two">
      ${section('Payment Simulator', simulator)}
      ${section('Why this matters', `
        <div class="insight-list">
          <p><strong>Score-focused:</strong> ${escapeHtml(model.scoreText)}</p>
          <p><strong>Interest-focused:</strong> ${escapeHtml(model.interestText)}</p>
          <p>Use simulation before recording a payment so the page can show whether the payment crosses 89%, 49%, 29%, or 9%.</p>
        </div>
      `)}
    </div>
    ${section('Card Details', table(['Card', 'Balance', 'Limit', 'Utilization', 'To 49%', 'To 29%', 'To 9%', 'APR', 'Minimum'], rows, 'No credit cards found.'), 'flush')}
    <details class="manage-panel">
      <summary>Manage credit cards</summary>
      <div class="grid two">
        ${section('Add Credit Card', cardEditor())}
        ${section('Edit Cards', editors || '<p>No cards yet.</p>', 'editor-card')}
      </div>
    </details>`;
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

function cardTile(card) {
  const tone = card.utilization_percent > 89 ? 'danger' : card.utilization_percent > 49 ? 'warn' : card.utilization_percent > 29 ? 'notice' : 'good';
  return `<article class="card-tile ${tone}">
    <div class="split"><strong>${escapeHtml(card.name)}</strong><span>${pct(card.utilization_percent)}</span></div>
    <div class="mini-meter"><span style="width:${Math.min(100, card.utilization_percent).toFixed(1)}%"></span></div>
    <dl>
      <div><dt>Balance</dt><dd>${centsToDollars(card.balance_cents)}</dd></div>
      <div><dt>Limit</dt><dd>${centsToDollars(card.credit_limit_cents)}</dd></div>
      <div><dt>Next threshold</dt><dd>${card.next_threshold_percent ? `${centsToDollars(card.needed_to_next_threshold_cents)} to ${card.next_threshold_percent}%` : 'Below 9%'}</dd></div>
    </dl>
  </article>`;
}

function moneyInput(cents = 0) {
  return cents ? (Number(cents) / 100).toFixed(2) : '';
}
