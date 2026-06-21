export const styles = `
:root {
  color-scheme: light;
  --sidebar: #15202b;
  --sidebar-soft: #213244;
  --ink: #17212f;
  --muted: #627084;
  --line: #d9e1ea;
  --workspace: #f5f7fb;
  --panel: #ffffff;
  --accent: #0f766e;
  --accent-soft: #d8f3ee;
  --warning: #b45309;
  --danger: #b91c1c;
  --good: #047857;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: var(--workspace);
  color: var(--ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 24px 18px;
  background: var(--sidebar);
  color: white;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  color: white;
  text-decoration: none;
  margin-bottom: 32px;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: var(--accent);
  font-weight: 800;
}
.brand small { display: block; color: #a9b6c5; margin-top: 2px; }
nav { display: grid; gap: 6px; }
nav a {
  color: #dbe6f1;
  text-decoration: none;
  padding: 11px 12px;
  border-radius: 8px;
  font-weight: 650;
}
nav a:hover, nav a.active { background: var(--sidebar-soft); color: white; }

.workspace {
  width: min(1180px, 100%);
  padding: 34px;
}
.page-header { margin-bottom: 24px; max-width: 820px; }
.eyebrow {
  margin: 0 0 8px;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}
h1, h2, h3, p { margin-top: 0; }
h1 { margin-bottom: 10px; font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1; }
h2 { font-size: 1.05rem; margin-bottom: 16px; }
h3 { font-size: 1.4rem; margin-bottom: 14px; }
p, small, td, th, dd, dt { color: var(--muted); }

.stats-grid, .scenario-grid, .goal-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}
.scenario-grid, .goal-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.two-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}
.panel, .stat-card, .scenario-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(20, 31, 46, 0.05);
}
.stat-card span, .stat-card small { display: block; color: var(--muted); }
.stat-card strong { display: block; margin: 8px 0 4px; font-size: 1.55rem; }

table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px 10px; border-bottom: 1px solid var(--line); text-align: left; white-space: nowrap; }
th { color: var(--ink); font-size: 0.78rem; text-transform: uppercase; }

.mini-list { display: grid; gap: 12px; }
.mini-list div, .scenario-row article {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}
.mini-list.single div { border-bottom: 0; padding: 5px 0; }
.scenario-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.scenario-row article {
  display: grid;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 14px;
}
.goal-line { margin-bottom: 18px; }
.progress {
  width: 100%;
  height: 10px;
  overflow: hidden;
  margin: 10px 0 6px;
  background: #e8edf3;
  border-radius: 999px;
}
.progress span { display: block; height: 100%; background: var(--accent); }
.pill {
  display: inline-flex;
  min-width: 68px;
  justify-content: center;
  padding: 5px 8px;
  border-radius: 999px;
  font-weight: 750;
}
.pill.good { color: var(--good); background: #dcfce7; }
.pill.notice { color: #1d4ed8; background: #dbeafe; }
.pill.warning { color: var(--warning); background: #ffedd5; }
.pill.danger { color: var(--danger); background: #fee2e2; }
dl { display: grid; gap: 8px; margin: 0; }
dl div { display: flex; justify-content: space-between; gap: 12px; }
dt, dd { margin: 0; }

input, select, textarea, button { font: inherit; }
input, select, textarea {
  width: 100%;
  min-height: 38px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 10px;
  background: #fff;
  color: var(--ink);
}
label {
  font-size: 0.78rem;
  font-weight: 750;
  color: var(--muted);
}
button {
  min-height: 38px;
  border: 0;
  border-radius: 8px;
  padding: 9px 14px;
  background: var(--accent);
  color: white;
  font-weight: 800;
  cursor: pointer;
}
button:hover { background: #115e59; }
.edit-list {
  display: grid;
  gap: 12px;
}
.edit-row, .edit-card {
  display: grid;
  gap: 10px;
  align-items: end;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fbfdff;
}
.edit-row {
  grid-template-columns: minmax(180px, 1.5fr) repeat(3, minmax(110px, 1fr)) auto;
}
.budget-row {
  grid-template-columns: minmax(180px, 1.5fr) minmax(120px, 0.8fr) repeat(3, minmax(100px, 1fr)) auto;
}
.bill-row {
  grid-template-columns: minmax(180px, 1.6fr) 80px minmax(110px, 1fr) minmax(120px, 1fr) auto auto;
}
.paycheck-row, .scenario-form, .goal-row {
  grid-template-columns: repeat(4, minmax(130px, 1fr));
}
.edit-card {
  grid-template-columns: minmax(190px, 1.6fr) repeat(5, minmax(105px, 1fr)) auto;
}
.field {
  display: grid;
  gap: 5px;
}
.field.full, .target-strip {
  grid-column: 1 / -2;
}
.target-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--muted);
  font-size: 0.88rem;
}
.check-field {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
}
.check-field input {
  width: auto;
  min-height: auto;
}

@media (max-width: 900px) {
  body { grid-template-columns: 1fr; }
  .sidebar { position: static; height: auto; }
  nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .workspace { padding: 22px; }
  .stats-grid, .scenario-grid, .goal-grid, .two-column, .scenario-row { grid-template-columns: 1fr; }
  .edit-row, .edit-card, .budget-row, .bill-row, .paycheck-row, .scenario-form, .goal-row {
    grid-template-columns: 1fr;
  }
  .field.full, .target-strip { grid-column: auto; }
  .panel { overflow-x: auto; }
}
`;
