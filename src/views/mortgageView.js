import { centsToDollars, pct } from '../services/money.js';
import { drawer, escapeHtml, modal, pageHeader, metricCard, progressBar, section, statusBadge } from './components.js';

export function renderMortgageView(model) {
  const editors = model.scenarios.map((scenario) => drawer(
    `<span>${escapeHtml(scenario.name)}</span><small>${centsToDollars(scenario.estimated_monthly_cents)} estimated monthly</small>`,
    scenarioForm(scenario)
  )).join('');
  return `${pageHeader('Mortgage Readiness', 'Track down payment, emergency fund, credit utilization, estimated DTI, and $320k to $380k scenarios.')}
    <div class="action-row toolbar-row">
      <a class="button-link" href="#modal-add-scenario">Add scenario</a>
      <a class="ghost-link" href="#manage-scenarios">Edit scenarios</a>
    </div>
    <div class="grid metrics">
      ${metricCard('Readiness', model.readiness.status, 'Needs Work, Getting Close, or Ready', model.readiness.status === 'Ready' ? 'good' : 'warn')}
      ${metricCard('Estimated DTI', pct(model.readiness.dti), 'Housing plus debt minimums')}
      ${metricCard('Down Payment', pct(model.goals.downPayment.progress), `${centsToDollars(model.goals.downPayment.current_cents)} saved`)}
      ${metricCard('Emergency Fund', pct(model.goals.emergency.progress), `${centsToDollars(model.goals.emergency.current_cents)} saved`)}
    </div>
    <div class="grid two">
      ${section('Readiness Checklist', `
        <div class="stack">
          <div><div class="split"><strong>Credit utilization</strong><span>${pct(model.cards.aggregateUtilizationPercent)}</span></div>${progressBar(100 - Math.min(100, model.cards.aggregateUtilizationPercent))}</div>
          <div><div class="split"><strong>Down payment goal</strong><span>${pct(model.goals.downPayment.progress)}</span></div>${progressBar(model.goals.downPayment.progress)}</div>
          <div><div class="split"><strong>Emergency fund goal</strong><span>${pct(model.goals.emergency.progress)}</span></div>${progressBar(model.goals.emergency.progress)}</div>
          <p>${statusBadge(model.readiness.status)}</p>
        </div>
      `)}
      ${section('Scenario Cards', `
        <div class="scenario-grid">
          ${model.scenarios.map((scenario) => `<article>
            <span>${escapeHtml(scenario.name)}</span>
            <strong>${centsToDollars(scenario.estimated_monthly_cents)}</strong>
            <small>${centsToDollars(scenario.home_price_cents)} home, ${pct(scenario.interest_rate)} rate, ${centsToDollars(scenario.down_payment_cents)} down</small>
          </article>`).join('')}
        </div>
      `)}
    </div>
    <details id="manage-scenarios" class="manage-panel">
      <summary>Manage mortgage scenarios</summary>
      ${section('Scenario Drawers', editors, 'editor-card drawer-list')}
    </details>
    ${modal('modal-add-scenario', 'Add Mortgage Scenario', scenarioForm())}`;
}

function scenarioForm(scenario = {}) {
  const id = scenario.id || '';
  const deleteButton = id ? `<button class="danger" type="submit" form="delete-scenario-${id}">Delete</button>` : '';
  return `<form method="post" class="form-grid compact">
    <input type="hidden" name="_action" value="save_scenario">
    <input type="hidden" name="id" value="${id}">
    <label>Name<input name="name" value="${escapeHtml(scenario.name || '')}" required></label>
    <label>Home price<input name="home_price" inputmode="decimal" value="${moneyInput(scenario.home_price_cents)}"></label>
    <label>Down payment<input name="down_payment" inputmode="decimal" value="${moneyInput(scenario.down_payment_cents)}"></label>
    <label>Rate<input name="interest_rate" inputmode="decimal" value="${scenario.interest_rate ?? ''}"></label>
    <label>Term<input name="term_years" inputmode="numeric" value="${scenario.term_years || 30}"></label>
    <label>Annual tax<input name="annual_tax" inputmode="decimal" value="${moneyInput(scenario.annual_tax_cents)}"></label>
    <label>Annual insurance<input name="annual_insurance" inputmode="decimal" value="${moneyInput(scenario.annual_insurance_cents)}"></label>
    <label>Monthly HOA<input name="monthly_hoa" inputmode="decimal" value="${moneyInput(scenario.monthly_hoa_cents)}"></label>
    <button type="submit">${id ? 'Save scenario' : 'Add scenario'}</button>
    ${deleteButton}
  </form>${id ? `<form id="delete-scenario-${id}" method="post"><input type="hidden" name="_action" value="delete_scenario"><input type="hidden" name="id" value="${id}"></form>` : ''}`;
}

function moneyInput(cents = 0) {
  return cents ? (Number(cents) / 100).toFixed(2) : '';
}
