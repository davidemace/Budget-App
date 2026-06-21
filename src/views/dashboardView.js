import { centsToDollars, pct } from '../services/money.js';
import { pageHeader, metricCard, progressBar, section, statusBadge } from './components.js';

export function renderDashboardView(model) {
  const down = model.goals.downPayment;
  const emergency = model.goals.emergency;
  const move = model.recommendations.nextBestMove;
  const scoreCard = model.recommendations.score;
  const monthlyGap = model.budget.remainingCashFlowCents;

  return `${pageHeader('Financial Command Center', 'A daily operating view for cash flow, credit score moves, home savings, and mortgage readiness.', 'Today')}
    <section class="command-hero">
      <div>
        <span class="eyebrow">Next best move</span>
        <h2>${move.title}</h2>
        <strong>${move.amountCents ? centsToDollars(move.amountCents) : 'Update balances'}</strong>
        <p>${move.why}</p>
        <div class="action-row">
          <a class="button-link" href="/cards">Work the card plan</a>
          <a class="ghost-link" href="/paycheck">Allocate next paycheck</a>
        </div>
      </div>
      <div class="readiness-dial ${model.readiness.status.toLowerCase().replaceAll(' ', '-')}">
        <span>Readiness</span>
        <strong>${model.readiness.status}</strong>
        <small>DTI ${pct(model.readiness.dti)} / Utilization ${pct(model.cards.aggregateUtilizationPercent)}</small>
      </div>
    </section>

    <div class="grid metrics">
      ${metricCard('Monthly Income', centsToDollars(model.budget.monthlyIncomeCents), 'Net planned income')}
      ${metricCard('Remaining Cash Flow', centsToDollars(model.budget.remainingCashFlowCents), 'After bills, minimums, and goals', model.budget.remainingCashFlowCents >= 0 ? 'good' : 'warn')}
      ${metricCard('Card Utilization', pct(model.cards.aggregateUtilizationPercent), 'Goal: under 29%', model.cards.aggregateUtilizationPercent <= 29 ? 'good' : 'warn')}
      ${metricCard('Readiness', model.readiness.status, `Estimated DTI: ${pct(model.readiness.dti)}`, model.readiness.status === 'Ready' ? 'good' : 'warn')}
    </div>

    <div class="grid three">
      ${section('What to do today', `
        <div class="task-list">
          <article>
            <span>1</span>
            <div><strong>${scoreCard ? `Pay ${scoreCard.name}` : 'Add card balances'}</strong><p>${model.recommendations.scoreText}</p></div>
          </article>
          <article>
            <span>2</span>
            <div><strong>${monthlyGap >= 0 ? 'Protect cash flow' : 'Close the budget gap'}</strong><p>${monthlyGap >= 0 ? `${centsToDollars(monthlyGap)} remains after planned obligations.` : `${centsToDollars(Math.abs(monthlyGap))} needs to be trimmed or funded.`}</p></div>
          </article>
          <article>
            <span>3</span>
            <div><strong>Keep the home fund moving</strong><p>Down payment is ${pct(down.progress)} and emergency fund is ${pct(emergency.progress)}.</p></div>
          </article>
        </div>
      `)}
      ${section('Home Buyer Progress', `
        <div class="stack">
          <div>
            <div class="split"><strong>Down payment</strong><span>${pct(down.progress)}</span></div>
            ${progressBar(down.progress)}
            <p>${centsToDollars(down.current_cents)} saved of ${centsToDollars(down.target_cents)}</p>
          </div>
          <div>
            <div class="split"><strong>Emergency fund</strong><span>${pct(emergency.progress)}</span></div>
            ${progressBar(emergency.progress)}
            <p>${centsToDollars(emergency.current_cents)} saved of ${centsToDollars(emergency.target_cents)}</p>
          </div>
        </div>
      `)}
      ${section('Recommendation Modes', `
        <ul class="clean-list">
          <li><strong>Score-focused:</strong> ${model.recommendations.scoreText}</li>
          <li><strong>Interest-focused:</strong> ${model.recommendations.interestText}</li>
          <li><strong>Readiness status:</strong> ${statusBadge(model.readiness.status)}</li>
        </ul>
      `)}
    </div>

    ${section('Mortgage Scenario Snapshot', `
      <div class="scenario-grid">
        ${model.scenarios.map((scenario) => `<article>
          <span>${centsToDollars(scenario.home_price_cents)}</span>
          <strong>${centsToDollars(scenario.estimated_monthly_cents)}</strong>
          <small>${pct(scenario.interest_rate)} rate with ${centsToDollars(scenario.down_payment_cents)} down</small>
        </article>`).join('')}
      </div>
    `)}`;
}
