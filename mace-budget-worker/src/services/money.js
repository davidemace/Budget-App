/**
 * Money Service
 * Utilities for money/currency calculations and formatting
 */

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function calculatePercentage(current, total) {
  if (total === 0) return 0;
  return (current / total) * 100;
}

export function calculateMonthlyAmount(annualAmount) {
  return annualAmount / 12;
}

export function calculateAnnualAmount(monthlyAmount) {
  return monthlyAmount * 12;
}

export function roundToTwoDecimals(amount) {
  return Math.round(amount * 100) / 100;
}
