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
  background: #ffffff;
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
  .scenario-grid { grid-template-columns: 1fr 1fr; }
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
  .scenario-grid { grid-template-columns: 1fr; }
  .form-grid,
  .allocation-grid { grid-template-columns: 1fr; }
  h1 { font-size: 28px; }
}
`;
