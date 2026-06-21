import { sumBy } from './money.js';
import { scoreFocusedRecommendation } from './recommendations.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export function paycheckScheduleFor(payDate, paychecks = []) {
  const sourceAmounts = paycheckSourceAmounts(paychecks);
  const anchor = parseLocalDate(payDate);
  const scheduled = [];

  for (let offset = -1; offset <= 2; offset += 1) {
    const year = anchor.getFullYear();
    const month = anchor.getMonth() + offset;
    scheduled.push(
      {
        name: 'McGraw Hill paycheck - 15th',
        pay_date: formatDate(new Date(year, month, 15)),
        net_amount_cents: sourceAmounts.mcgraw15
      },
      {
        name: 'WISD paycheck',
        pay_date: formatDate(new Date(year, month, 24)),
        net_amount_cents: sourceAmounts.wisd
      },
      {
        name: 'McGraw Hill paycheck - last workday',
        pay_date: formatDate(lastWorkdayOfMonth(year, month)),
        net_amount_cents: sourceAmounts.mcgrawLastWorkday
      }
    );
  }

  return scheduled
    .filter((paycheck) => paycheck.net_amount_cents > 0)
    .sort((a, b) => a.pay_date.localeCompare(b.pay_date) || a.name.localeCompare(b.name));
}

export function nextScheduledPaycheck(payDate, paychecks = [], includeToday = false) {
  const current = parseLocalDate(payDate);
  return paycheckScheduleFor(payDate, paychecks)
    .filter((paycheck) => {
      const date = parseLocalDate(paycheck.pay_date);
      return includeToday ? date >= current : date > current;
    })[0];
}

export function inferNextPaycheckDate(payDate, paychecks = []) {
  const current = parseLocalDate(payDate);
  const nextScheduled = nextScheduledPaycheck(payDate, paychecks);
  if (nextScheduled) return nextScheduled.pay_date;

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
  const spendingEnvelopeTargets = variableSpendingEnvelopes(categories, payDate, paychecks);
  const requiredBillsTargetCents = sumBy(dueBills, 'amount_cents');
  const cardMinimumsTargetCents = sumBy(cardMinimumBillsDue, 'amount_cents');
  const spendingEnvelopesTargetCents = sumBy(spendingEnvelopeTargets, 'target_cents');
  const downPaymentGoal = goals.find((goal) => goal.goal_type === 'down_payment');
  const emergencyGoal = goals.find((goal) => goal.goal_type === 'emergency_fund');
  const paycheckCount = paychecksInMonth(payDate, paychecks);
  const downPaymentTargetCents = Math.round((downPaymentGoal?.monthly_contribution_cents || 0) / paycheckCount);
  const emergencyTargetCents = Math.round((emergencyGoal?.monthly_contribution_cents || 0) / paycheckCount);
  const targetBaseCents = requiredBillsTargetCents
    + cardMinimumsTargetCents
    + spendingEnvelopesTargetCents
    + emergencyTargetCents
    + downPaymentTargetCents;

  let remainingToAllocateCents = amountCents;
  const take = (targetCents) => {
    const allocatedCents = Math.min(Math.max(0, targetCents), Math.max(0, remainingToAllocateCents));
    remainingToAllocateCents -= allocatedCents;
    return allocatedCents;
  };

  const requiredBillsCents = take(requiredBillsTargetCents);
  const cardMinimumsDueCents = take(cardMinimumsTargetCents);
  const spendingEnvelopes = spendingEnvelopeTargets.map((envelope) => ({
    ...envelope,
    amount_cents: take(envelope.target_cents)
  }));
  const spendingEnvelopesCents = sumBy(spendingEnvelopes, 'amount_cents');
  const emergencySavingsCents = take(emergencyTargetCents);
  const downPaymentSavingsCents = take(downPaymentTargetCents);
  const availableAfterCorePlanCents = Math.max(0, remainingToAllocateCents);
  const bufferCents = Math.round(availableAfterCorePlanCents * 0.45);
  const extraCardPaymentCents = availableAfterCorePlanCents - bufferCents;
  const priorityCard = scoreFocusedRecommendation(cards);
  const totalAllocatedCents = requiredBillsCents
    + cardMinimumsDueCents
    + spendingEnvelopesCents
    + emergencySavingsCents
    + downPaymentSavingsCents
    + extraCardPaymentCents
    + bufferCents;
  const unfundedPlanCents = Math.max(0, targetBaseCents - amountCents);

  return {
    payDate,
    nextPayDate: resolvedNextPayDate,
    amountCents,
    dueBills,
    cardMinimumBillsDue,
    spendingEnvelopes,
    requiredBillsCents,
    requiredBillsTargetCents,
    cardMinimumsDueCents,
    cardMinimumsTargetCents,
    spendingEnvelopesCents,
    spendingEnvelopesTargetCents,
    debtMinimumsCents: cardMinimumsDueCents,
    downPaymentSavingsCents,
    downPaymentTargetCents,
    emergencySavingsCents,
    emergencyTargetCents,
    creditCardPaymentCents: cardMinimumsDueCents + extraCardPaymentCents,
    extraCardPaymentCents,
    safeSpendingBufferCents: bufferCents,
    totalAllocatedCents,
    remainingCents: amountCents - totalAllocatedCents,
    unfundedPlanCents,
    priorityCard,
    isShortCents: unfundedPlanCents
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
      target_cents: Math.round(category.monthly_budget_cents / paycheckCount),
      amount_cents: Math.round(category.monthly_budget_cents / paycheckCount)
    }));
}

function paychecksInMonth(payDate, paychecks = []) {
  const current = parseLocalDate(payDate);
  const scheduledCount = paycheckScheduleFor(payDate, paychecks)
    .filter((paycheck) => {
      const date = parseLocalDate(paycheck.pay_date);
      return date.getFullYear() === current.getFullYear() && date.getMonth() === current.getMonth();
    })
    .length;
  if (scheduledCount) return scheduledCount;

  const storedCount = paychecks
    .filter((paycheck) => {
      const date = parseLocalDate(paycheck.pay_date);
      return date.getFullYear() === current.getFullYear() && date.getMonth() === current.getMonth();
    })
    .length;

  return Math.max(1, storedCount || 2);
}

function paycheckSourceAmounts(paychecks = []) {
  const sources = {
    mcgraw15: 0,
    mcgrawLastWorkday: 0,
    wisd: 0
  };

  for (const paycheck of paychecks) {
    const name = normalizeName(paycheck.name);
    const date = parseLocalDate(paycheck.pay_date);
    const amount = Number(paycheck.net_amount_cents) || 0;

    if (name.includes('wisd')) {
      sources.wisd ||= amount;
    } else if (name.includes('additional monthly check')) {
      sources.wisd ||= amount;
    } else if (name.includes('mcgraw') && (name.includes('first') || name.includes('15th') || date.getDate() === 15)) {
      sources.mcgraw15 ||= amount;
    } else if (name.includes('mcgraw') && (name.includes('second') || name.includes('last') || date.getDate() >= 28)) {
      sources.mcgrawLastWorkday ||= amount;
    }
  }

  return sources;
}

function lastWorkdayOfMonth(year, month) {
  const date = new Date(year, month + 1, 0);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() - 1);
  }
  return date;
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
