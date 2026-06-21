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

export function allocatePaycheck({ amountCents, payDate, nextPayDate, bills = [], cards = [], goals = [], categories = [], paychecks = [] }) {
  const resolvedNextPayDate = nextPayDate || inferNextPaycheckDate(payDate, paychecks);
  const allDueBills = billsDueBetween(bills, payDate, resolvedNextPayDate);
  const cardMinimumBillsDue = allDueBills.filter((bill) => isCreditCardMinimumBill(bill, cards));
  const dueBills = allDueBills.filter((bill) => !isCreditCardMinimumBill(bill, cards));
  const spendingEnvelopes = variableSpendingEnvelopes(categories, payDate, paychecks);
  const requiredBillsCents = sumBy(dueBills, 'amount_cents');
  const cardMinimumsDueCents = sumBy(cardMinimumBillsDue, 'amount_cents');
  const spendingEnvelopesCents = sumBy(spendingEnvelopes, 'amount_cents');
  const downPaymentGoal = goals.find((goal) => goal.goal_type === 'down_payment');
  const emergencyGoal = goals.find((goal) => goal.goal_type === 'emergency_fund');
  const paycheckCount = paychecksInMonth(payDate, paychecks);
  const downPaymentTargetCents = Math.round((downPaymentGoal?.monthly_contribution_cents || 0) / paycheckCount);
  const emergencyTargetCents = Math.round((emergencyGoal?.monthly_contribution_cents || 0) / paycheckCount);
  const requiredBaseCents = requiredBillsCents + cardMinimumsDueCents + spendingEnvelopesCents + downPaymentTargetCents + emergencyTargetCents;
  const availableAfterRequiredCents = amountCents - requiredBaseCents;
  const bufferCents = Math.max(0, Math.round(Math.max(0, availableAfterRequiredCents) * 0.45));
  const extraCardPaymentCents = Math.max(0, availableAfterRequiredCents - bufferCents);
  const priorityCard = scoreFocusedRecommendation(cards);
  const totalAllocatedCents = requiredBillsCents
    + cardMinimumsDueCents
    + spendingEnvelopesCents
    + downPaymentTargetCents
    + emergencyTargetCents
    + extraCardPaymentCents
    + bufferCents;

  return {
    payDate,
    nextPayDate: resolvedNextPayDate,
    amountCents,
    dueBills,
    cardMinimumBillsDue,
    spendingEnvelopes,
    requiredBillsCents,
    cardMinimumsDueCents,
    spendingEnvelopesCents,
    debtMinimumsCents: cardMinimumsDueCents,
    downPaymentSavingsCents: downPaymentTargetCents,
    emergencySavingsCents: emergencyTargetCents,
    creditCardPaymentCents: cardMinimumsDueCents + extraCardPaymentCents,
    extraCardPaymentCents,
    safeSpendingBufferCents: bufferCents,
    totalAllocatedCents,
    remainingCents: amountCents - totalAllocatedCents,
    priorityCard,
    isShortCents: Math.max(0, requiredBaseCents - amountCents)
  };
}

function variableSpendingEnvelopes(categories = [], payDate, paychecks = []) {
  const paycheckCount = paychecksInMonth(payDate, paychecks);
  return categories
    .filter((category) => category.category_type === 'variable' && Number(category.monthly_budget_cents) > 0)
    .map((category) => ({
      id: category.id,
      name: category.name,
      monthly_budget_cents: category.monthly_budget_cents,
      actual_spending_cents: category.actual_spending_cents || 0,
      amount_cents: Math.round(category.monthly_budget_cents / paycheckCount)
    }));
}

function paychecksInMonth(payDate, paychecks = []) {
  const current = parseLocalDate(payDate);
  const count = paychecks
    .filter((paycheck) => {
      const date = parseLocalDate(paycheck.pay_date);
      return date.getFullYear() === current.getFullYear() && date.getMonth() === current.getMonth();
    })
    .length;

  return Math.max(1, count || 2);
}

function isCreditCardMinimumBill(bill, cards = []) {
  const billName = normalizeName(bill?.name);
  if (!billName.includes('minimum')) return false;

  return cards.some((card) => {
    const cardName = normalizeName(card?.name);
    return cardName && billName.includes(cardName);
  });
}

function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function possibleDueDates(start, end, dueDay) {
  const datesByDay = new Map();
  for (let offset = -1; offset <= 2; offset += 1) {
    const date = new Date(start.getFullYear(), start.getMonth() + offset, Math.min(28, dueDay));
    date.setDate(Math.min(dueDay, daysInMonth(date.getFullYear(), date.getMonth())));
    datesByDay.set(formatDate(date), date);
  }
  if (end.getMonth() !== start.getMonth() || end.getFullYear() !== start.getFullYear()) {
    const date = new Date(end.getFullYear(), end.getMonth(), Math.min(28, dueDay));
    date.setDate(Math.min(dueDay, daysInMonth(date.getFullYear(), date.getMonth())));
    datesByDay.set(formatDate(date), date);
  }
  return [...datesByDay.values()];
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
