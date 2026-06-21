import { sumBy } from './money.js';
import { scoreFocusedRecommendation } from './recommendations.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export function inferNextPaycheckDate(payDate, paychecks = []) {
  const current = parseLocalDate(payDate);
  const nextStored = paychecks
    .map((paycheck) => parseLocalDate(paycheck.pay_date))
    .filter((date) => date > current)
    .sort((a, b) => a - b)[0];

  const inferred = nextStored || new Date(current.getTime() + 14 * DAY_MS);
  return formatDate(inferred);
}

export function billsDueBetween(bills = [], payDate, nextPayDate) {
  const start = parseLocalDate(payDate);
  const end = parseLocalDate(nextPayDate);
  const dueRows = [];

  for (const bill of bills) {
    for (const dueDate of possibleDueDates(start, end, bill.due_day)) {
      if (dueDate >= start && dueDate < end) {
        dueRows.push({ ...bill, due_date: formatDate(dueDate) });
      }
    }
  }

  return dueRows.sort((a, b) => a.due_date.localeCompare(b.due_date) || a.name.localeCompare(b.name));
}

export function allocatePaycheck({ amountCents, payDate, nextPayDate, bills = [], cards = [], goals = [], paychecks = [] }) {
  const resolvedNextPayDate = nextPayDate || inferNextPaycheckDate(payDate, paychecks);
  const dueBills = billsDueBetween(bills, payDate, resolvedNextPayDate);
  const requiredBillsCents = sumBy(dueBills, 'amount_cents');
  const debtMinimumsCents = sumBy(cards, 'minimum_payment_cents');
  const downPaymentGoal = goals.find((goal) => goal.goal_type === 'down_payment');
  const emergencyGoal = goals.find((goal) => goal.goal_type === 'emergency_fund');
  const downPaymentTargetCents = Math.round((downPaymentGoal?.monthly_contribution_cents || 0) / 2);
  const emergencyTargetCents = Math.round((emergencyGoal?.monthly_contribution_cents || 0) / 2);
  const requiredBaseCents = requiredBillsCents + debtMinimumsCents + downPaymentTargetCents + emergencyTargetCents;
  const availableAfterRequiredCents = amountCents - requiredBaseCents;
  const bufferCents = Math.max(0, Math.round(Math.max(0, availableAfterRequiredCents) * 0.45));
  const extraCardPaymentCents = Math.max(0, availableAfterRequiredCents - bufferCents);
  const priorityCard = scoreFocusedRecommendation(cards);

  return {
    payDate,
    nextPayDate: resolvedNextPayDate,
    amountCents,
    dueBills,
    requiredBillsCents,
    debtMinimumsCents,
    downPaymentSavingsCents: downPaymentTargetCents,
    emergencySavingsCents: emergencyTargetCents,
    creditCardPaymentCents: debtMinimumsCents + extraCardPaymentCents,
    extraCardPaymentCents,
    safeSpendingBufferCents: bufferCents,
    remainingCents: amountCents - requiredBillsCents - debtMinimumsCents - downPaymentTargetCents - emergencyTargetCents - extraCardPaymentCents - bufferCents,
    priorityCard,
    isShortCents: Math.max(0, requiredBaseCents - amountCents)
  };
}

function possibleDueDates(start, end, dueDay) {
  const dates = [];
  for (let offset = -1; offset <= 2; offset += 1) {
    const date = new Date(start.getFullYear(), start.getMonth() + offset, Math.min(28, dueDay));
    date.setDate(Math.min(dueDay, daysInMonth(date.getFullYear(), date.getMonth())));
    dates.push(date);
  }
  if (end.getMonth() !== start.getMonth() || end.getFullYear() !== start.getFullYear()) {
    const date = new Date(end.getFullYear(), end.getMonth(), Math.min(28, dueDay));
    date.setDate(Math.min(dueDay, daysInMonth(date.getFullYear(), date.getMonth())));
    dates.push(date);
  }
  return dates;
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function parseLocalDate(value) {
  const [year, month, day] = String(value).split('-').map(Number);
  return new Date(year, month - 1, day || 1);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
