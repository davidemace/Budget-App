import { centsToDollars, sumBy } from '../services/money.js';
import { enrichCards, readinessStatus } from '../services/recommendations.js';
import { pageHeader, progressBar, statCard } from './components.js';
import { buildMortgageModel } from './mortgageView.js';
import { escapeHtml } from './layout.js';

export function buildDashboardModel(data) {
  const income = sumBy(data.categories.filter((row) => row.kind === 'income'), 'monthly_amount_cents');
  const fixed = sumBy(data.bills, 'amount_cents');
  const debtMinimums = sumBy(data.cards, 'minimum_payment_cents');
  const savings = sumBy(data.goals, 'monthly_target_cents');
  const variable = sumBy(data.categories.filter((row) => row.kind === 'variable'), 'monthly_amount_cents');
  const remaining = income - fixed - debtMinimums - savings - variable;
  const cards = enrichCards(data.cards);
  const mortgage = buildMortgageModel(data);
  return { income, fixed, debtMinimums, savings, variable, remaining, cards, goals: data.goals, scenarios: mortgage.scenarios, readiness: mortgage.readiness };
}

export function renderDashboard(model) {
  const downPayment = model.goals.find((goal) => goal.goal_type === 'down_payment');
  const emergency = model.goals.find((goal) => goal.goal_type === 'emergency_fund');
  return `${pageHeader('Single-user planning dashboard', 'Budget today for the next home', 'Track cash flow, credit utilization, savings progress, and mortgage readiness in one focused workspace.')}
    <section class="stats-grid">
      ${statCard('Monthly income', centsToDollars(model.income), 'take-home estimate')}
      ${statCard('Remaining cash flow', centsToDollars(model.remaining), 'after bills, minimums, goals, and variable spending')}
      ${statCard('Debt minimums', centsToDollars(model.debtMinimums), 'credit-card minimums')}
      ${statCard('Readiness', model.readiness.status, `Estimated DTI ${model.readiness.dti.toFixed(1)}%`)}
    </section>
    <section class="two-column">
      <article class="panel">
        <h2>Home fund progress</h2>
        ${goalProgress(downPayment)}
        ${goalProgress(emergency)}
      </article>
      <article class="panel">
        <h2>Credit snapshot</h2>
        <div class="mini-list">${model.cards.map((card) => `<div><span>${escapeHtml(card.name)}</span><strong>${card.utilization.toFixed(1)}%</strong></div>`).join('')}</div>
      </article>
    </section>
    <section class="panel">
      <h2>Mortgage range</h2>
      <div class="scenario-row">${model.scenarios.map((scenario) => `<article><strong>${escapeHtml(scenario.name)}</strong><span>${centsToDollars(scenario.monthlyTotal)} / mo</span></article>`).join('')}</div>
    </section>`;
}

function goalProgress(goal) {
  if (!goal) return '';
  return `<div class="goal-line"><div><strong>${escapeHtml(goal.name)}</strong><span>${centsToDollars(goal.current_cents)} of ${centsToDollars(goal.target_cents)}</span></div>${progressBar(goal.current_cents, goal.target_cents)}</div>`;
}
