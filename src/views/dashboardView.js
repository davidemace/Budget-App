import { centsToDollars, pct } from '../services/money.js';
import { pageHeader, metricCard, progressBar, section, statusBadge } from './components.js';

export function renderDashboardView(model) {
  const down = model.goals.downPayment;
  const emergency = model.goals.emergency;
  const move = model.recommendations.nextBestMove;

  return `${pageHeader('Mortgage Readiness Dashboard', 'Monthly cash flow, card utilization, savings progress, and purchase scenarios for the $320k to $380k range.', 'Single-user planning')}
    <div class="grid metrics">
      ${metricCard('Monthly Income', centsToDollars(model.budget.monthlyIncomeCents), 'Net planned income')}
      ${metricCard('Remaining Cash Flow', centsToDollars(model.budget.remainingCashFlowCents), 'After bills, minimums, and goals', model.budget.remainingCashFlowCents >= 0 ? 'good' : 'warn')}
      ${metricCard('Card Utilization', pct(model.cards.aggregateUtilizationPercent), 'Goal: under 29%', model.cards.aggregateUtilizationPercent <= 29 ? 'good' : 'warn')}
      ${metricCard('Readiness', model.readiness.status, `Estimated DTI: ${pct(model.readiness.dti)}`, model.readiness.status === 'Ready' ? 'good' : 'warn')}
    </div>

    <div class="grid two">
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
      ${section('Next Best Move', `
        <div class="next-move">
          <span>${move.title}</span>
          <strong>${move.amountCents ? centsToDollars(move.amountCents) : 'Review balances'}</strong>
          <p>${move.why}</p>
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
