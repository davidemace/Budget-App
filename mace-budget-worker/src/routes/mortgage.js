/**
 * Mortgage Route Handler
 * Handles mortgage tracking and management
 */

export async function getMortgages(request) {
  return [];
}

export async function createMortgage(request) {
  const data = await request.json();
  return { id: 1, ...data };
}

export async function updateMortgage(request, mortgageId) {
  const data = await request.json();
  return { id: mortgageId, ...data };
}

export async function deleteMortgage(request, mortgageId) {
  return { success: true, id: mortgageId };
}
