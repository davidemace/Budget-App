import { centsToDollars, pct } from '../services/money.js';
import { drawer, escapeHtml, modal, pageHeader, progressBar, section, table } from './components.js';

export function renderGoalsView(model) {
  const rows = model.goals.map((goal) => `<tr>
    <td>${escapeHtml(goal.name)}</td>
    <td>${escapeHtml(goal.goal_type)}</td>
    <td>${centsToDollars(goal.current_cents)}</td>
    <td>${centsToDollars(goal.target_cents)}</td>
    <td>${pct(goal.progress)} ${progressBar(goal.progress)}</td>
    <td>${centsToDollars(goal.monthly_contribution_cents)}</td>
    <td>${escapeHtml(goal.target_date || '')}</td>
  </tr>`);
  const editors = model.goals.map((goal) => drawer(
    `<span>${escapeHtml(goal.name)}</span><small>${pct(goal.progress)} / ${centsToDollars(goal.monthly_contribution_cents)} monthly</small>`,
    goalForm(goal)
  )).join('');

  return `${pageHeader('Savings Goals', 'Track down payment, emergency fund, closing costs, and other home-buying milestones.')}
    <div class="action-row toolbar-row">
      <a class="button-link" href="#modal-add-goal">Add goal</a>
      <a class="ghost-link" href="#manage-goals">Edit goals</a>
    </div>
    ${table(['Goal', 'Type', 'Current', 'Target', 'Progress', 'Monthly', 'Target Date'], rows, 'No savings goals found.')}
    <details id="manage-goals" class="manage-panel">
      <summary>Manage savings goals</summary>
      ${section('Goal Drawers', editors || '<p>No goals yet.</p>', 'editor-card drawer-list')}
    </details>
    ${modal('modal-add-goal', 'Add Savings Goal', goalForm())}`;
}

function goalForm(goal = {}) {
  const id = goal.id || '';
  const deleteButton = id ? `<button class="danger" type="submit" form="delete-goal-${id}">Delete</button>` : '';
  return `<form method="post" class="form-grid compact">
    <input type="hidden" name="_action" value="save_goal">
    <input type="hidden" name="id" value="${id}">
    <label>Name<input name="name" value="${escapeHtml(goal.name || '')}" required></label>
    <label>Type<select name="goal_type">
      ${option('down_payment', goal.goal_type)}
      ${option('emergency_fund', goal.goal_type)}
      ${option('closing_costs', goal.goal_type)}
      ${option('other', goal.goal_type)}
    </select></label>
    <label>Current<input name="current" inputmode="decimal" value="${moneyInput(goal.current_cents)}"></label>
    <label>Target<input name="target" inputmode="decimal" value="${moneyInput(goal.target_cents)}"></label>
    <label>Monthly<input name="monthly_contribution" inputmode="decimal" value="${moneyInput(goal.monthly_contribution_cents)}"></label>
    <label>Target date<input name="target_date" type="date" value="${escapeHtml(goal.target_date || '')}"></label>
    <label>Priority<input name="priority" inputmode="numeric" value="${goal.priority || 0}"></label>
    <button type="submit">${id ? 'Save goal' : 'Add goal'}</button>
    ${deleteButton}
  </form>${id ? `<form id="delete-goal-${id}" method="post"><input type="hidden" name="_action" value="delete_goal"><input type="hidden" name="id" value="${id}"></form>` : ''}`;
}

function option(value, current) {
  return `<option value="${value}" ${value === current ? 'selected' : ''}>${value}</option>`;
}

function moneyInput(cents = 0) {
  return cents ? (Number(cents) / 100).toFixed(2) : '';
}
