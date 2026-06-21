import { centsToDollars, inputDollars, sumBy } from '../services/money.js';
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
  return `${pageHeader('Monthly budget', 'Cash flow that supports home buying', 'Separate fixed bills, variable spending, debt minimums, and savings targets so the leftover number is real.')}
    <section class="stats-grid">
      ${statCard('Income', centsToDollars(model.income))}
      ${statCard('Fixed bills', centsToDollars(model.fixedBills))}
      ${statCard('Debt minimums', centsToDollars(model.debtMinimums))}
      ${statCard('Remaining', centsToDollars(model.remaining))}
    </section>
    <section class="two-column">
      <article class="panel"><h2>Budget categories</h2><div class="edit-list">${model.categories.map(categoryForm).join('')}</div>${categoryForm({ id: '', name: '', kind: 'variable', monthly_amount_cents: 0, safe_spending_cents: 0, sort_order: 100 }, true)}</article>
      <article class="panel"><h2>Bills</h2><div class="edit-list">${model.bills.map(billForm).join('')}</div>${billForm({ id: '', name: '', due_day: 1, amount_cents: 0, category: 'fixed', is_active: 1 }, true)}</article>
    </section>
    <section class="panel"><h2>Savings goals in the budget</h2><div class="mini-list">${model.goals.map((goal) => `<div><span>${escapeHtml(goal.name)}</span><strong>${moneyCell(goal.monthly_target_cents)} / mo</strong></div>`).join('')}</div></section>`;
}

function categoryForm(row, isNew = false) {
  return `<form class="edit-row budget-row" method="post" action="${isNew ? '/budget/categories' : `/budget/categories/${row.id}`}">
    <div class="field wide"><label>Name</label><input name="name" value="${escapeHtml(row.name)}" required></div>
    <div class="field"><label>Type</label><select name="kind">${['income', 'fixed', 'variable', 'debt', 'savings'].map((kind) => `<option value="${kind}" ${kind === row.kind ? 'selected' : ''}>${kind}</option>`).join('')}</select></div>
    <div class="field"><label>Monthly</label><input name="monthly_amount" inputmode="decimal" value="${inputDollars(row.monthly_amount_cents)}"></div>
    <div class="field"><label>Safe spend</label><input name="safe_spending" inputmode="decimal" value="${inputDollars(row.safe_spending_cents)}"></div>
    <div class="field compact"><label>Order</label><input name="sort_order" type="number" value="${Number(row.sort_order || 0)}"></div>
    <button type="submit">${isNew ? 'Add category' : 'Save'}</button>
  </form>`;
}

function billForm(bill, isNew = false) {
  return `<form class="edit-row bill-row" method="post" action="${isNew ? '/budget/bills' : `/budget/bills/${bill.id}`}">
    <div class="field wide"><label>Bill</label><input name="name" value="${escapeHtml(bill.name)}" required></div>
    <div class="field compact"><label>Due</label><input name="due_day" type="number" min="1" max="31" value="${Number(bill.due_day || 1)}"></div>
    <div class="field"><label>Amount</label><input name="amount" inputmode="decimal" value="${inputDollars(bill.amount_cents)}"></div>
    <div class="field"><label>Category</label><select name="category">${['fixed', 'variable', 'debt', 'savings'].map((kind) => `<option value="${kind}" ${kind === bill.category ? 'selected' : ''}>${kind}</option>`).join('')}</select></div>
    ${isNew ? '' : `<label class="check-field"><input type="checkbox" name="is_active" ${bill.is_active ? 'checked' : ''}> Active</label>`}
    <button type="submit">${isNew ? 'Add bill' : 'Save'}</button>
  </form>`;
}
