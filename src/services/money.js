export function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function centsToDollars(cents = 0) {
  return (toNumber(cents) / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
}

export function centsToDollarsExact(cents = 0) {
  return (toNumber(cents) / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}

export function pct(value, digits = 1) {
  return `${toNumber(value).toFixed(digits)}%`;
}

export function sumBy(rows, key) {
  return rows.reduce((total, row) => total + toNumber(row[key]), 0);
}

export function ratio(part, total) {
  const denominator = toNumber(total);
  if (denominator <= 0) return 0;
  return (toNumber(part) / denominator) * 100;
}

export function monthlyMortgagePayment(principalCents, annualRate, years = 30) {
  const principal = toNumber(principalCents);
  const monthlyRate = toNumber(annualRate) / 100 / 12;
  const payments = toNumber(years, 30) * 12;

  if (principal <= 0) return 0;
  if (monthlyRate === 0) return Math.round(principal / payments);

  return Math.round(principal * ((monthlyRate * (1 + monthlyRate) ** payments) / ((1 + monthlyRate) ** payments - 1)));
}

export function calculateBudget({ paychecks = [], bills = [], categories = [], cards = [], goals = [] }) {
  const monthlyIncomeCents = sumBy(paychecks, 'net_amount_cents');
  const fixedBillsCents = sumBy(bills.filter((bill) => bill.is_fixed), 'amount_cents');
  const variableCategoriesCents = sumBy(categories.filter((cat) => cat.category_type === 'variable'), 'monthly_budget_cents');
  const debtMinimumsCents = sumBy(cards, 'minimum_payment_cents');
  const savingsGoalsCents = sumBy(goals, 'monthly_contribution_cents');
  const plannedOutflowCents = fixedBillsCents + variableCategoriesCents + debtMinimumsCents + savingsGoalsCents;
  const remainingCashFlowCents = monthlyIncomeCents - plannedOutflowCents;
  const safeSpendingCents = Math.max(0, remainingCashFlowCents + variableCategoriesCents);

  return {
    monthlyIncomeCents,
    fixedBillsCents,
    variableCategoriesCents,
    debtMinimumsCents,
    savingsGoalsCents,
    plannedOutflowCents,
    remainingCashFlowCents,
    safeSpendingCents
  };
}
