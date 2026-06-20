/**
 * Recommendations Service
 * Generates financial recommendations based on user data
 */

export function generateRecommendations(userData) {
  const recommendations = [];

  if (userData.savingsRate < 0.1) {
    recommendations.push({
      type: 'savings',
      priority: 'high',
      message: 'Consider increasing your savings rate to at least 10% of income.',
    });
  }

  if (userData.debtToIncomeRatio > 0.5) {
    recommendations.push({
      type: 'debt',
      priority: 'high',
      message: 'Your debt-to-income ratio is high. Focus on paying down debt.',
    });
  }

  if (!userData.emergencyFund || userData.emergencyFund < userData.monthlyExpenses * 3) {
    recommendations.push({
      type: 'emergency_fund',
      priority: 'medium',
      message: 'Build an emergency fund of 3-6 months of expenses.',
    });
  }

  return recommendations;
}

export function getFinancialScore(userData) {
  let score = 50;

  if (userData.savingsRate > 0.2) score += 15;
  if (userData.debtToIncomeRatio < 0.3) score += 15;
  if (userData.emergencyFund >= userData.monthlyExpenses * 6) score += 15;
  if (userData.investmentRate > 0) score += 5;

  return Math.min(score, 100);
}
