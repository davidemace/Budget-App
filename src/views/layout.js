const navItems = [
  ['/', 'Dashboard'],
  ['/budget', 'Budget'],
  ['/cards', 'Credit Cards'],
  ['/paycheck', 'Paycheck Planner'],
  ['/mortgage', 'Mortgage'],
  ['/goals', 'Goals']
];

export function renderLayout({ title, body, path = '/' }) {
  const nav = navItems.map(([href, label]) => {
    const active = href === path ? ' class="active"' : '';
    return `<a href="${href}"${active}>${label}</a>`;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | MACE Budget</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <aside class="sidebar">
    <a class="brand" href="/">
      <strong>MACE</strong>
      <span>Home Budget</span>
    </a>
    <nav>${nav}</nav>
  </aside>
  <main class="workspace">
    ${body}
  </main>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
