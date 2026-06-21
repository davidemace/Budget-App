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
  const totalAllocated = allocation.requiredBillsCents
    + allocation.creditCardPaymentCents
    + allocation.downPaymentSavingsCents
    + allocation.emergencySavingsCents
    + allocation.safeSpendingBufferCents;
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

  return `${pageHeader('Paycheck Allocation Console', 'Turn the next paycheck into a clear plan before the money lands.', 'Paycheck planner')}
    <section class="command-hero paycheck-command">
      <div>
        <span class="eyebrow">Paycheck window</span>
        <h2>${escapeHtml(allocation.payDate)} to ${escapeHtml(allocation.nextPayDate)}</h2>
        <strong>${centsToDollars(allocation.amountCents)}</strong>
        <p>${allocation.isShortCents
          ? `This paycheck is short by ${centsToDollars(allocation.isShortCents)} before discretionary buffer.`
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
    <div class="grid two">
      ${section('Allocation Engine', allocationCalculatorForm(allocation))}
      ${section('Recommended Allocation', `
        <div class="allocation-grid featured">
          <article><span>Bills and loans due</span><strong>${centsToDollars(allocation.requiredBillsCents)}</strong></article>
          <article><span>Card minimums + extra payoff</span><strong>${centsToDollars(allocation.creditCardPaymentCents)}</strong></article>
          <article><span>Down payment</span><strong>${centsToDollars(allocation.downPaymentSavingsCents)}</strong></article>
          <article><span>Emergency fund</span><strong>${centsToDollars(allocation.emergencySavingsCents)}</strong></article>
          <article><span>Safe spending buffer</span><strong>${centsToDollars(allocation.safeSpendingBufferCents)}</strong></article>
          <article><span>Shortfall</span><strong>${centsToDollars(allocation.isShortCents)}</strong></article>
        </div>
        <p>Card payment includes ${centsToDollars(allocation.cardMinimumsDueCents)} in card minimums due before the next paycheck plus ${centsToDollars(allocation.extraCardPaymentCents)} in extra payoff. ${allocation.priorityCard ? `Extra card dollars should go to ${escapeHtml(allocation.priorityCard.name)} first.` : 'Add cards to generate a debt-payment priority.'}</p>
      `)}
    </div>
    <div class="grid two">
      ${section('Bills And Loans Before Next Paycheck', table(['Bill', 'Due Date', 'Amount'], dueBillRows, 'No non-card bills due in this paycheck window.'), 'flush')}
      ${section('Card Minimums Before Next Paycheck', table(['Card Minimum', 'Due Date', 'Amount'], cardMinimumRows, 'No card minimums due in this paycheck window.'), 'flush')}
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

function moneyInput(cents = 0) {
  return cents ? (Number(cents) / 100).toFixed(2) : '';
}
