import { pageHeader, progressBar, moneyCell } from './components.js';
import { inputDollars } from '../services/money.js';
import { escapeHtml } from './layout.js';

export function renderGoals(goals) {
  return `${pageHeader('Savings goals', 'Fund the home-buying runway', 'Track down payment, emergency fund, closing costs, and other cash targets.')}
    <section class="goal-grid">${goals.map((goal) => `<article class="panel">
      <p class="eyebrow">${escapeHtml(goal.goal_type.replaceAll('_', ' '))}</p>
      <h2>${escapeHtml(goal.name)}</h2>
      <p>${moneyCell(goal.current_cents)} saved of ${moneyCell(goal.target_cents)}</p>
      ${progressBar(goal.current_cents, goal.target_cents)}
      <div class="mini-list single"><div><span>Monthly target</span><strong>${moneyCell(goal.monthly_target_cents)}</strong></div><div><span>Target date</span><strong>${escapeHtml(goal.target_date || 'Not set')}</strong></div></div>
      ${goalForm(goal)}
    </article>`).join('')}</section>
    <section class="panel"><h2>Add goal</h2>${goalForm({ id: '', name: '', goal_type: 'other', target_cents: 0, current_cents: 0, monthly_target_cents: 0, target_date: '' }, true)}</section>`;
}

function goalForm(goal, isNew = false) {
  return `<form class="edit-row goal-row" method="post" action="${isNew ? '/goals' : `/goals/${goal.id}`}">
    <div class="field wide"><label>Name</label><input name="name" value="${escapeHtml(goal.name)}" required></div>
    <div class="field"><label>Type</label><select name="goal_type">${['down_payment', 'emergency_fund', 'closing_costs', 'other'].map((type) => `<option value="${type}" ${type === goal.goal_type ? 'selected' : ''}>${type.replaceAll('_', ' ')}</option>`).join('')}</select></div>
    <div class="field"><label>Target</label><input name="target" inputmode="decimal" value="${inputDollars(goal.target_cents)}"></div>
    <div class="field"><label>Current</label><input name="current" inputmode="decimal" value="${inputDollars(goal.current_cents)}"></div>
    <div class="field"><label>Monthly</label><input name="monthly_target" inputmode="decimal" value="${inputDollars(goal.monthly_target_cents)}"></div>
    <div class="field"><label>Date</label><input name="target_date" type="date" value="${escapeHtml(goal.target_date || '')}"></div>
    <button type="submit">${isNew ? 'Add goal' : 'Save'}</button>
  </form>`;
}
