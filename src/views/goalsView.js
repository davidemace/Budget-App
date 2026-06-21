import { pageHeader, progressBar, moneyCell } from './components.js';
import { escapeHtml } from './layout.js';

export function renderGoals(goals) {
  return `${pageHeader('Savings goals', 'Fund the home-buying runway', 'Track down payment, emergency fund, closing costs, and other cash targets.')}
    <section class="goal-grid">${goals.map((goal) => `<article class="panel">
      <p class="eyebrow">${escapeHtml(goal.goal_type.replaceAll('_', ' '))}</p>
      <h2>${escapeHtml(goal.name)}</h2>
      <p>${moneyCell(goal.current_cents)} saved of ${moneyCell(goal.target_cents)}</p>
      ${progressBar(goal.current_cents, goal.target_cents)}
      <div class="mini-list single"><div><span>Monthly target</span><strong>${moneyCell(goal.monthly_target_cents)}</strong></div><div><span>Target date</span><strong>${escapeHtml(goal.target_date || 'Not set')}</strong></div></div>
    </article>`).join('')}</section>`;
}
