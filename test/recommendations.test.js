import assert from 'node:assert/strict';
import test from 'node:test';

import {
  interestFocusedRecommendation,
  neededPaymentForUtilization,
  simulateCardPayment,
  scoreFocusedRecommendation,
  utilization
} from '../src/services/recommendations.js';
import { allocatePaycheck } from '../src/services/paycheckAllocation.js';

test('calculates utilization percentage', () => {
  assert.equal(utilization(45000, 100000), 45);
  assert.equal(utilization(0, 100000), 0);
  assert.equal(utilization(50000, 0), 0);
});

test('calculates dollars needed to reach utilization targets', () => {
  assert.equal(neededPaymentForUtilization(90000, 100000, 49), 41000);
  assert.equal(neededPaymentForUtilization(90000, 100000, 29), 61000);
  assert.equal(neededPaymentForUtilization(90000, 100000, 9), 81000);
  assert.equal(neededPaymentForUtilization(20000, 100000, 29), 0);
});

test('score recommendation prioritizes utilization tiers before APR', () => {
  const cards = [
    { name: 'High APR', balance_cents: 10000, credit_limit_cents: 100000, apr: 29.99 },
    { name: 'Over 49', balance_cents: 62000, credit_limit_cents: 100000, apr: 12.99 },
    { name: 'Over 89', balance_cents: 92000, credit_limit_cents: 100000, apr: 15.99 }
  ];

  assert.equal(scoreFocusedRecommendation(cards).name, 'Over 89');
});

test('score recommendation falls back to highest APR when utilization is low', () => {
  const cards = [
    { name: 'Low APR', balance_cents: 10000, credit_limit_cents: 100000, apr: 10.99 },
    { name: 'High APR', balance_cents: 12000, credit_limit_cents: 100000, apr: 26.99 }
  ];

  assert.equal(scoreFocusedRecommendation(cards).name, 'High APR');
  assert.equal(interestFocusedRecommendation(cards).name, 'High APR');
});

test('simulates credit card payment threshold crossings without mutating balance', () => {
  const card = { id: 1, name: 'Visa', balance_cents: 90000, credit_limit_cents: 100000 };
  const result = simulateCardPayment(card, 42000);

  assert.equal(card.balance_cents, 90000);
  assert.equal(result.newBalanceCents, 48000);
  assert.deepEqual(result.crossedThresholds, [89, 49]);
});

test('allocates paycheck against bills before next paycheck', () => {
  const allocation = allocatePaycheck({
    amountCents: 200000,
    payDate: '2026-07-05',
    nextPayDate: '2026-07-19',
    bills: [
      { name: 'Rent', due_day: 1, amount_cents: 100000 },
      { name: 'Internet', due_day: 10, amount_cents: 10000 },
      { name: 'Card minimum', due_day: 10, amount_cents: 2500 },
      { name: 'Phone', due_day: 22, amount_cents: 12000 }
    ],
    cards: [{ name: 'Card', balance_cents: 50000, credit_limit_cents: 100000, minimum_payment_cents: 2500, apr: 20 }],
    goals: [
      { goal_type: 'down_payment', monthly_contribution_cents: 40000 },
      { goal_type: 'emergency_fund', monthly_contribution_cents: 20000 }
    ],
    paychecks: []
  });

  assert.equal(allocation.requiredBillsCents, 10000);
  assert.equal(allocation.cardMinimumsDueCents, 2500);
  assert.equal(allocation.debtMinimumsCents, 2500);
  assert.equal(allocation.downPaymentSavingsCents, 20000);
  assert.equal(allocation.emergencySavingsCents, 10000);
  assert.equal(allocation.dueBills.length, 1);
  assert.equal(allocation.cardMinimumBillsDue.length, 1);
});

test('does not add every credit card minimum unless it is due before the next paycheck', () => {
  const allocation = allocatePaycheck({
    amountCents: 200000,
    payDate: '2026-07-15',
    nextPayDate: '2026-07-31',
    bills: [
      { name: 'Internet', due_day: 15, amount_cents: 10000 },
      { name: 'Card minimum', due_day: 5, amount_cents: 2500 }
    ],
    cards: [{ name: 'Card', balance_cents: 50000, credit_limit_cents: 100000, minimum_payment_cents: 2500, apr: 20 }],
    goals: [],
    paychecks: []
  });

  assert.equal(allocation.requiredBillsCents, 10000);
  assert.equal(allocation.cardMinimumsDueCents, 0);
  assert.equal(allocation.dueBills.length, 1);
  assert.equal(allocation.cardMinimumBillsDue.length, 0);
});

test('does not duplicate due dates when paycheck window crosses months', () => {
  const allocation = allocatePaycheck({
    amountCents: 230300,
    payDate: '2026-06-30',
    nextPayDate: '2026-07-15',
    bills: [
      { name: 'Electric and gas', due_day: 8, amount_cents: 18000 },
      { name: 'Water and trash', due_day: 12, amount_cents: 8500 },
      { name: 'Apple Card minimum', due_day: 5, amount_cents: 17000 }
    ],
    cards: [{ name: 'Apple Card', balance_cents: 100000, credit_limit_cents: 200000, minimum_payment_cents: 17000, apr: 20 }],
    goals: [],
    paychecks: []
  });

  assert.equal(allocation.requiredBillsCents, 26500);
  assert.equal(allocation.cardMinimumsDueCents, 17000);
  assert.deepEqual(allocation.dueBills.map((bill) => bill.name), ['Electric and gas', 'Water and trash']);
  assert.deepEqual(allocation.cardMinimumBillsDue.map((bill) => bill.name), ['Apple Card minimum']);
});

test('reserves known variable spending envelopes from each paycheck', () => {
  const allocation = allocatePaycheck({
    amountCents: 230300,
    payDate: '2026-07-15',
    nextPayDate: '2026-07-31',
    bills: [],
    cards: [],
    goals: [],
    categories: [
      { name: 'Groceries', category_type: 'variable', monthly_budget_cents: 72000, actual_spending_cents: 25000 },
      { name: 'Fuel', category_type: 'variable', monthly_budget_cents: 36000, actual_spending_cents: 10000 },
      { name: 'Housing', category_type: 'fixed', monthly_budget_cents: 165000, actual_spending_cents: 0 }
    ],
    paychecks: [
      { pay_date: '2026-07-15' },
      { pay_date: '2026-07-31' }
    ]
  });

  assert.equal(allocation.spendingEnvelopesCents, 54000);
  assert.deepEqual(allocation.spendingEnvelopes.map((envelope) => envelope.name), ['Groceries', 'Fuel']);
  assert.equal(allocation.spendingEnvelopes[0].amount_cents, 36000);
  assert.equal(allocation.spendingEnvelopes[0].monthly_budget_cents - allocation.spendingEnvelopes[0].actual_spending_cents, 47000);
});
