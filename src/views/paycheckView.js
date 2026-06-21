import { centsToDollars } from '../services/money.js';
import { escapeHtml, pageHeader, metricCard, section, table } from './components.js';

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
  const dueBillRows = allocation.dueBills.map((bill) => `<tr>
    <td>${escapeHtml(bill.name)}</td>
    <td>${escapeHtml(bill.due_date)}</td>
    <td>${centsToDollars(bill.amount_cents)}</td>
  </tr>`);

  return `${pageHeader('Paycheck Planner', 'Map each paycheck to bills, card payoff, home savings, and cash buffer.')}
    <div class="grid metrics">
      ${metricCard('Monthly Paychecks', centsToDollars(model.monthlyIncomeCents), 'Planned net income')}
      ${metricCard('Bills Allocation', centsToDollars(model.plannedBillsCents), 'From paycheck plans')}
      ${metricCard('Debt Allocation', centsToDollars(model.plannedDebtCents), 'Extra payoff plus minimums')}
      ${metricCard('Savings Allocation', centsToDollars(model.plannedSavingsCents), 'Down payment and emergency fund')}
    </div>
    <div class="grid two">
      ${section('Allocation Engine', allocationForm(allocation))}
      ${section('Recommended Allocation', `
        <div class="allocation-grid">
          <article><span>Bills due</span><strong>${centsToDollars(allocation.requiredBillsCents)}</strong></article>
          <article><span>Credit card payment</span><strong>${centsToDollars(allocation.creditCardPaymentCents)}</strong></article>
          <article><span>Down payment</span><strong>${centsToDollars(allocation.downPaymentSavingsCents)}</strong></article>
          <article><span>Emergency fund</span><strong>${centsToDollars(allocation.emergencySavingsCents)}</strong></article>
          <article><span>Safe spending buffer</span><strong>${centsToDollars(allocation.safeSpendingBufferCents)}</strong></article>
          <article><span>Shortfall</span><strong>${centsToDollars(allocation.isShortCents)}</strong></article>
        </div>
        <p>${allocation.priorityCard ? `Extra card dollars should go to ${escapeHtml(allocation.priorityCard.name)} first.` : 'Add cards to generate a debt-payment priority.'}</p>
      `)}
    </div>
    ${section('Bills Before Next Paycheck', table(['Bill', 'Due Date', 'Amount'], dueBillRows, 'No bills due in this paycheck window.'), 'flush')}
    ${section('Paycheck Plan', table(['Name', 'Date', 'Net', 'Bills', 'Debt', 'Savings'], rows, 'No paychecks found.'), 'flush')}`;
}

function allocationForm(allocation) {
  return `<form method="get" class="form-grid">
    <label>Paycheck amount<input name="amount" inputmode="decimal" value="${moneyInput(allocation.amountCents)}" required></label>
    <label>Pay date<input name="pay_date" type="date" value="${escapeHtml(allocation.payDate)}" required></label>
    <label>Next pay date<input name="next_pay_date" type="date" value="${escapeHtml(allocation.nextPayDate)}"></label>
    <button type="submit">Calculate Allocation</button>
  </form>
  <form method="post" class="form-grid compact">
    <input type="hidden" name="_action" value="save_paycheck">
    <label>Name<input name="name" value="Paycheck"></label>
    <label>Date<input name="pay_date" type="date" value="${escapeHtml(allocation.payDate)}"></label>
    <label>Net<input name="net_amount" inputmode="decimal" value="${moneyInput(allocation.amountCents)}"></label>
    <label>Bills<input name="planned_bills" inputmode="decimal" value="${moneyInput(allocation.requiredBillsCents)}"></label>
    <label>Debt<input name="planned_debt" inputmode="decimal" value="${moneyInput(allocation.creditCardPaymentCents)}"></label>
    <label>Savings<input name="planned_savings" inputmode="decimal" value="${moneyInput(allocation.downPaymentSavingsCents + allocation.emergencySavingsCents)}"></label>
    <label class="full">Notes<input name="notes" value="Generated from allocation engine"></label>
    <button type="submit">Save Paycheck Plan</button>
  </form>`;
}

function moneyInput(cents = 0) {
  return cents ? (Number(cents) / 100).toFixed(2) : '';
}
