const navItems = [
  ['dashboard', '/', 'Dashboard'],
  ['budget', '/budget', 'Budget'],
  ['cards', '/cards', 'Credit Cards'],
  ['paycheck', '/paycheck', 'Paycheck Planner'],
  ['mortgage', '/mortgage', 'Mortgage'],
  ['goals', '/goals', 'Goals']
];

export function htmlResponse(page, status = 200) {
  return new Response(renderLayout(page), {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });
}

export function jsonResponse(data, status = 200) {
  const finalStatus = data?.error && status === 200 ? 404 : status;
  return new Response(JSON.stringify(data, null, 2), {
    status: finalStatus,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export function notFoundResponse() {
  return htmlResponse({
    title: 'Not Found',
    active: '',
    body: '<section class="panel"><p class="eyebrow">404</p><h1>Page not found</h1><p>The route you requested does not exist.</p></section>'
  }, 404);
}

export function renderLayout({ title, active, body }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | Mace Budget</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <aside class="sidebar">
    <a class="brand" href="/">
      <span class="brand-mark">M</span>
      <span><strong>Mace Budget</strong><small>Home readiness</small></span>
    </a>
    <nav>${navItems.map(([key, href, label]) => `<a class="${key === active ? 'active' : ''}" href="${href}">${label}</a>`).join('')}</nav>
  </aside>
  <main class="workspace">${body}</main>
</body>
</html>`;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
