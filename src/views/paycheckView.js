import { centsToDollars } from '../services/money.js';
import { escapeHtml, modal, pageHeader, metricCard, section, table } from './components.js';

export function renderPaycheckView(model) {
  const rows = model.paychecks.map((paycheck) => `<tr>
    <td>${escapeHtml(paycheck.name)}</td>
    <td>${escapeHtml(paycheck.pay_date)}</td>
    <td>${centsToDollars(paycheck.net_amount_cents)}</td>
    <td>${centsToDollars(paycheck.planned_bills_cents)}</td>
    <td>${centsToDollars(paycheck.planned_debt_cents)}</td>
    <td>${centsToDollars(paycheck.planned_savings_cents)}</td>
  </tr>`);

  const allocation = model.allocation;
  const totalAllocated = allocation.totalAllocatedCents;
  const dueBillRows = allocation.dueBills.map((bill) => `<tr>
    <td>${escapeHtml(bill.name)}</td>
    <td>${escapeHtml(bill.due_date)}</td>
    <td>${centsToDollars(bill.amount_cents)}</td>
  </tr>`);
  const cardMinimumRows = allocation.cardMinimumBillsDue.map((bill) => `<tr>
    <td>${escapeHtml(bill.name)}</td>
    <td>${escapeHtml(bill.due_date)}</td>
    <td>${centsToDollars(bill.amount_cents)}</td>
  </tr>`);
  const scheduleRows = model.paycheckSchedule.slice(0, 8).map((paycheck) => `<tr>
    <td><a href="/paycheck?amount=${moneyInput(paycheck.net_amount_cents)}&pay_date=${escapeHtml(paycheck.pay_date)}">${escapeHtml(paycheck.name)}</a></td>
    <td>${escapeHtml(paycheck.pay_date)}</td>
    <td>${centsToDollars(paycheck.net_amount_cents)}</td>
  </tr>`);
  const spendingRows = allocation.spendingEnvelopes.map((envelope) => `<tr>
    <td>${escapeHtml(envelope.name)}</td>
    <td>${centsToDollars(envelope.monthly_budget_cents)}</td>
    <td>${centsToDollars(envelope.amount_cents)}</td>
    <td>${centsToDollars(Math.max(0, envelope.monthly_budget_cents - envelope.actual_spending_cents))}</td>
  </tr>`);
  const forecastRows = model.forecast.windows.map((window) => {
    const savingsCents = window.allocation.downPaymentSavingsCents + window.allocation.emergencySavingsCents;
    return `<tr>
      <td><a href="/paycheck?amount=${moneyInput(window.allocation.amountCents)}&pay_date=${escapeHtml(window.payDate)}">${escapeHtml(window.source)}</a><br><small>${escapeHtml(window.payDate)} to ${escapeHtml(window.nextPayDate)}</small></td>
      <td>${centsToDollars(window.allocation.amountCents)}</td>
      <td>${centsToDollars(window.allocation.requiredBillsTargetCents)}</td>
      <td>${centsToDollars(window.allocation.cardMinimumsTargetCents)}</td>
      <td>${centsToDollars(window.allocation.spendingEnvelopesTargetCents)}</td>
      <td>${centsToDollars(savingsCents)}</td>
      <td>${centsToDollars(window.allocation.extraCardPaymentCents)}</td>
      <td>${centsToDollars(window.allocation.unfundedPlanCents)}</td>
    </tr>`;
  });
  const monthRows = model.forecast.months.map((month) => {
    const coreOutflowCents = month.requiredBillsCents + month.cardMinimumsCents + month.spendingEnvelopesCents + month.savingsCents;
    return `<tr>
      <td>${escapeHtml(month.month)}</td>
      <td>${centsToDollars(month.incomeCents)}</td>
      <td>${centsToDollars(coreOutflowCents)}</td>
      <td>${formatSignedDollars(month.corePlanMarginCents)}</td>
      <td>${centsToDollars(month.extraCardPaymentCents)}</td>
      <td>${centsToDollars(month.bufferCents)}</td>
      <td>${centsToDollars(month.unfundedPlanCents)}</td>
    </tr>`;
  });

  return `${pageHeader('Paycheck Allocation Console', 'Turn the next paycheck into a clear plan before the money lands.', 'Paycheck planner')}
    <section class="command-hero paycheck-command">
      <div>
        <span class="eyebrow">Paycheck window</span>
        <h2>${escapeHtml(allocation.payDate)} to ${escapeHtml(allocation.nextPayDate)}</h2>
        <strong>${centsToDollars(allocation.amountCents)}</strong>
        <p>${allocation.isShortCents
          ? `${centsToDollars(allocation.isShortCents)} of the ideal plan needs to move, shrink, or wait for another paycheck.`
          : `${centsToDollars(Math.max(0, allocation.amountCents - totalAllocated))} remains unassigned after recommended buckets.`}</p>
        <div class="action-row">
          <a class="button-link" href="#modal-save-paycheck">Save this plan</a>
          <a class="ghost-link" href="#saved-paycheck-plans">View saved plans</a>
        </div>
      </div>
      <div class="allocation-summary">
        <span>Recommended split</span>
        <div class="allocation-bar">
          ${barSegment('Bills', allocation.requiredBillsCents, allocation.amountCents)}
          ${barSegment('Cards', allocation.creditCardPaymentCents, allocation.amountCents)}
          ${barSegment('Spending', allocation.spendingEnvelopesCents, allocation.amountCents)}
          ${barSegment('Savings', allocation.downPaymentSavingsCents + allocation.emergencySavingsCents, allocation.amountCents)}
          ${barSegment('Buffer', allocation.safeSpendingBufferCents, allocation.amountCents)}
        </div>
        <small>${allocation.priorityCard ? `Extra debt dollars target ${escapeHtml(allocation.priorityCard.name)}.` : 'Add cards to generate a payoff target.'}</small>
      </div>
    </section>

    <div class="grid metrics">
      ${metricCard('Monthly Paychecks', centsToDollars(model.monthlyIncomeCents), 'Planned net income')}
      ${metricCard('Bills Allocation', centsToDollars(model.plannedBillsCents), 'From paycheck plans')}
      ${metricCard('Debt Allocation', centsToDollars(model.plannedDebtCents), 'Extra payoff plus minimums')}
      ${metricCard('Savings Allocation', centsToDollars(model.plannedSavingsCents), 'Down payment and emergency fund')}
    </div>

    <div class="paycheck-board">
      ${section('Paycheck Dollar Plan', `
        <div class="allocation-ledger">
          ${ledgerRow('Bills and loans due', allocation.requiredBillsCents)}
          ${ledgerRow('Card minimums due', allocation.cardMinimumsDueCents)}
          ${ledgerRow('Known spending envelopes', allocation.spendingEnvelopesCents)}
          ${ledgerRow('Down payment savings', allocation.downPaymentSavingsCents)}
          ${ledgerRow('Emergency fund savings', allocation.emergencySavingsCents)}
          ${ledgerRow('Extra card payoff', allocation.extraCardPaymentCents)}
          ${ledgerRow('Safe spending buffer', allocation.safeSpendingBufferCents)}
          ${ledgerRow('Still unassigned', Math.max(0, allocation.remainingCents), 'muted')}
          ${ledgerRow('Unfunded ideal plan', allocation.unfundedPlanCents, allocation.unfundedPlanCents ? 'danger' : 'muted')}
        </div>
      `)}
      ${section('Planning Inputs', allocationCalculatorForm(allocation))}
    </div>

    <div class="grid two">
      ${section('Upcoming Paychecks', table(['Source', 'Pay Date', 'Net'], scheduleRows, 'No recurring paychecks found.'), 'flush')}
      ${section('Recommended Allocation', `
        <div class="allocation-grid featured">
          <article><span>Bills and loans due</span><strong>${centsToDollars(allocation.requiredBillsCents)}</strong></article>
          <article><span>Card minimums + extra payoff</span><strong>${centsToDollars(allocation.creditCardPaymentCents)}</strong></article>
          <article><span>Known spending</span><strong>${centsToDollars(allocation.spendingEnvelopesCents)}</strong></article>
          <article><span>Down payment</span><strong>${centsToDollars(allocation.downPaymentSavingsCents)}</strong></article>
          <article><span>Emergency fund</span><strong>${centsToDollars(allocation.emergencySavingsCents)}</strong></article>
          <article><span>Safe spending buffer</span><strong>${centsToDollars(allocation.safeSpendingBufferCents)}</strong></article>
          <article><span>Unfunded ideal plan</span><strong>${centsToDollars(allocation.unfundedPlanCents)}</strong></article>
        </div>
        <p>This plan allocates exactly ${centsToDollars(allocation.totalAllocatedCents)} of this paycheck. Card payment includes ${centsToDollars(allocation.cardMinimumsDueCents)} toward card minimums due before the next paycheck plus ${centsToDollars(allocation.extraCardPaymentCents)} in extra payoff. ${allocation.priorityCard ? `Extra card dollars should go to ${escapeHtml(allocation.priorityCard.name)} first.` : 'Add cards to generate a debt-payment priority.'}</p>
      `)}
    </div>
    ${section('Paycheck Forecast', table(['Source / Window', 'Income', 'Bills', 'Card Mins', 'Spending', 'Savings', 'Extra Payoff', 'Unfunded'], forecastRows, 'No forecast windows available.'), 'flush')}
    ${section('Monthly Forecast', table(['Month', 'Income', 'Known Outflow', 'Margin', 'Extra Payoff', 'Buffer', 'Unfunded'], monthRows, 'No monthly forecast available.'), 'flush')}
    <div class="grid two">
      ${section('Bills And Loans Before Next Paycheck', table(['Bill', 'Due Date', 'Amount'], dueBillRows, 'No non-card bills due in this paycheck window.'), 'flush')}
      ${section('Card Minimums Before Next Paycheck', table(['Card Minimum', 'Due Date', 'Amount'], cardMinimumRows, 'No card minimums due in this paycheck window.'), 'flush')}
      ${section('Known Spending Before Next Paycheck', table(['Envelope', 'Monthly Plan', 'This Paycheck', 'Monthly Remaining'], spendingRows, 'No variable spending envelopes found.'), 'flush')}
    </div>
    <details id="saved-paycheck-plans" class="manage-panel">
      <summary>Saved paycheck plans</summary>
      ${section('Paycheck Plan', table(['Name', 'Date', 'Net', 'Bills', 'Debt', 'Savings'], rows, 'No paychecks found.'), 'flush')}
    </details>
    ${modal('modal-save-paycheck', 'Save Paycheck Plan', savePaycheckForm(allocation))}`;
}

function allocationCalculatorForm(allocation) {
  return `<form method="get" class="form-grid">
    <label>Paycheck amount<input name="amount" inputmode="decimal" value="${moneyInput(allocation.amountCents)}" required></label>
    <label>Pay date<input name="pay_date" type="date" value="${escapeHtml(allocation.payDate)}" required></label>
    <label>Next pay date<input name="next_pay_date" type="date" value="${escapeHtml(allocation.nextPayDate)}"></label>
    <button type="submit">Calculate Allocation</button>
  </form>`;
}

function savePaycheckForm(allocation) {
  return `<form method="post" class="form-grid">
    <input type="hidden" name="_action" value="save_paycheck">
    <label>Name<input name="name" value="Paycheck"></label>
    <label>Date<input name="pay_date" type="date" value="${escapeHtml(allocation.payDate)}"></label>
    <label>Net<input name="net_amount" inputmode="decimal" value="${moneyInput(allocation.amountCents)}"></label>
    <label>Bills and loans<input name="planned_bills" inputmode="decimal" value="${moneyInput(allocation.requiredBillsCents)}"></label>
    <label>Card payment<input name="planned_debt" inputmode="decimal" value="${moneyInput(allocation.creditCardPaymentCents)}"></label>
    <label>Savings<input name="planned_savings" inputmode="decimal" value="${moneyInput(allocation.downPaymentSavingsCents + allocation.emergencySavingsCents)}"></label>
    <label class="full">Notes<input name="notes" value="Generated from allocation engine"></label>
    <button type="submit">Save Paycheck Plan</button>
  </form>`;
}

function barSegment(label, amountCents, totalCents) {
  const percent = totalCents > 0 ? Math.max(3, (amountCents / totalCents) * 100) : 0;
  return amountCents > 0 ? `<span style="width:${percent.toFixed(1)}%" title="${label}"></span>` : '';
}

function ledgerRow(label, amountCents, tone = '') {
  return `<div class="${escapeHtml(tone)}">
    <span>${escapeHtml(label)}</span>
    <strong>${centsToDollars(amountCents)}</strong>
  </div>`;
}

function formatSignedDollars(cents = 0) {
  return cents < 0 ? `-${centsToDollars(Math.abs(cents))}` : centsToDollars(cents);
}

function moneyInput(cents = 0) {
  return cents ? (Number(cents) / 100).toFixed(2) : '';
}
