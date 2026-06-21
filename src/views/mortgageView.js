import { centsToDollars, inputDollars, monthlyMortgagePayment, sumBy } from '../services/money.js';
import { enrichCards, readinessStatus } from '../services/recommendations.js';
import { pageHeader, progressBar, statCard } from './components.js';
import { escapeHtml } from './layout.js';

export function buildMortgageModel({ categories = [], cards = [], goals = [], scenarios = [] }) {
  const income = sumBy(categories.filter((row) => row.kind === 'income'), 'monthly_amount_cents');
  const debtMinimums = sumBy(cards, 'minimum_payment_cents');
  const enrichedCards = enrichCards(cards);
  const maxUtilization = enrichedCards.reduce((max, card) => Math.max(max, card.utilization), 0);
  const downPayment = goals.find((goal) => goal.goal_type === 'down_payment') || {};
  const emergency = goals.find((goal) => goal.goal_type === 'emergency_fund') || {};
  const modeledScenarios = scenarios.map((scenario) => {
    const principal = Math.max(0, scenario.home_price_cents - scenario.down_payment_cents);
    const principalInterest = monthlyMortgagePayment(principal, scenario.rate, scenario.term_years);
    const monthlyTax = Math.round(Number(scenario.annual_tax_cents || 0) / 12);
    const monthlyInsurance = Math.round(Number(scenario.annual_insurance_cents || 0) / 12);
    const monthlyTotal = principalInterest + monthlyTax + monthlyInsurance + Number(scenario.monthly_hoa_cents || 0);
    return { ...scenario, principal, principalInterest, monthlyTax, monthlyInsurance, monthlyTotal };
  });
  const targetScenario = modeledScenarios.find((item) => item.home_price_cents === 35000000) || modeledScenarios[0] || { monthlyTotal: 0 };
  const dti = income > 0 ? ((debtMinimums + targetScenario.monthlyTotal) / income) * 100 : 0;
  const downPaymentProgress = progress(downPayment);
  const emergencyProgress = progress(emergency);
  return {
    income,
    debtMinimums,
    cards: enrichedCards,
    scenarios: modeledScenarios,
    downPayment,
    emergency,
    readiness: {
      status: readinessStatus({ downPaymentProgress, emergencyProgress, maxUtilization, dti }),
      downPaymentProgress,
      emergencyProgress,
      maxUtilization,
      dti
    }
  };
}

export function renderMortgage(model) {
  return `${pageHeader('Mortgage readiness', 'Home purchase planning from $320k to $380k', 'Track down payment, emergency reserves, utilization, DTI, and realistic monthly payment scenarios.')}
    <section class="stats-grid">
      ${statCard('Readiness status', model.readiness.status)}
      ${statCard('Estimated DTI', `${model.readiness.dti.toFixed(1)}%`, 'using $350k target scenario')}
      ${statCard('Max card utilization', `${model.readiness.maxUtilization.toFixed(1)}%`)}
      ${statCard('Debt minimums', centsToDollars(model.debtMinimums))}
    </section>
    <section class="two-column">
      <article class="panel"><h2>Down payment</h2>${goalBlock(model.downPayment)}</article>
      <article class="panel"><h2>Emergency fund</h2>${goalBlock(model.emergency)}</article>
    </section>
    <section class="panel">
      <h2>Mortgage scenarios</h2>
      <div class="scenario-grid">${model.scenarios.map((scenario) => `<article class="scenario-card">
        <p class="eyebrow">${escapeHtml(scenario.name)}</p>
        <h3>${centsToDollars(scenario.monthlyTotal)} / mo</h3>
        <dl><div><dt>Home price</dt><dd>${centsToDollars(scenario.home_price_cents)}</dd></div><div><dt>Down payment</dt><dd>${centsToDollars(scenario.down_payment_cents)}</dd></div><div><dt>Rate</dt><dd>${Number(scenario.rate).toFixed(2)}%</dd></div><div><dt>Principal + interest</dt><dd>${centsToDollars(scenario.principalInterest)}</dd></div></dl>
        ${scenarioForm(scenario)}
      </article>`).join('')}</div>
    </section>
    <section class="panel"><h2>Add scenario</h2>${scenarioForm({ id: '', name: '', home_price_cents: 0, down_payment_cents: 0, rate: 6.75, term_years: 30, annual_tax_cents: 0, annual_insurance_cents: 0, monthly_hoa_cents: 0 }, true)}</section>`;
}

function goalBlock(goal = {}) {
  if (!goal.name) return '<p>No goal configured.</p>';
  return `<strong>${escapeHtml(goal.name)}</strong><p>${centsToDollars(goal.current_cents)} saved of ${centsToDollars(goal.target_cents)}</p>${progressBar(goal.current_cents, goal.target_cents)}`;
}

function progress(goal = {}) {
  return goal.target_cents > 0 ? Math.min(100, (goal.current_cents / goal.target_cents) * 100) : 0;
}

function scenarioForm(scenario, isNew = false) {
  return `<form class="edit-row scenario-form" method="post" action="${isNew ? '/mortgage' : `/mortgage/${scenario.id}`}">
    <div class="field wide"><label>Name</label><input name="name" value="${escapeHtml(scenario.name)}" required></div>
    <div class="field"><label>Price</label><input name="home_price" inputmode="decimal" value="${inputDollars(scenario.home_price_cents)}"></div>
    <div class="field"><label>Down</label><input name="down_payment" inputmode="decimal" value="${inputDollars(scenario.down_payment_cents)}"></div>
    <div class="field"><label>Rate</label><input name="rate" inputmode="decimal" value="${Number(scenario.rate || 0).toFixed(2)}"></div>
    <div class="field"><label>Years</label><input name="term_years" type="number" value="${Number(scenario.term_years || 30)}"></div>
    <div class="field"><label>Annual tax</label><input name="annual_tax" inputmode="decimal" value="${inputDollars(scenario.annual_tax_cents)}"></div>
    <div class="field"><label>Annual ins.</label><input name="annual_insurance" inputmode="decimal" value="${inputDollars(scenario.annual_insurance_cents)}"></div>
    <div class="field"><label>HOA/mo</label><input name="monthly_hoa" inputmode="decimal" value="${inputDollars(scenario.monthly_hoa_cents)}"></div>
    <button type="submit">${isNew ? 'Add scenario' : 'Save'}</button>
  </form>`;
}
