import assert from 'node:assert/strict';
import test from 'node:test';
import { centsFromDollars, centsToDollars, inputDollars } from '../src/services/money.js';

test('formats cents as dollars with cents precision', () => {
  assert.equal(centsToDollars(908012), '$9,080.12');
  assert.equal(centsToDollars(0), '$0.00');
});

test('converts edit input dollars back to cents', () => {
  assert.equal(inputDollars(908012), '9080.12');
  assert.equal(centsFromDollars('9,080.12'), 908012);
  assert.equal(centsFromDollars('$1,250.00'), 125000);
});
