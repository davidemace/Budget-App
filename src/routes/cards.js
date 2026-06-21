import { getCreditCard, getCreditCards, run } from '../db.js';
import { formCents, formNumber, formString, todayMonth } from '../services/forms.js';
import { cardRecommendationSummary, enrichCard, enrichCards, simulateCardPayment } from '../services/recommendations.js';
import { renderCardsView } from '../views/cardsView.js';

export async function cards({ request, env, params, api }) {
  if (request.method === 'POST') {
    await handleCardsPost(request, env);
    return { redirect: '/cards' };
  }

  if (params?.id) {
    const card = await getCreditCard(env, params.id);
    if (!card) {
      const error = new Error('Credit card not found.');
      error.status = 404;
      throw error;
    }
    return { data: enrichCard(card) };
  }

  const enriched = enrichCards(await getCreditCards(env));
  const url = new URL(request.url);
  const simulateCardId = url.searchParams.get('simulate_card_id');
  const simulatePaymentCents = formLikeCents(url.searchParams.get('payment'));
  const simulationCard = simulateCardId ? enriched.find((card) => String(card.id) === String(simulateCardId)) : null;
  const recommendations = cardRecommendationSummary(enriched);
  const model = {
    cards: enriched,
    recommendations,
    simulation: simulationCard ? simulateCardPayment(simulationCard, simulatePaymentCents) : null,
    scoreCardName: recommendations.score?.name || 'None',
    scoreText: recommendationText(recommendations.score, 'score'),
    interestText: recommendationText(recommendations.interest, 'interest')
  };

  if (api) return { data: model };
  return {
    title: 'Credit Cards',
    body: renderCardsView(model)
  };
}

async function handleCardsPost(request, env) {
  const form = await request.formData();
  const action = formString(form, '_action');

  if (action === 'save_card') {
    const id = formString(form, 'id');
    const values = [
      formString(form, 'name'),
      formCents(form, 'balance'),
      formCents(form, 'credit_limit'),
      formNumber(form, 'apr'),
      formCents(form, 'minimum_payment'),
      formNumber(form, 'payoff_priority')
    ];
    if (id) {
      await run(env, `UPDATE credit_cards
        SET name = ?, balance_cents = ?, credit_limit_cents = ?, apr = ?, minimum_payment_cents = ?, payoff_priority = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`, [...values, id]);
    } else {
      await run(env, `INSERT INTO credit_cards
        (name, balance_cents, credit_limit_cents, apr, minimum_payment_cents, payoff_priority)
        VALUES (?, ?, ?, ?, ?, ?)`, values);
    }
  }

  if (action === 'delete_card') {
    await run(env, 'DELETE FROM payment_plan_entries WHERE card_id = ?', [formString(form, 'id')]);
    await run(env, 'DELETE FROM credit_cards WHERE id = ?', [formString(form, 'id')]);
  }

  if (action === 'record_payment') {
    const id = formString(form, 'id');
    const card = await getCreditCard(env, id);
    if (!card) return;
    const paymentCents = Math.min(formCents(form, 'payment'), card.balance_cents);
    const endingBalanceCents = Math.max(0, card.balance_cents - paymentCents);
    const planMonth = formString(form, 'plan_month', todayMonth());
    await run(env, `UPDATE credit_cards
      SET balance_cents = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`, [endingBalanceCents, id]);
    await run(env, `INSERT INTO payment_plan_entries
      (card_id, plan_month, payment_cents, principal_cents, interest_cents, ending_balance_cents, note)
      VALUES (?, ?, ?, ?, 0, ?, ?)`, [
      id,
      planMonth,
      paymentCents,
      paymentCents,
      endingBalanceCents,
      formString(form, 'note', 'Recorded card payment')
    ]);
  }
}

function formLikeCents(value) {
  return Math.round((Number(String(value ?? '').replace(/[$,\s]/g, '')) || 0) * 100);
}

function recommendationText(card, mode) {
  if (!card) return 'Add cards to generate a payment priority.';
  if (mode === 'interest') return `Put extra dollars toward ${card.name}, currently the highest-APR balance.`;
  if (card.utilization_percent > 89) return `Put score-focused payments toward ${card.name} until it drops below 89%.`;
  if (card.utilization_percent > 49) return `Put score-focused payments toward ${card.name} until it drops below 49%.`;
  if (card.utilization_percent > 29) return `Put score-focused payments toward ${card.name} until it drops below 29%.`;
  return `Utilization is below 29%; use extra payments on ${card.name} for interest savings.`;
}
