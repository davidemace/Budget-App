import { getBills, getBudgetCategories, getCreditCards, getPaychecks, getSavingsGoals, getSpendingEntries, run } from '../db.js';
import { formCents, formNumber, formString } from '../services/forms.js';
import { calculateBudget } from '../services/money.js';
import { renderBudgetView } from '../views/budgetView.js';

export async function budget({ request, env, api }) {
  if (request.method === 'POST') {
    await handleBudgetPost(request, env);
    return { redirect: '/budget' };
  }

  const [paychecks, bills, categories, cards, goals, spendingEntries] = await Promise.all([
    getPaychecks(env),
    getBills(env),
    getBudgetCategories(env),
    getCreditCards(env),
    getSavingsGoals(env),
    getSpendingEntries(env)
  ]);

  const model = {
    paychecks,
    bills,
    categories,
    cards,
    goals,
    spendingEntries,
    summary: calculateBudget({ paychecks, bills, categories, cards, goals })
  };

  if (api) return { data: model };
  return {
    title: 'Budget',
    body: renderBudgetView(model)
  };
}

async function handleBudgetPost(request, env) {
  const form = await request.formData();
  const action = formString(form, '_action');

  if (action === 'save_category') {
    const id = formString(form, 'id');
    const values = [
      formString(form, 'name'),
      formString(form, 'category_type', 'variable'),
      formCents(form, 'monthly_budget'),
      formCents(form, 'monthly_actual'),
      formNumber(form, 'sort_order')
    ];
    if (id) {
      await run(env, `UPDATE budget_categories
        SET name = ?, category_type = ?, monthly_budget_cents = ?, monthly_actual_cents = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`, [...values, id]);
    } else {
      await run(env, `INSERT INTO budget_categories
        (name, category_type, monthly_budget_cents, monthly_actual_cents, sort_order)
        VALUES (?, ?, ?, ?, ?)`, values);
    }
  }

  if (action === 'delete_category') {
    await run(env, 'DELETE FROM spending_entries WHERE category_id = ?', [formString(form, 'id')]);
    await run(env, 'UPDATE bills SET category_id = NULL WHERE category_id = ?', [formString(form, 'id')]);
    await run(env, 'DELETE FROM budget_categories WHERE id = ?', [formString(form, 'id')]);
  }

  if (action === 'save_bill') {
    const id = formString(form, 'id');
    const values = [
      formString(form, 'name'),
      formNumber(form, 'due_day', 1),
      formCents(form, 'amount'),
      formString(form, 'category_id') || null,
      form.has('is_fixed') ? 1 : 0
    ];
    if (id) {
      await run(env, `UPDATE bills
        SET name = ?, due_day = ?, amount_cents = ?, category_id = ?, is_fixed = ?
        WHERE id = ?`, [...values, id]);
    } else {
      await run(env, `INSERT INTO bills (name, due_day, amount_cents, category_id, is_fixed)
        VALUES (?, ?, ?, ?, ?)`, values);
    }
  }

  if (action === 'delete_bill') {
    await run(env, 'DELETE FROM bills WHERE id = ?', [formString(form, 'id')]);
  }

  if (action === 'save_spending') {
    await run(env, `INSERT INTO spending_entries (category_id, amount_cents, spent_date, merchant, note)
      VALUES (?, ?, ?, ?, ?)`, [
      formString(form, 'category_id'),
      formCents(form, 'amount'),
      formString(form, 'spent_date'),
      formString(form, 'merchant'),
      formString(form, 'note')
    ]);
  }

  if (action === 'delete_spending') {
    await run(env, 'DELETE FROM spending_entries WHERE id = ?', [formString(form, 'id')]);
  }
}
