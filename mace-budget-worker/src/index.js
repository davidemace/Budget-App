/**
 * Mace Budget Worker - Main Entry Point
 * Cloudflare Worker for budget management API
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Route requests to appropriate handlers
    try {
      if (path.startsWith('/api/dashboard')) {
        return handleDashboard(request);
      } else if (path.startsWith('/api/budget')) {
        return handleBudget(request);
      } else if (path.startsWith('/api/cards')) {
        return handleCards(request);
      } else if (path.startsWith('/api/paycheck')) {
        return handlePaycheck(request);
      } else if (path.startsWith('/api/mortgage')) {
        return handleMortgage(request);
      } else if (path.startsWith('/api/goals')) {
        return handleGoals(request);
      } else {
        return new Response('Not Found', { status: 404 });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

async function handleDashboard(request) {
  return new Response(JSON.stringify({ message: 'Dashboard endpoint' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleBudget(request) {
  return new Response(JSON.stringify({ message: 'Budget endpoint' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleCards(request) {
  return new Response(JSON.stringify({ message: 'Cards endpoint' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handlePaycheck(request) {
  return new Response(JSON.stringify({ message: 'Paycheck endpoint' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleMortgage(request) {
  return new Response(JSON.stringify({ message: 'Mortgage endpoint' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleGoals(request) {
  return new Response(JSON.stringify({ message: 'Goals endpoint' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
