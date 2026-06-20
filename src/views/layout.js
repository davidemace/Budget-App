/**
 * Layout View
 * Base HTML layout for the budget app
 */

export function renderLayout(content, title = 'Mace Budget') {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="stylesheet" href="/styles/app.css">
    </head>
    <body>
      <header>
        <nav>
          <h1>Mace Budget</h1>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/budget">Budget</a></li>
            <li><a href="/cards">Cards</a></li>
            <li><a href="/paycheck">Paycheck</a></li>
            <li><a href="/mortgage">Mortgage</a></li>
            <li><a href="/goals">Goals</a></li>
          </ul>
        </nav>
      </header>
      <main>
        ${content}
      </main>
      <footer>
        <p>&copy; 2024 Mace Budget. All rights reserved.</p>
      </footer>
    </body>
    </html>
  `;
}
