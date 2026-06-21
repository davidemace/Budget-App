import { styles } from './styles/app.css.js';
import { htmlResponse, jsonResponse, notFoundResponse } from './views/layout.js';
import { getDashboard, dashboardApi } from './routes/dashboard.js';
import { getBudget, budgetApi } from './routes/budget.js';
import { getCards, cardsApi } from './routes/cards.js';
import { getPaycheck, paycheckApi } from './routes/paycheck.js';
import { getMortgage, mortgageApi } from './routes/mortgage.js';
import { getGoals, goalsApi } from './routes/goals.js';

const pageRoutes = [
  ['GET', '/', getDashboard],
  ['GET', '/dashboard', getDashboard],
  ['GET', '/budget', getBudget],
  ['GET', '/cards', getCards],
  ['GET', '/paycheck', getPaycheck],
  ['GET', '/mortgage', getMortgage],
  ['GET', '/goals', getGoals]
];

const apiRoutes = [
  ['GET', '/api/dashboard', dashboardApi],
  ['GET', '/api/budget', budgetApi],
  ['GET', '/api/cards', cardsApi],
  ['GET', '/api/cards/:id', cardsApi],
  ['GET', '/api/paycheck', paycheckApi],
  ['GET', '/api/mortgage', mortgageApi],
  ['GET', '/api/goals', goalsApi]
];

export async function routeRequest(request, env) {
  const url = new URL(request.url);

  try {
    if (request.method === 'GET' && url.pathname === '/styles.css') {
      return new Response(styles, { headers: { 'content-type': 'text/css; charset=utf-8' } });
    }

    const apiMatch = matchRoute(apiRoutes, request.method, url.pathname);
    if (apiMatch) {
      const data = await apiMatch.handler({ request, env, params: apiMatch.params, url });
      return jsonResponse(data);
    }

    const pageMatch = matchRoute(pageRoutes, request.method, url.pathname);
    if (pageMatch) {
      const page = await pageMatch.handler({ request, env, params: pageMatch.params, url });
      return htmlResponse(page);
    }

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ error: 'Not found' }, 404);
    }

    return notFoundResponse();
  } catch (error) {
    console.error(error);
    const message = error?.message || 'Unexpected server error';
    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ error: message }, 500);
    }
    return htmlResponse({
      title: 'Something went wrong',
      body: `<section class="panel"><h1>Something went wrong</h1><p>${escapeHtml(message)}</p></section>`
    }, 500);
  }
}

function matchRoute(routes, method, pathname) {
  for (const [routeMethod, pattern, handler] of routes) {
    if (routeMethod !== method) continue;
    const params = matchPattern(pattern, pathname);
    if (params) return { handler, params };
  }
  return null;
}

function matchPattern(pattern, pathname) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const expected = patternParts[i];
    const actual = decodeURIComponent(pathParts[i]);
    if (expected.startsWith(':')) {
      params[expected.slice(1)] = actual;
    } else if (expected !== actual) {
      return null;
    }
  }
  return params;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
