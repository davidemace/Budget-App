import { getBills, getBudgetCategories, getCreditCards, getMortgageScenarios, getPaychecks, getSavingsGoals } from '../db.js';
import { calculateBudget, monthlyMortgagePayment, ratio, sumBy } from '../services/money.js';
import { cardRecommendationSummary, enrichCards, readinessStatus } from '../services/recommendations.js';
import { renderDashboardView } from '../views/dashboardView.js';

export async function dashboard({ env, api }) {
  const model = await buildDashboardModel(env);
  if (api) return { data: model };

  return {
    title: 'Dashboard',
    body: renderDashboardView(model)
  };
}

export async function buildDashboardModel(env) {
  const [paychecks, bills, categories, rawCards, goals, rawScenarios] = await Promise.all([
    getPaychecks(env),
    getBills(env),
    getBudgetCategories(env),
    getCreditCards(env),
    getSavingsGoals(env),
    getMortgageScenarios(env)
  ]);

  const cards = enrichCards(rawCards);
  const budget = calculateBudget({ paychecks, bills, categories, cards, goals });
  const recommendations = cardRecommendationSummary(cards);
  const scenarios = rawScenarios.map(enrichMortgageScenario);
  const downPayment = progressGoal(findGoal(goals, 'down_payment') || defaultGoal('Down payment'));
  const emergency = progressGoal(findGoal(goals, 'emergency_fund') || defaultGoal('Emergency fund'));
  const monthlyDebt = sumBy(cards, 'minimum_payment_cents');
  const primaryHousing = scenarios[1] || scenarios[0] || { estimated_monthly_cents: 0 };
  const dti = ratio(primaryHousing.estimated_monthly_cents + monthlyDebt, budget.monthlyIncomeCents);

  return {
    budget,
    cards: {
      items: cards,
      aggregateUtilizationPercent: recommendations.aggregateUtilizationPercent
    },
    recommendations: {
      ...recommendations,
      scoreText: recommendationText(recommendations.score, 'score'),
      interestText: recommendationText(recommendations.interest, 'interest'),
      nextBestMove: buildNextBestMove(recommendations.score)
    },
    goals: {
      items: goals.map(progressGoal),
      downPayment,
      emergency
    },
    scenarios,
    readiness: {
      dti,
      status: readinessStatus({
        downPaymentProgress: downPayment.progress,
        emergencyProgress: emergency.progress,
        aggregateUtilization: recommendations.aggregateUtilizationPercent,
        dti
      })
    }
  };
}

export function enrichMortgageScenario(scenario) {
  const loanCents = Math.max(0, scenario.home_price_cents - scenario.down_payment_cents);
  const principalInterestCents = monthlyMortgagePayment(loanCents, scenario.interest_rate, scenario.term_years);
  const estimatedMonthlyCents = principalInterestCents
    + Math.round(scenario.annual_tax_cents / 12)
    + Math.round(scenario.annual_insurance_cents / 12)
    + scenario.monthly_hoa_cents;

  return {
    ...scenario,
    loan_cents: loanCents,
    principal_interest_cents: principalInterestCents,
    estimated_monthly_cents: estimatedMonthlyCents
  };
}

function findGoal(goals, type) {
  return goals.find((goal) => goal.goal_type === type);
}

function defaultGoal(name) {
  return {
    name,
    target_cents: 0,
    current_cents: 0,
    monthly_contribution_cents: 0
  };
}

function progressGoal(goal) {
  return {
    ...goal,
    progress: ratio(goal.current_cents, goal.target_cents)
  };
}

function recommendationText(card, mode) {
  if (!card) return 'Add credit cards with balances and limits to generate a recommendation.';
  if (mode === 'interest') return `Pay extra toward ${card.name}, the highest-APR balance at ${Number(card.apr).toFixed(2)}%.`;

  if (card.utilization_percent > 89) return `Bring ${card.name} below 89% utilization first.`;
  if (card.utilization_percent > 49) return `Bring ${card.name} below 49% utilization first.`;
  if (card.utilization_percent > 29) return `Bring ${card.name} below 29% utilization first.`;
  return `All cards are below 29%; attack highest APR next: ${card.name}.`;
}

function buildNextBestMove(card) {
  if (!card) {
    return {
      title: 'Add card balances',
      amountCents: 0,
      threshold: 0,
      why: 'The app needs card balances and limits before it can recommend the most useful next payment.'
    };
  }

  const threshold = card.next_threshold_percent || 0;
  const amountCents = card.needed_to_next_threshold_cents || 0;
  const targetText = threshold ? `below ${threshold}%` : 'toward highest APR';

  return {
    title: `Pay ${card.name}`,
    amountCents,
    threshold,
    why: threshold
      ? `A payment of this size moves ${card.name} ${targetText}, which can improve utilization optics before mortgage preapproval.`
      : `${card.name} is the best next target because utilization is already low, so interest savings becomes the priority.`
  };
}
