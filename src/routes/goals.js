import { getSavingsGoals, run } from '../db.js';
import { formCents, formNumber, formString } from '../services/forms.js';
import { ratio } from '../services/money.js';
import { renderGoalsView } from '../views/goalsView.js';

export async function goals({ request, env, api }) {
  if (request.method === 'POST') {
    await handleGoalsPost(request, env);
    return { redirect: '/goals' };
  }

  const goals = (await getSavingsGoals(env)).map((goal) => ({
    ...goal,
    progress: ratio(goal.current_cents, goal.target_cents)
  }));

  const model = { goals };
  if (api) return { data: model };

  return {
    title: 'Goals',
    body: renderGoalsView(model)
  };
}

async function handleGoalsPost(request, env) {
  const form = await request.formData();
  const action = formString(form, '_action');

  if (action === 'save_goal') {
    const id = formString(form, 'id');
    const values = [
      formString(form, 'name'),
      formString(form, 'goal_type', 'other'),
      formCents(form, 'target'),
      formCents(form, 'current'),
      formCents(form, 'monthly_contribution'),
      formString(form, 'target_date') || null,
      formNumber(form, 'priority')
    ];
    if (id) {
      await run(env, `UPDATE savings_goals
        SET name = ?, goal_type = ?, target_cents = ?, current_cents = ?, monthly_contribution_cents = ?, target_date = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`, [...values, id]);
    } else {
      await run(env, `INSERT INTO savings_goals
        (name, goal_type, target_cents, current_cents, monthly_contribution_cents, target_date, priority)
        VALUES (?, ?, ?, ?, ?, ?, ?)`, values);
    }
  }

  if (action === 'delete_goal') {
    await run(env, 'DELETE FROM savings_goals WHERE id = ?', [formString(form, 'id')]);
  }
}
