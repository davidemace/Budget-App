import { centsToDollars, inputDollars } from '../services/money.js';
import { pageHeader, moneyCell, statCard } from './components.js';
import { escapeHtml } from './layout.js';

export function renderPaycheck({ paychecks, bills }) {
  const next = paychecks[0];
  const leftover = next ? next.net_amount_cents - next.planned_bills_cents - next.planned_debt_cents - next.planned_savings_cents : 0;
  return `${pageHeader('Paycheck planner', 'Assign every paycheck before it lands', 'Map bills, debt payments, savings transfers, and spendable buffer by pay date.')}
    <section class="stats-grid">
      ${statCard('Latest paycheck', next ? centsToDollars(next.net_amount_cents) : '$0')}
      ${statCard('Bills reserved', next ? centsToDollars(next.planned_bills_cents) : '$0')}
      ${statCard('Debt planned', next ? centsToDollars(next.planned_debt_cents) : '$0')}
      ${statCard('Leftover buffer', centsToDollars(leftover))}
    </section>
    <section class="panel"><h2>Paycheck plans</h2><table><thead><tr><th>Pay date</th><th>Label</th><th>Net</th><th>Bills</th><th>Debt</th><th>Savings</th><th>Buffer</th></tr></thead><tbody>${paychecks.map((check) => {
      const buffer = check.net_amount_cents - check.planned_bills_cents - check.planned_debt_cents - check.planned_savings_cents;
      return `<tr><td>${escapeHtml(check.pay_date)}</td><td>${escapeHtml(check.label)}</td><td>${moneyCell(check.net_amount_cents)}</td><td>${moneyCell(check.planned_bills_cents)}</td><td>${moneyCell(check.planned_debt_cents)}</td><td>${moneyCell(check.planned_savings_cents)}</td><td>${moneyCell(buffer)}</td></tr>`;
    }).join('')}</tbody></table></section>
    <section class="panel"><h2>Edit paychecks</h2><div class="edit-list">${paychecks.map(paycheckForm).join('')}</div>${paycheckForm({ id: '', label: '', pay_date: '', net_amount_cents: 0, planned_bills_cents: 0, planned_debt_cents: 0, planned_savings_cents: 0, notes: '' }, true)}</section>
    <section class="panel"><h2>Bill calendar</h2><div class="mini-list">${bills.map((bill) => `<div><span>${bill.due_day}: ${escapeHtml(bill.name)}</span><strong>${moneyCell(bill.amount_cents)}</strong></div>`).join('')}</div></section>`;
}

function paycheckForm(check, isNew = false) {
  return `<form class="edit-row paycheck-row" method="post" action="${isNew ? '/paycheck' : `/paycheck/${check.id}`}">
    <div class="field wide"><label>Label</label><input name="label" value="${escapeHtml(check.label)}" required></div>
    <div class="field"><label>Pay date</label><input name="pay_date" type="date" value="${escapeHtml(check.pay_date)}" required></div>
    <div class="field"><label>Net</label><input name="net_amount" inputmode="decimal" value="${inputDollars(check.net_amount_cents)}"></div>
    <div class="field"><label>Bills</label><input name="planned_bills" inputmode="decimal" value="${inputDollars(check.planned_bills_cents)}"></div>
    <div class="field"><label>Debt</label><input name="planned_debt" inputmode="decimal" value="${inputDollars(check.planned_debt_cents)}"></div>
    <div class="field"><label>Savings</label><input name="planned_savings" inputmode="decimal" value="${inputDollars(check.planned_savings_cents)}"></div>
    <div class="field full"><label>Notes</label><input name="notes" value="${escapeHtml(check.notes || '')}"></div>
    <button type="submit">${isNew ? 'Add paycheck' : 'Save'}</button>
  </form>`;
}
