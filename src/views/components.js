/**
 * Reusable Components
 * Common UI components for the budget app
 */

export function renderCard(title, content) {
  return `
    <div class="card">
      <h3>${title}</h3>
      <div class="card-content">
        ${content}
      </div>
    </div>
  `;
}

export function renderBudgetProgress(label, current, total) {
  const percentage = (current / total) * 100;
  return `
    <div class="budget-item">
      <label>${label}</label>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percentage}%"></div>
      </div>
      <span class="amount">$${current.toFixed(2)} / $${total.toFixed(2)}</span>
    </div>
  `;
}

export function renderButton(text, href, type = 'primary') {
  return `<a href="${href}" class="btn btn-${type}">${text}</a>`;
}

export function renderForm(fields, action, method = 'POST') {
  let html = `<form action="${action}" method="${method}">`;
  
  fields.forEach(field => {
    html += `
      <div class="form-group">
        <label for="${field.name}">${field.label}</label>
        <input type="${field.type}" id="${field.name}" name="${field.name}" required>
      </div>
    `;
  });
  
  html += `<button type="submit" class="btn btn-primary">Submit</button></form>`;
  return html;
}
