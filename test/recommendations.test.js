import assert from 'node:assert/strict';
import test from 'node:test';
import {
  interestFocusedRecommendation,
  neededPaymentForUtilization,
  scoreFocusedRecommendation,
  utilizationPercentage
} from '../src/services/recommendations.js';

test('calculates utilization percentage', () => {
  assert.equal(utilizationPercentage(49000, 100000), 49);
  assert.equal(utilizationPercentage(0, 100000), 0);
  assert.equal(utilizationPercentage(10000, 0), 0);
});

test('calculates dollars needed to reach target utilization bands', () => {
  assert.equal(neededPaymentForUtilization(75000, 100000, 49), 26000);
  assert.equal(neededPaymentForUtilization(75000, 100000, 29), 46000);
  assert.equal(neededPaymentForUtilization(75000, 100000, 9), 66000);
  assert.equal(neededPaymentForUtilization(8000, 100000, 9), 0);
});

test('score recommendation prioritizes highest utilization over 89 first', () => {
  const recommendation = scoreFocusedRecommendation([
    { name: 'High APR', balance_cents: 20000, credit_limit_cents: 100000, apr: 29.99 },
    { name: 'Maxed Card', balance_cents: 95000, credit_limit_cents: 100000, apr: 18.99 },
    { name: 'Almost Maxed', balance_cents: 91000, credit_limit_cents: 100000, apr: 24.99 }
  ]);
  assert.equal(recommendation.card.name, 'Maxed Card');
  assert.match(recommendation.reason, /89%/);
});

test('score recommendation uses utilization bands before APR', () => {
  const recommendation = scoreFocusedRecommendation([
    { name: 'Lower Util High APR', balance_cents: 20000, credit_limit_cents: 100000, apr: 29.99 },
    { name: 'Higher Util Low APR', balance_cents: 52000, credit_limit_cents: 100000, apr: 12.99 }
  ]);
  assert.equal(recommendation.card.name, 'Higher Util Low APR');
});

test('score recommendation falls back to highest APR below 29 utilization', () => {
  const recommendation = scoreFocusedRecommendation([
    { name: 'Low APR', balance_cents: 10000, credit_limit_cents: 100000, apr: 12.99 },
    { name: 'High APR', balance_cents: 20000, credit_limit_cents: 100000, apr: 29.99 }
  ]);
  assert.equal(recommendation.card.name, 'High APR');
});

test('interest recommendation always picks highest APR', () => {
  const recommendation = interestFocusedRecommendation([
    { name: 'Utilization Problem', balance_cents: 95000, credit_limit_cents: 100000, apr: 18.99 },
    { name: 'Highest APR', balance_cents: 10000, credit_limit_cents: 100000, apr: 29.99 }
  ]);
  assert.equal(recommendation.card.name, 'Highest APR');
});
