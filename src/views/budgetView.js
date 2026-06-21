import { centsToDollars } from '../services/money.js';
import { drawer, escapeHtml, modal, pageHeader, metricCard, section, table } from './components.js';

export function renderBudgetView(model) {
  const variableCategories = model.categories.filter((cat) => cat.category_type === 'variable');
  const fixedCategories = model.categories.filter((cat) => cat.category_type === 'fixed');
  const debtCategories = model.categories.filter((cat) => cat.category_type === 'debt');
  const savingsCategories = model.categories.filter((cat) => cat.category_type === 'savings');
  const spentCents = model.categories.reduce((total, cat) => total + Number(cat.actual_spending_cents || 0), 0);
  const plannedCents = model.categories.reduce((total, cat) => total + Number(cat.monthly_budget_cents || 0), 0);
  const remainingCents = plannedCents - spentCents;
  const variableTiles = variableCategories.map((cat) => budgetTile(cat)).join('');
  const fixedTiles = fixedCategories.map((cat) => budgetTile(cat)).join('');
  const debtTiles = debtCategories.map((cat) => budgetTile(cat)).join('');
  const savingsTiles = savingsCategories.map((cat) => budgetTile(cat)).join('');
  const topPressure = [...model.categories]
    .filter((cat) => Number(cat.monthly_budget_cents || 0) > 0)
    .sort((a, b) => {
      const aRatio = Number(a.actual_spending_cents || 0) / Number(a.monthly_budget_cents || 1);
      const bRatio = Number(b.actual_spending_cents || 0) / Number(b.monthly_budget_cents || 1);
      return bRatio - aRatio;
    })
    .slice(0, 3);
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
  const categoryEditors = model.categories.map((cat) => drawer(
    `<span>${escapeHtml(cat.name)}</span><small>${escapeHtml(cat.category_type)} / ${centsToDollars(cat.monthly_budget_cents)}</small>`,
    categoryForm(cat)
  )).join('');
  const billEditors = model.bills.map((bill) => drawer(
    `<span>${escapeHtml(bill.name)}</span><small>Due ${bill.due_day} / ${centsToDollars(bill.amount_cents)}</small>`,
    billForm(bill, categoryOptions)
  )).join('');

  return `${pageHeader('Monthly Spending Cockpit', 'A clearer view of what is safe to spend, what is already committed, and what needs attention.', 'Budget')}
    <section class="command-hero budget-command">
      <div>
        <span class="eyebrow">Safe to spend</span>
        <h2>${centsToDollars(model.summary.safeSpendingCents)}</h2>
        <p>${safeSpendNarrative(model.summary.remainingCashFlowCents)}</p>
        <div class="action-row">
          <a class="button-link" href="#modal-add-spending">Log spending</a>
          <a class="ghost-link" href="/paycheck">Plan next paycheck</a>
        </div>
      </div>
      <div class="readiness-dial">
        <span>Month status</span>
        <strong>${remainingCents >= 0 ? centsToDollars(remainingCents) : `-${centsToDollars(Math.abs(remainingCents))}`}</strong>
        <small>${remainingCents >= 0 ? 'remaining across planned categories' : 'over planned categories'}</small>
      </div>
    </section>

    <section class="budget-board">
      <div class="budget-lane primary">
        <div class="lane-head"><span>Variable spending</span><strong>${centsToDollars(sumCategory(variableCategories, 'actual_spending_cents'))}</strong></div>
        <div class="budget-tile-grid">${variableTiles || '<p>No variable categories yet.</p>'}</div>
      </div>
      <aside class="budget-aside">
        <div class="mini-panel">
          <span>Monthly income</span>
          <strong>${centsToDollars(model.summary.monthlyIncomeCents)}</strong>
          <small>Net planned paychecks</small>
        </div>
        <div class="mini-panel">
          <span>Committed</span>
          <strong>${centsToDollars(model.summary.fixedBillsCents + model.summary.debtMinimumsCents + model.summary.savingsGoalsCents)}</strong>
          <small>Bills, debt minimums, and savings targets</small>
        </div>
        <div class="mini-panel attention">
          <span>Watch first</span>
          ${topPressure.map((cat) => `<p><strong>${escapeHtml(cat.name)}</strong> ${centsToDollars(cat.actual_spending_cents)} / ${centsToDollars(cat.monthly_budget_cents)}</p>`).join('') || '<p>No category pressure yet.</p>'}
        </div>
      </aside>
    </section>

    <div class="budget-lane-row">
      <section class="budget-lane">
        <div class="lane-head"><span>Fixed</span><strong>${centsToDollars(sumCategory(fixedCategories, 'monthly_budget_cents'))}</strong></div>
        <div class="compact-tile-grid">${fixedTiles || '<p>No fixed categories.</p>'}</div>
      </section>
      <section class="budget-lane">
        <div class="lane-head"><span>Debt</span><strong>${centsToDollars(sumCategory(debtCategories, 'monthly_budget_cents'))}</strong></div>
        <div class="compact-tile-grid">${debtTiles || '<p>No debt categories.</p>'}</div>
      </section>
      <section class="budget-lane">
        <div class="lane-head"><span>Savings</span><strong>${centsToDollars(sumCategory(savingsCategories, 'monthly_budget_cents'))}</strong></div>
        <div class="compact-tile-grid">${savingsTiles || '<p>No savings categories.</p>'}</div>
      </section>
    </div>

    <div class="action-row toolbar-row">
      <a class="button-link" href="#modal-add-spending">Add spending entry</a>
      <a class="ghost-link" href="#modal-add-category">Add category</a>
      <a class="ghost-link" href="#modal-add-bill">Add bill</a>
    </div>

    <div class="grid two">
      ${section('Recent Spending', table(['Date', 'Merchant', 'Category', 'Amount', ''], spendingRows, 'No spending entries yet.'), 'flush')}
      ${section('Fixed Bills', table(['Bill', 'Due', 'Amount', 'Category'], billRows, 'No bills found.'), 'flush')}
    </div>
    <details class="manage-panel">
      <summary>Planned vs actual detail</summary>
      ${section('Category Ledger', table(['Type', 'Category', 'Planned', 'Actual', 'Remaining'], categoryRows, 'No budget categories found.'), 'flush')}
    </details>
    <details class="manage-panel">
      <summary>Manage budget setup</summary>
      <div class="grid two">
        ${section('Budget Category Drawers', categoryEditors || '<p>No categories yet.</p>', 'editor-card drawer-list')}
        ${section('Bill Drawers', billEditors || '<p>No bills yet.</p>', 'editor-card drawer-list')}
      </div>
    </details>
    ${modal('modal-add-spending', 'Log Spending', spendingForm(categoryOptions))}
    ${modal('modal-add-category', 'Add Budget Category', categoryForm())}
    ${modal('modal-add-bill', 'Add Bill', billForm(null, categoryOptions))}`;
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

function budgetTile(cat) {
  const planned = Number(cat.monthly_budget_cents || 0);
  const actual = Number(cat.actual_spending_cents || 0);
  const percent = planned > 0 ? Math.min(140, (actual / planned) * 100) : 0;
  const remaining = planned - actual;
  const tone = remaining < 0 ? 'danger' : percent > 80 ? 'warn' : 'good';
  return `<article class="budget-tile ${tone}">
    <div class="split"><strong>${escapeHtml(cat.name)}</strong><span>${centsToDollars(remaining)}</span></div>
    <div class="mini-meter"><span style="width:${Math.min(100, percent).toFixed(1)}%"></span></div>
    <p>${centsToDollars(actual)} used of ${centsToDollars(planned)}</p>
  </article>`;
}

function sumCategory(categories, key) {
  return categories.reduce((total, cat) => total + Number(cat[key] || 0), 0);
}

function safeSpendNarrative(remainingCashFlowCents) {
  if (remainingCashFlowCents >= 0) {
    return `${centsToDollars(remainingCashFlowCents)} remains after fixed bills, debt minimums, and savings targets.`;
  }

  return `${centsToDollars(Math.abs(remainingCashFlowCents))} needs to be trimmed or covered before spending feels safe.`;
}

function option(value, current) {
  return `<option value="${value}" ${value === current ? 'selected' : ''}>${value}</option>`;
}

function moneyInput(cents = 0) {
  return cents ? (Number(cents) / 100).toFixed(2) : '';
}
