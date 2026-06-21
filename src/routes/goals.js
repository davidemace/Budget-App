import { all } from '../db.js';
import { renderGoals } from '../views/goalsView.js';

export async function goalsApi({ env }) {
  return loadGoals(env);
}

export async function getGoals({ env }) {
  return {
    title: 'Goals',
    active: 'goals',
    body: renderGoals(await loadGoals(env))
  };
}

async function loadGoals(env) {
  return all(env, 'SELECT * FROM savings_goals ORDER BY goal_type, target_date, name');
}
