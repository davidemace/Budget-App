import { centsToDollars, percent } from '../services/money.js';
import { escapeHtml } from './layout.js';

export function pageHeader(kicker, title, copy) {
  return `<header class="page-header"><p class="eyebrow">${escapeHtml(kicker)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(copy)}</p></header>`;
}

export function statCard(label, value, detail = '') {
  return `<article class="stat-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${detail ? `<small>${escapeHtml(detail)}</small>` : ''}</article>`;
}

export function progressBar(current, target) {
  const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  return `<div class="progress"><span style="width:${progress.toFixed(1)}%"></span></div><small>${percent(progress)} funded</small>`;
}

export function moneyCell(cents) {
  return escapeHtml(centsToDollars(cents));
}

export function emptyState(message) {
  return `<section class="panel empty"><p>${escapeHtml(message)}</p></section>`;
}
