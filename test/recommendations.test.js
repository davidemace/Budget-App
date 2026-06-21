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
  assert.equal(allocation.debtMinimumsCents, 2500);
  assert.equal(allocation.downPaymentSavingsCents, 20000);
  assert.equal(allocation.emergencySavingsCents, 10000);
  assert.equal(allocation.dueBills.length, 1);
});
