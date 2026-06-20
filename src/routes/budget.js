/**
 * Budget Route Handler
 * Handles budget CRUD operations
 */

export async function getBudgets(request) {
  return [];
}

export async function createBudget(request) {
  const data = await request.json();
  return { id: 1, ...data };
}

export async function updateBudget(request, budgetId) {
  const data = await request.json();
  return { id: budgetId, ...data };
}

export async function deleteBudget(request, budgetId) {
  return { success: true, id: budgetId };
}
