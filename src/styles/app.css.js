export const styles = `
:root {
  color-scheme: dark;
  --bg: #080a0f;
  --bg-2: #0d1118;
  --sidebar: #0a0d14;
  --panel: rgba(17, 22, 32, 0.88);
  --panel-strong: rgba(23, 30, 43, 0.94);
  --field: #0c111a;
  --field-2: #111927;
  --line: rgba(148, 163, 184, 0.18);
  --line-strong: rgba(125, 249, 255, 0.26);
  --ink: #edf7ff;
  --muted: #95a3b8;
  --muted-2: #64748b;
  --cyan: #67e8f9;
  --teal: #2dd4bf;
  --green: #4ade80;
  --amber: #fbbf24;
  --red: #fb7185;
  --violet: #a78bfa;
  --shadow: 0 22px 70px rgba(0, 0, 0, 0.36);
  --radius: 8px;
}

* { box-sizing: border-box; }
html { background: var(--bg); }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 268px 1fr;
  background:
    linear-gradient(135deg, rgba(103, 232, 249, 0.10), transparent 34%),
    linear-gradient(315deg, rgba(251, 191, 36, 0.07), transparent 28%),
    var(--bg);
  color: var(--ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.75), transparent 82%);
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 24px 16px;
  background: linear-gradient(180deg, rgba(10, 13, 20, 0.98), rgba(9, 12, 18, 0.88));
  border-right: 1px solid var(--line);
  color: var(--ink);
  z-index: 2;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  color: var(--ink);
  text-decoration: none;
  margin-bottom: 28px;
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.03);
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  color: #061014;
  background: linear-gradient(135deg, var(--cyan), var(--green));
  font-weight: 900;
  box-shadow: 0 0 28px rgba(103, 232, 249, 0.22);
}
.brand strong { letter-spacing: 0; }
.brand small { display: block; color: var(--muted); margin-top: 2px; }
nav { display: grid; gap: 7px; }
nav a {
  position: relative;
  color: #cbd5e1;
  text-decoration: none;
  padding: 12px 12px;
  border: 1px solid transparent;
  border-radius: var(--radius);
  font-weight: 720;
}
nav a:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--line);
}
nav a.active {
  color: var(--ink);
  background: rgba(103, 232, 249, 0.10);
  border-color: var(--line-strong);
  box-shadow: inset 3px 0 0 var(--cyan);
}

.workspace {
  position: relative;
  width: min(1440px, 100%);
  padding: 34px;
  z-index: 1;
}
.page-header {
  max-width: 980px;
  margin-bottom: 26px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}
.eyebrow {
  margin: 0 0 9px;
  color: var(--cyan);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}
h1, h2, h3, p { margin-top: 0; }
h1 {
  margin-bottom: 10px;
  font-size: clamp(2.25rem, 4vw, 4rem);
  line-height: 0.95;
}
h2 { font-size: 1rem; margin-bottom: 16px; }
h3 { font-size: 1.35rem; margin-bottom: 14px; }
p, small, td, th, dd, dt { color: var(--muted); }

.stats-grid, .scenario-grid, .goal-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}
.scenario-grid, .goal-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.two-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}
.panel, .stat-card, .scenario-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 18px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
}
.panel:hover, .stat-card:hover, .scenario-card:hover {
  border-color: rgba(103, 232, 249, 0.30);
}
.stat-card {
  min-height: 132px;
  background: linear-gradient(180deg, rgba(23, 30, 43, 0.96), rgba(13, 17, 24, 0.92));
}
.stat-card span, .stat-card small { display: block; color: var(--muted); }
.stat-card strong {
  display: block;
  margin: 10px 0 5px;
  color: var(--ink);
  font-size: 1.55rem;
}

table { width: 100%; border-collapse: collapse; }
th, td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--line);
  text-align: left;
  white-space: nowrap;
}
th {
  color: var(--ink);
  font-size: 0.72rem;
  text-transform: uppercase;
}

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
  border-radius: var(--radius);
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
}
.goal-line { margin-bottom: 18px; }
.progress {
  width: 100%;
  height: 10px;
  overflow: hidden;
  margin: 10px 0 6px;
  background: #111827;
  border-radius: 999px;
  border: 1px solid var(--line);
}
.progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--teal), var(--green));
  box-shadow: 0 0 18px rgba(45, 212, 191, 0.35);
}
.pill {
  display: inline-flex;
  min-width: 68px;
  justify-content: center;
  padding: 5px 8px;
  border-radius: 999px;
  font-weight: 820;
  border: 1px solid currentColor;
}
.pill.good { color: var(--green); background: rgba(74, 222, 128, 0.10); }
.pill.notice { color: var(--cyan); background: rgba(103, 232, 249, 0.10); }
.pill.warning { color: var(--amber); background: rgba(251, 191, 36, 0.10); }
.pill.danger { color: var(--red); background: rgba(251, 113, 133, 0.10); }
dl { display: grid; gap: 8px; margin: 0 0 16px; }
dl div { display: flex; justify-content: space-between; gap: 12px; }
dt, dd { margin: 0; }
dd { color: var(--ink); }

input, select, textarea, button { font: inherit; }
input, select, textarea {
  width: 100%;
  min-height: 40px;
  border: 1px solid rgba(148, 163, 184, 0.20);
  border-radius: var(--radius);
  padding: 9px 11px;
  background: linear-gradient(180deg, var(--field-2), var(--field));
  color: var(--ink);
  outline: none;
}
select {
  color: var(--ink);
}
input:focus, select:focus, textarea:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(103, 232, 249, 0.12), 0 0 22px rgba(103, 232, 249, 0.12);
}
label {
  font-size: 0.70rem;
  font-weight: 900;
  color: var(--muted);
  text-transform: uppercase;
}
button {
  min-height: 40px;
  border: 1px solid rgba(103, 232, 249, 0.34);
  border-radius: var(--radius);
  padding: 9px 15px;
  background: linear-gradient(135deg, rgba(45, 212, 191, 0.95), rgba(103, 232, 249, 0.88));
  color: #041114;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(45, 212, 191, 0.15);
}
button:hover {
  filter: brightness(1.08);
}
.edit-list {
  display: grid;
  gap: 12px;
}
.edit-row, .edit-card {
  display: grid;
  gap: 12px;
  align-items: end;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018)),
    rgba(8, 13, 22, 0.72);
}
.edit-row:hover, .edit-card:hover {
  border-color: rgba(167, 139, 250, 0.34);
}
.edit-row {
  grid-template-columns: minmax(190px, 1.4fr) repeat(3, minmax(116px, 1fr)) auto;
}
.budget-row {
  grid-template-columns: minmax(190px, 1.5fr) minmax(126px, 0.8fr) repeat(3, minmax(106px, 1fr)) auto;
}
.bill-row {
  grid-template-columns: minmax(190px, 1.6fr) 82px minmax(116px, 1fr) minmax(126px, 1fr) auto auto;
}
.paycheck-row, .scenario-form, .goal-row {
  grid-template-columns: repeat(4, minmax(136px, 1fr));
}
.edit-card {
  grid-template-columns: minmax(210px, 1.5fr) repeat(5, minmax(112px, 1fr)) auto;
}
.field {
  display: grid;
  gap: 6px;
  min-width: 0;
}
.field input, .field select { min-width: 0; }
.field.full, .target-strip {
  grid-column: 1 / -2;
}
.target-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 0.86rem;
}
.target-strip span {
  padding: 6px 9px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
}
.check-field {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  color: var(--muted);
}
.check-field input {
  width: auto;
  min-height: auto;
  accent-color: var(--cyan);
}
.cards-edit {
  gap: 14px;
}
.scenario-card .scenario-form,
.goal-grid .goal-row {
  margin-top: 16px;
}

@media (max-width: 1180px) {
  body { grid-template-columns: 232px 1fr; }
  .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .two-column, .scenario-grid, .goal-grid { grid-template-columns: 1fr; }
  .edit-row, .edit-card, .budget-row, .bill-row, .paycheck-row, .scenario-form, .goal-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .field.full, .target-strip { grid-column: 1 / -1; }
}

@media (max-width: 760px) {
  body { grid-template-columns: 1fr; }
  .sidebar {
    position: static;
    height: auto;
    padding: 16px;
  }
  .brand { margin-bottom: 14px; }
  nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .workspace { padding: 20px; }
  h1 { font-size: 2.25rem; }
  .stats-grid, .scenario-row { grid-template-columns: 1fr; }
  .edit-row, .edit-card, .budget-row, .bill-row, .paycheck-row, .scenario-form, .goal-row {
    grid-template-columns: 1fr;
  }
  .field.full, .target-strip { grid-column: auto; }
  .panel { overflow-x: auto; }
}
`;
