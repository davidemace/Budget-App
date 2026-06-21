export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function pageHeader(title, subtitle, eyebrow = '') {
  return `<header class="page-header">
    ${eyebrow ? `<span class="eyebrow">${escapeHtml(eyebrow)}</span>` : ''}
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(subtitle)}</p>
  </header>`;
}

export function metricCard(label, value, note = '', tone = '') {
  return `<section class="card metric ${tone}">
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
    ${note ? `<small>${escapeHtml(note)}</small>` : ''}
  </section>`;
}

export function section(title, body, className = '') {
  return `<section class="card ${className}">
    <h2>${escapeHtml(title)}</h2>
    ${body}
  </section>`;
}

export function emptyState(text) {
  return `<div class="card empty"><p>${escapeHtml(text)}</p></div>`;
}

export function progressBar(percent) {
  const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
  return `<div class="progress"><span style="width:${safePercent.toFixed(1)}%"></span></div>`;
}

export function statusBadge(label) {
  const key = String(label).toLowerCase().replaceAll(' ', '-');
  return `<span class="badge ${key}">${escapeHtml(label)}</span>`;
}

export function table(headers, rows, emptyText) {
  if (!rows.length) return emptyState(emptyText);
  const head = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('');
  return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
}

export function modal(id, title, body) {
  return `<section id="${escapeHtml(id)}" class="modal-layer" aria-labelledby="${escapeHtml(id)}-title">
    <a class="modal-scrim" href="#" aria-label="Close ${escapeHtml(title)}"></a>
    <div class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-head">
        <h2 id="${escapeHtml(id)}-title">${escapeHtml(title)}</h2>
        <a class="modal-close" href="#" aria-label="Close">Close</a>
      </div>
      ${body}
    </div>
  </section>`;
}

export function drawer(summary, body, className = '') {
  return `<details class="drawer ${className}">
    <summary>${summary}</summary>
    <div class="drawer-body">${body}</div>
  </details>`;
}
