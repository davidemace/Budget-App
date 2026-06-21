import { centsToDollars, sumBy } from '../services/money.js';
import { pageHeader, statCard, moneyCell } from './components.js';
import { escapeHtml } from './layout.js';

export function buildBudgetModel({ categories, bills, cards, goals }) {
  const income = sumBy(categories.filter((row) => row.kind === 'income'), 'monthly_amount_cents');
  const fixedBills = sumBy(bills, 'amount_cents');
  const variable = sumBy(categories.filter((row) => row.kind === 'variable'), 'monthly_amount_cents');
  const safeSpending = sumBy(categories.filter((row) => row.kind === 'variable'), 'safe_spending_cents');
  const debtMinimums = sumBy(cards, 'minimum_payment_cents');
  const savingsGoals = sumBy(goals, 'monthly_target_cents');
  const remaining = income - fixedBills - variable - debtMinimums - savingsGoals;
  return { categories, bills, cards, goals, income, fixedBills, variable, safeSpending, debtMinimums, savingsGoals, remaining };
}

export function renderBudget(model) {
  const variableRows = model.categories.filter((row) => row.kind === 'variable');
  return `${pageHeader('Monthly budget', 'Cash flow that supports home buying', 'Separate fixed bills, variable spending, debt minimums, and savings targets so the leftover number is real.')}
    <section class="stats-grid">
      ${statCard('Income', centsToDollars(model.income))}
      ${statCard('Fixed bills', centsToDollars(model.fixedBills))}
      ${statCard('Debt minimums', centsToDollars(model.debtMinimums))}
      ${statCard('Remaining', centsToDollars(model.remaining))}
    </section>
    <section class="two-column">
      <article class="panel"><h2>Variable categories</h2><table><thead><tr><th>Category</th><th>Budget</th><th>Safe spend</th></tr></thead><tbody>${variableRows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${moneyCell(row.monthly_amount_cents)}</td><td>${moneyCell(row.safe_spending_cents)}</td></tr>`).join('')}</tbody></table></article>
      <article class="panel"><h2>Fixed bills</h2><table><thead><tr><th>Bill</th><th>Due</th><th>Amount</th></tr></thead><tbody>${model.bills.map((bill) => `<tr><td>${escapeHtml(bill.name)}</td><td>${bill.due_day}</td><td>${moneyCell(bill.amount_cents)}</td></tr>`).join('')}</tbody></table></article>
    </section>
    <section class="panel"><h2>Savings goals in the budget</h2><div class="mini-list">${model.goals.map((goal) => `<div><span>${escapeHtml(goal.name)}</span><strong>${moneyCell(goal.monthly_target_cents)} / mo</strong></div>`).join('')}</div></section>`;
}
