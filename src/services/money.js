export function centsToDollars(cents = 0) {
  return (Number(cents || 0) / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function dollars(cents = 0) {
  return Number(cents || 0) / 100;
}

export function centsFromDollars(value = 0) {
  const normalized = String(value ?? '').replace(/[$,\s]/g, '');
  if (!normalized) return 0;
  return Math.round(Number(normalized) * 100);
}

export function inputDollars(cents = 0) {
  return (Number(cents || 0) / 100).toFixed(2);
}

export function percent(value = 0, digits = 1) {
  return `${Number(value || 0).toFixed(digits)}%`;
}

export function sumBy(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

export function monthlyMortgagePayment(principalCents, annualRate, termYears = 30) {
  const principal = dollars(principalCents);
  const monthlyRate = Number(annualRate || 0) / 100 / 12;
  const months = Number(termYears || 30) * 12;
  if (!principal || !months) return 0;
  if (!monthlyRate) return Math.round((principal / months) * 100);
  const payment = principal * (monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
  return Math.round(payment * 100);
}
