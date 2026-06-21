import { styles } from './styles/app.css.js';
import { renderLayout } from './views/layout.js';
import { dashboard } from './routes/dashboard.js';
import { budget } from './routes/budget.js';
import { cards } from './routes/cards.js';
import { paycheck } from './routes/paycheck.js';
import { mortgage } from './routes/mortgage.js';
import { goals } from './routes/goals.js';

const pageRoutes = [
  route('GET', '/', dashboard),
  route('GET', '/budget', budget),
  route('POST', '/budget', budget),
  route('GET', '/cards', cards),
  route('POST', '/cards', cards),
  route('GET', '/paycheck', paycheck),
  route('POST', '/paycheck', paycheck),
  route('GET', '/mortgage', mortgage),
  route('POST', '/mortgage', mortgage),
  route('GET', '/goals', goals),
  route('POST', '/goals', goals)
];

const apiRoutes = [
  route('GET', '/api/dashboard', dashboard),
  route('GET', '/api/budget', budget),
  route('GET', '/api/cards', cards),
  route('GET', '/api/cards/:id', cards),
  route('GET', '/api/paycheck', paycheck),
  route('GET', '/api/mortgage', mortgage),
  route('GET', '/api/goals', goals)
];

function route(method, pattern, handler) {
  const keys = [];
  const source = pattern
    .split('/')
    .map((part) => {
      if (part.startsWith(':')) {
        keys.push(part.slice(1));
        return '([^/]+)';
      }
      return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');

  return {
    method,
    pattern,
    handler,
    regex: new RegExp(`^${source}/?$`),
    keys
  };
}

function matchRoute(routes, method, pathname) {
  for (const candidate of routes) {
    if (candidate.method !== method) continue;
    const match = pathname.match(candidate.regex);
    if (!match) continue;
    const params = Object.fromEntries(candidate.keys.map((key, index) => [key, decodeURIComponent(match[index + 1])]));
    return { handler: candidate.handler, params, pattern: candidate.pattern };
  }

  return null;
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function redirect(location) {
  return new Response(null, {
    status: 303,
    headers: { location }
  });
}

function errorPayload(error, status) {
  return {
    error: {
      status,
      message: error?.message || 'Something went wrong.'
    }
  };
}

export async function handleRequest(request, env) {
  const url = new URL(request.url);

  if (request.method === 'GET' && url.pathname === '/styles.css') {
    return new Response(styles, {
      headers: {
        'content-type': 'text/css; charset=utf-8',
        'cache-control': 'public, max-age=300'
      }
    });
  }

  if (url.pathname.startsWith('/api/')) {
    const matched = matchRoute(apiRoutes, request.method, url.pathname);
    if (!matched) return json(errorPayload(new Error('API route not found.'), 404), 404);

    try {
      const result = await matched.handler({ request, env, params: matched.params, api: true });
      return json(result.data ?? result);
    } catch (error) {
      const status = error.status || 500;
      return json(errorPayload(error, status), status);
    }
  }

  const matched = matchRoute(pageRoutes, request.method, url.pathname);
  if (!matched) {
    return html(renderLayout({
      title: 'Not Found',
      path: url.pathname,
      body: '<section class="page-header"><h1>Page not found</h1><p>The requested page does not exist.</p></section>'
    }), 404);
  }

  try {
    const page = await matched.handler({ request, env, params: matched.params, api: false });
    if (page.redirect) return redirect(page.redirect);
    return html(renderLayout({ ...page, path: url.pathname }));
  } catch (error) {
    return html(renderLayout({
      title: 'Error',
      path: url.pathname,
      body: `<section class="page-header"><h1>Something went wrong</h1><p>${escapeHtml(error.message)}</p></section>`
    }), error.status || 500);
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
