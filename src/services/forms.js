export function dollarsToCents(value) {
  const cleaned = String(value ?? '').replace(/[$,\s]/g, '');
  const amount = Number(cleaned);
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100);
}

export function formString(form, key, fallback = '') {
  const value = form.get(key);
  return value == null || value === '' ? fallback : String(value);
}

export function formNumber(form, key, fallback = 0) {
  const value = Number(form.get(key));
  return Number.isFinite(value) ? value : fallback;
}

export function formCents(form, key, fallback = 0) {
  if (!form.has(key) || form.get(key) === '') return fallback;
  return dollarsToCents(form.get(key));
}

export function todayMonth() {
  return new Date().toISOString().slice(0, 7);
}
