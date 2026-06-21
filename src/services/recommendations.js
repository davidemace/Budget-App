export function utilizationPercentage(balanceCents, limitCents) {
  const limit = Number(limitCents || 0);
  if (limit <= 0) return 0;
  return (Number(balanceCents || 0) / limit) * 100;
}

export function neededPaymentForUtilization(balanceCents, limitCents, targetPercent) {
  const balance = Number(balanceCents || 0);
  const limit = Number(limitCents || 0);
  if (balance <= 0 || limit <= 0) return 0;
  const targetBalance = Math.floor((limit * Number(targetPercent)) / 100);
  return Math.max(0, balance - targetBalance);
}

export function enrichCards(cards = []) {
  return cards.map((card) => ({
    ...card,
    utilization: utilizationPercentage(card.balance_cents, card.credit_limit_cents),
    needed_49_cents: neededPaymentForUtilization(card.balance_cents, card.credit_limit_cents, 49),
    needed_29_cents: neededPaymentForUtilization(card.balance_cents, card.credit_limit_cents, 29),
    needed_9_cents: neededPaymentForUtilization(card.balance_cents, card.credit_limit_cents, 9)
  }));
}

export function scoreFocusedRecommendation(cards = []) {
  const enriched = enrichCards(cards);
  if (!enriched.length) return null;

  const bands = [89, 49, 29];
  for (const threshold of bands) {
    const card = enriched
      .filter((item) => item.utilization > threshold)
      .sort((a, b) => b.utilization - a.utilization)[0];
    if (card) {
      return {
        card,
        reason: `Highest utilization above ${threshold}%`,
        message: `For score impact, pay ${card.name} first and push it below ${threshold}%.`
      };
    }
  }

  const card = [...enriched].sort((a, b) => Number(b.apr) - Number(a.apr))[0];
  return {
    card,
    reason: 'All cards are below 29%',
    message: `Utilization is in good shape. Shift extra payments to ${card.name}, the highest APR card.`
  };
}

export function interestFocusedRecommendation(cards = []) {
  const card = enrichCards(cards).sort((a, b) => Number(b.apr) - Number(a.apr))[0];
  if (!card) return null;
  return {
    card,
    reason: 'Highest APR',
    message: `For interest savings, send extra dollars to ${card.name} at ${Number(card.apr).toFixed(2)}% APR.`
  };
}

export function readinessStatus({ downPaymentProgress, emergencyProgress, maxUtilization, dti }) {
  const strong = downPaymentProgress >= 80 && emergencyProgress >= 80 && maxUtilization <= 29 && dti <= 36;
  const close = downPaymentProgress >= 50 && emergencyProgress >= 50 && maxUtilization <= 49 && dti <= 43;
  if (strong) return 'Ready';
  if (close) return 'Getting Close';
  return 'Needs Work';
}
