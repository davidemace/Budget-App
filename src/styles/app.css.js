export const styles = `
:root {
  color: #172033;
  background: #eef2f7;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* { box-sizing: border-box; }

body {
  min-height: 100vh;
  margin: 0;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  background: #eef2f7;
}

.sidebar {
  min-height: 100vh;
  padding: 24px 18px;
  background: #121722;
  color: #ffffff;
}

.brand {
  display: grid;
  gap: 4px;
  margin: 0 8px 28px;
  color: #ffffff;
  text-decoration: none;
}

.brand strong {
  font-size: 26px;
  letter-spacing: 0;
}

.brand span {
  color: #aab4c4;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

nav { display: grid; gap: 6px; }

nav a {
  color: #cbd5e1;
  min-height: 44px;
  padding: 12px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
}

nav a:hover,
nav a.active {
  background: #263142;
  color: #ffffff;
}

.workspace {
  min-width: 0;
  padding: 28px;
  background:
    linear-gradient(180deg, #ffffff 0, #ffffff 360px, #f7f9fc 100%);
}

.page-header {
  margin-bottom: 22px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

h1,
h2,
p { margin-top: 0; }

h1 {
  margin-bottom: 8px;
  font-size: 34px;
  line-height: 1.1;
  letter-spacing: 0;
}

h2 {
  margin-bottom: 16px;
  font-size: 18px;
  letter-spacing: 0;
}

p {
  color: #64748b;
  line-height: 1.55;
}

.grid {
  display: grid;
  gap: 16px;
  margin-bottom: 18px;
}

.metrics { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.three { grid-template-columns: 1.15fr 1fr 1fr; }

.card {
  min-width: 0;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
}

.card.flush { padding-bottom: 0; }

.metric span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.metric strong {
  display: block;
  margin: 9px 0 6px;
  font-size: 25px;
  line-height: 1.15;
}

.metric small { color: #64748b; }
.metric.good { border-color: #bbf7d0; }
.metric.warn { border-color: #fed7aa; }

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
}

th,
td {
  padding: 13px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  vertical-align: top;
}

th {
  color: #64748b;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.stack {
  display: grid;
  gap: 18px;
}

.split {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.progress {
  height: 10px;
  margin: 8px 0;
  overflow: hidden;
  border-radius: 999px;
  background: #e5e7eb;
}

.progress span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: #2563eb;
}

.badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 5px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #334155;
  font-size: 12px;
  font-weight: 800;
}

.badge.ready { background: #dcfce7; color: #166534; }
.badge.getting-close { background: #dbeafe; color: #1d4ed8; }
.badge.needs-work { background: #ffedd5; color: #9a3412; }

.clean-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding-left: 18px;
  color: #475569;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.scenario-grid article {
  min-height: 132px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f8fafc;
}

.scenario-grid span,
.scenario-grid small {
  display: block;
  color: #64748b;
}

.scenario-grid strong {
  display: block;
  margin: 10px 0;
  font-size: 24px;
}

.empty { color: #64748b; }

.command-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
  gap: 18px;
  margin-bottom: 20px;
  padding: 24px;
  border: 1px solid #d7e1ee;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.09), transparent 42%),
    linear-gradient(315deg, rgba(20, 184, 166, 0.11), transparent 34%),
    #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.09);
}

.command-hero h2 {
  margin: 0 0 8px;
  font-size: 34px;
  line-height: 1;
}

.command-hero strong {
  display: block;
  margin-bottom: 10px;
  font-size: 42px;
  line-height: 1;
}

.command-hero p { max-width: 720px; }

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.button-link,
.ghost-link {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 9px 13px;
  border-radius: 8px;
  font-weight: 800;
  text-decoration: none;
}

.button-link {
  background: #172033;
  color: #ffffff;
}

.ghost-link {
  border: 1px solid #cbd5e1;
  color: #172033;
  background: rgba(255, 255, 255, 0.72);
}

.readiness-dial,
.allocation-summary,
.threshold-stack {
  display: grid;
  align-content: center;
  gap: 10px;
  min-height: 190px;
  padding: 18px;
  border-radius: 8px;
  background: #172033;
  color: #ffffff;
}

.readiness-dial span,
.allocation-summary span,
.threshold-stack > span {
  color: #aab4c4;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.readiness-dial strong {
  display: block;
  font-size: 34px;
  line-height: 1;
}

.readiness-dial small,
.allocation-summary small { color: #cbd5e1; }

.readiness-dial.ready { background: #14532d; }
.readiness-dial.getting-close { background: #164e63; }
.readiness-dial.needs-work { background: #7c2d12; }

.task-list {
  display: grid;
  gap: 12px;
}

.task-list article {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.task-list article > span {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #075985;
  font-weight: 900;
}

.task-list p,
.insight-list p,
.budget-tile p { margin-bottom: 0; }

.card-rail,
.budget-tile-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(230px, 1fr));
  gap: 14px;
  margin-bottom: 18px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.card-tile,
.budget-tile {
  min-width: 230px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.card-tile.good,
.budget-tile.good { border-color: #bbf7d0; }
.card-tile.notice { border-color: #bfdbfe; }
.card-tile.warn,
.budget-tile.warn { border-color: #fed7aa; }
.card-tile.danger,
.budget-tile.danger { border-color: #fecaca; }

.mini-meter {
  height: 9px;
  margin: 12px 0;
  overflow: hidden;
  border-radius: 999px;
  background: #e5e7eb;
}

.mini-meter span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #14b8a6, #2563eb);
}

dl {
  display: grid;
  gap: 7px;
  margin: 0;
}

dl div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

dt,
dd {
  margin: 0;
  color: #64748b;
}

dd {
  color: #172033;
  font-weight: 800;
  text-align: right;
}

.threshold-stack {
  background: #111827;
}

.threshold-stack div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.threshold-stack b { color: #ffffff; }
.threshold-stack small { color: #cbd5e1; }

.allocation-bar {
  display: flex;
  height: 18px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
}

.allocation-bar span:nth-child(1) { background: #60a5fa; }
.allocation-bar span:nth-child(2) { background: #f97316; }
.allocation-bar span:nth-child(3) { background: #22c55e; }
.allocation-bar span:nth-child(4) { background: #eab308; }

.allocation-grid.featured article {
  background: linear-gradient(180deg, #ffffff, #f8fafc);
}

.manage-panel {
  margin-top: 18px;
  border: 1px solid #d7e1ee;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
}

.manage-panel summary {
  cursor: pointer;
  padding: 16px 18px;
  color: #172033;
  font-weight: 900;
}

.manage-panel > .grid,
.manage-panel > .card {
  margin: 0;
  padding: 0 18px 18px;
}

.modal-layer {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: none;
  place-items: center;
  padding: 22px;
}

.modal-layer:target {
  display: grid;
}

.modal-scrim {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(5px);
}

.modal-card {
  position: relative;
  z-index: 1;
  width: min(720px, 100%);
  max-height: min(760px, calc(100vh - 44px));
  overflow: auto;
  padding: 20px;
  border: 1px solid #d7e1ee;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-head h2 {
  margin: 0;
}

.modal-close {
  color: #2563eb;
  font-weight: 900;
  text-decoration: none;
}

.drawer-list {
  display: grid;
  gap: 10px;
}

.drawer {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.drawer[open] {
  border-color: #bfdbfe;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.08);
}

.drawer summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  padding: 14px 16px;
  color: #172033;
  font-weight: 900;
  list-style: none;
}

.drawer summary::-webkit-details-marker {
  display: none;
}

.drawer summary::after {
  content: "Edit";
  flex: 0 0 auto;
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.drawer[open] summary::after {
  content: "Close";
}

.drawer summary small {
  color: #64748b;
  font-weight: 700;
}

.drawer-body {
  padding: 0 16px 16px;
}

.toolbar-row {
  margin-bottom: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.form-grid.compact {
  padding: 12px 0;
  border-top: 1px solid #e5e7eb;
}

.form-grid label {
  display: grid;
  gap: 6px;
  color: #475569;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.form-grid label.full,
.form-grid button {
  grid-column: 1 / -1;
}

.form-grid input,
.form-grid select {
  min-height: 40px;
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 9px 10px;
  color: #172033;
  background: #ffffff;
  font: inherit;
}

.form-grid .check {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
}

.form-grid .check input {
  width: 18px;
  min-height: 18px;
}

button,
.link-button {
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  padding: 9px 12px;
  background: #2563eb;
  color: #ffffff;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

button.danger {
  background: #fee2e2;
  color: #991b1b;
}

.link-button {
  min-height: 0;
  padding: 0;
  background: transparent;
  color: #2563eb;
}

.inline-form {
  margin: 0;
}

.editor-card {
  max-height: 680px;
  overflow: auto;
}

.simulation-result,
.next-move {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  background: #eff6ff;
}

.next-move span,
.allocation-grid span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.next-move strong {
  display: block;
  margin: 8px 0;
  font-size: 28px;
}

.allocation-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.allocation-grid article {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f8fafc;
}

.allocation-grid strong {
  display: block;
  margin-top: 6px;
  font-size: 18px;
}

@media (max-width: 1050px) {
  .metrics,
  .two,
  .three,
  .scenario-grid { grid-template-columns: 1fr 1fr; }
  .command-hero { grid-template-columns: 1fr; }
}

@media (max-width: 780px) {
  body { grid-template-columns: 1fr; }
  .sidebar {
    min-height: auto;
    padding: 18px;
  }
  nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .workspace { padding: 20px; }
  .metrics,
  .two,
  .three,
  .scenario-grid { grid-template-columns: 1fr; }
  .command-hero {
    padding: 18px;
  }
  .command-hero h2 { font-size: 28px; }
  .command-hero strong { font-size: 34px; }
  .card-rail,
  .budget-tile-grid { grid-template-columns: 1fr; }
  .form-grid,
  .allocation-grid { grid-template-columns: 1fr; }
  h1 { font-size: 28px; }
}
`;
