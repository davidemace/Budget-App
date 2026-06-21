import { centsToDollars } from '../services/money.js';
import { escapeHtml, pageHeader, metricCard, section, table } from './components.js';

export function renderBudgetView(model) {
  const categoryRows = model.categories.map((cat) => `<tr>
    <td>${escapeHtml(cat.category_type)}</td>
    <td>${escapeHtml(cat.name)}</td>
    <td>${centsToDollars(cat.monthly_budget_cents)}</td>
    <td>${centsToDollars(cat.actual_spending_cents)}</td>
    <td>${centsToDollars(cat.monthly_budget_cents - cat.actual_spending_cents)}</td>
  </tr>`);

  const billRows = model.bills.map((bill) => `<tr>
    <td>${escapeHtml(bill.name)}</td>
    <td>${bill.due_day}</td>
    <td>${centsToDollars(bill.amount_cents)}</td>
    <td>${escapeHtml(bill.category_name || 'Unassigned')}</td>
  </tr>`);

  const spendingRows = model.spendingEntries.map((entry) => `<tr>
    <td>${escapeHtml(entry.spent_date)}</td>
    <td>${escapeHtml(entry.merchant)}</td>
    <td>${escapeHtml(entry.category_name || 'Unassigned')}</td>
    <td>${centsToDollars(entry.amount_cents)}</td>
    <td>
      <form method="post" class="inline-form">
        <input type="hidden" name="_action" value="delete_spending">
        <input type="hidden" name="id" value="${entry.id}">
        <button class="link-button" type="submit">Delete</button>
      </form>
    </td>
  </tr>`);

  const categoryOptions = model.categories.map((cat) => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`).join('');
  const categoryEditors = model.categories.map((cat) => categoryForm(cat)).join('');
  const billEditors = model.bills.map((bill) => billForm(bill, categoryOptions)).join('');

  return `${pageHeader('Monthly Budget', 'See income, fixed bills, variable categories, debt minimums, savings goals, remaining cash flow, and safe spending.')}
    <div class="grid metrics">
      ${metricCard('Income', centsToDollars(model.summary.monthlyIncomeCents), 'Monthly net paychecks')}
      ${metricCard('Fixed Bills', centsToDollars(model.summary.fixedBillsCents), 'Recurring obligations')}
      ${metricCard('Debt Minimums', centsToDollars(model.summary.debtMinimumsCents), 'Credit card minimums')}
      ${metricCard('Safe Spending', centsToDollars(model.summary.safeSpendingCents), 'Variable categories plus remaining cash')}
    </div>
    <div class="grid two">
      ${section('Planned vs Actual', table(['Type', 'Category', 'Planned', 'Actual', 'Remaining'], categoryRows, 'No budget categories found.'), 'flush')}
      ${section('Fixed Bills', table(['Bill', 'Due', 'Amount', 'Category'], billRows, 'No bills found.'), 'flush')}
    </div>
    <div class="grid two">
      ${section('Add Spending', spendingForm(categoryOptions))}
      ${section('Recent Spending', table(['Date', 'Merchant', 'Category', 'Amount', ''], spendingRows, 'No spending entries yet.'), 'flush')}
    </div>
    <div class="grid two">
      ${section('Budget Category Editor', `${categoryForm()}${categoryEditors}`, 'editor-card')}
      ${section('Bill Editor', `${billForm(null, categoryOptions)}${billEditors}`, 'editor-card')}
    </div>`;
}

function spendingForm(categoryOptions) {
  return `<form method="post" class="form-grid">
    <input type="hidden" name="_action" value="save_spending">
    <label>Category<select name="category_id" required>${categoryOptions}</select></label>
    <label>Amount<input name="amount" inputmode="decimal" placeholder="125.00" required></label>
    <label>Date<input name="spent_date" type="date" required></label>
    <label>Merchant<input name="merchant" placeholder="Grocery store"></label>
    <label class="full">Note<input name="note" placeholder="Optional note"></label>
    <button type="submit">Add spending</button>
  </form>`;
}

function categoryForm(category = {}) {
  const id = category.id || '';
  const deleteButton = id ? `<button class="danger" type="submit" form="delete-category-${id}">Delete</button>` : '';
  return `<form method="post" class="form-grid compact">
    <input type="hidden" name="_action" value="save_category">
    <input type="hidden" name="id" value="${id}">
    <label>Name<input name="name" value="${escapeHtml(category.name || '')}" required></label>
    <label>Type<select name="category_type">
      ${option('fixed', category.category_type)}
      ${option('variable', category.category_type)}
      ${option('debt', category.category_type)}
      ${option('savings', category.category_type)}
    </select></label>
    <label>Planned<input name="monthly_budget" inputmode="decimal" value="${moneyInput(category.monthly_budget_cents)}"></label>
    <label>Manual actual<input name="monthly_actual" inputmode="decimal" value="${moneyInput(category.monthly_actual_cents)}"></label>
    <label>Sort<input name="sort_order" inputmode="numeric" value="${category.sort_order || 0}"></label>
    <button type="submit">${id ? 'Save category' : 'Add category'}</button>
    ${deleteButton}
  </form>${id ? `<form id="delete-category-${id}" method="post"><input type="hidden" name="_action" value="delete_category"><input type="hidden" name="id" value="${id}"></form>` : ''}`;
}

function billForm(bill = {}, categoryOptions = '') {
  const id = bill?.id || '';
  const selectedOptions = categoryOptions.replace(`value="${bill?.category_id}"`, `value="${bill?.category_id}" selected`);
  const deleteButton = id ? `<button class="danger" type="submit" form="delete-bill-${id}">Delete</button>` : '';
  return `<form method="post" class="form-grid compact">
    <input type="hidden" name="_action" value="save_bill">
    <input type="hidden" name="id" value="${id}">
    <label>Name<input name="name" value="${escapeHtml(bill?.name || '')}" required></label>
    <label>Due day<input name="due_day" inputmode="numeric" value="${bill?.due_day || 1}" required></label>
    <label>Amount<input name="amount" inputmode="decimal" value="${moneyInput(bill?.amount_cents)}"></label>
    <label>Category<select name="category_id"><option value="">Unassigned</option>${selectedOptions}</select></label>
    <label class="check"><input name="is_fixed" type="checkbox" ${bill?.is_fixed !== 0 ? 'checked' : ''}> Fixed</label>
    <button type="submit">${id ? 'Save bill' : 'Add bill'}</button>
    ${deleteButton}
  </form>${id ? `<form id="delete-bill-${id}" method="post"><input type="hidden" name="_action" value="delete_bill"><input type="hidden" name="id" value="${id}"></form>` : ''}`;
}

function option(value, current) {
  return `<option value="${value}" ${value === current ? 'selected' : ''}>${value}</option>`;
}

function moneyInput(cents = 0) {
  return cents ? (Number(cents) / 100).toFixed(2) : '';
}
