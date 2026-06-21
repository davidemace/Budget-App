import { ratio, sumBy } from './money.js';

export function utilization(balanceCents, limitCents) {
  return ratio(balanceCents, limitCents);
}

export function neededPaymentForUtilization(balanceCents, limitCents, targetPercent) {
  const limit = Number(limitCents) || 0;
  const balance = Number(balanceCents) || 0;
  const targetBalance = Math.floor((limit * (Number(targetPercent) || 0)) / 100);
  return Math.max(0, balance - targetBalance);
}

export function enrichCard(card) {
  const next = nextUtilizationTarget(card.balance_cents, card.credit_limit_cents);
  return {
    ...card,
    utilization_percent: utilization(card.balance_cents, card.credit_limit_cents),
    needed_to_49_cents: neededPaymentForUtilization(card.balance_cents, card.credit_limit_cents, 49),
    needed_to_29_cents: neededPaymentForUtilization(card.balance_cents, card.credit_limit_cents, 29),
    needed_to_9_cents: neededPaymentForUtilization(card.balance_cents, card.credit_limit_cents, 9),
    next_threshold_percent: next.threshold,
    needed_to_next_threshold_cents: next.amountCents
  };
}

export function enrichCards(cards = []) {
  return cards.map(enrichCard);
}

export function scoreFocusedRecommendation(cards = []) {
  const enriched = enrichCards(cards).filter((card) => Number(card.balance_cents) > 0);
  if (!enriched.length) return null;

  const highestUtilization = (threshold) => enriched
    .filter((card) => card.utilization_percent > threshold)
    .sort((a, b) => b.utilization_percent - a.utilization_percent)[0];

  return highestUtilization(89)
    || highestUtilization(49)
    || highestUtilization(29)
    || [...enriched].sort((a, b) => Number(b.apr) - Number(a.apr))[0];
}

export function interestFocusedRecommendation(cards = []) {
  return enrichCards(cards)
    .filter((card) => Number(card.balance_cents) > 0)
    .sort((a, b) => Number(b.apr) - Number(a.apr))[0] || null;
}

export function cardRecommendationSummary(cards = []) {
  const score = scoreFocusedRecommendation(cards);
  const interest = interestFocusedRecommendation(cards);

  return {
    score,
    interest,
    totalBalanceCents: sumBy(cards, 'balance_cents'),
    totalLimitCents: sumBy(cards, 'credit_limit_cents'),
    aggregateUtilizationPercent: utilization(sumBy(cards, 'balance_cents'), sumBy(cards, 'credit_limit_cents'))
  };
}

export function nextUtilizationTarget(balanceCents, limitCents) {
  const current = utilization(balanceCents, limitCents);
  const threshold = current > 89 ? 89 : current > 49 ? 49 : current > 29 ? 29 : current > 9 ? 9 : 0;
  return {
    threshold,
    amountCents: threshold ? neededPaymentForUtilization(balanceCents, limitCents, threshold) : 0
  };
}

export function simulateCardPayment(card, paymentCents) {
  const payment = Math.max(0, Math.min(Number(paymentCents) || 0, Number(card.balance_cents) || 0));
  const newBalanceCents = Math.max(0, Number(card.balance_cents || 0) - payment);
  const oldUtilization = utilization(card.balance_cents, card.credit_limit_cents);
  const newUtilization = utilization(newBalanceCents, card.credit_limit_cents);
  const crossed = [89, 49, 29, 9].filter((threshold) => oldUtilization > threshold && newUtilization <= threshold);

  return {
    cardId: card.id,
    cardName: card.name,
    paymentCents: payment,
    oldBalanceCents: card.balance_cents,
    newBalanceCents,
    oldUtilization,
    newUtilization,
    crossedThresholds: crossed
  };
}

export function readinessStatus({ downPaymentProgress, emergencyProgress, aggregateUtilization, dti }) {
  const ready = downPaymentProgress >= 80 && emergencyProgress >= 80 && aggregateUtilization <= 29 && dti <= 43;
  if (ready) return 'Ready';

  const close = downPaymentProgress >= 50 && emergencyProgress >= 50 && aggregateUtilization <= 49 && dti <= 50;
  return close ? 'Getting Close' : 'Needs Work';
}
