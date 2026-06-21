# Mace Budget Worker

A single-user Cloudflare Worker + D1 dashboard for monthly budgeting, credit-card payoff, utilization optimization, paycheck planning, savings goals, emergency fund progress, and mortgage readiness for a $320k-$380k home purchase range.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```

2. Create the D1 database:
   ```sh
   npx wrangler d1 create mace-budget-db
   ```

3. Copy the returned database id into `wrangler.toml` under `database_id`.

4. Apply migrations locally:
   ```sh
   npm run db:migrate:local
   ```

5. Start local development:
   ```sh
   npm run dev
   ```

6. Apply migrations remotely before deploy:
   ```sh
   npm run db:migrate:remote
   ```

7. Deploy:
   ```sh
   npm run deploy
   ```

## Project Structure

```text
src/
  index.js
  router.js
  db.js
  routes/
    dashboard.js
    budget.js
    cards.js
    paycheck.js
    mortgage.js
    goals.js
  services/
    money.js
    recommendations.js
  views/
    layout.js
    components.js
    dashboardView.js
    budgetView.js
    cardsView.js
    paycheckView.js
    mortgageView.js
    goalsView.js
  styles/
    app.css.js
migrations/
  0001_initial.sql
  0002_seed.sql
test/
  recommendations.test.js
```

## Routes

- `/` and `/dashboard`
- `/budget`
- `/cards`
- `/paycheck`
- `/mortgage`
- `/goals`
- `/api/dashboard`
- `/api/budget`
- `/api/cards`
- `/api/cards/:id`
- `/api/paycheck`
- `/api/mortgage`
- `/api/goals`

## Notes

- The app uses Cloudflare Workers ES module syntax only.
- D1 is accessed through `env.DB`.
- There is no login, registration, JWT, or hardcoded auth secret. This is intentionally single-user until the core planning workflow is solid.
- The custom domain route `budget.davidmace.us` is retained in `wrangler.toml`.

## Tests

```sh
npm test
```

The current tests cover credit utilization, payment amounts needed to reach 49%, 29%, and 9%, and score-focused versus interest-focused recommendation priority.

## Known Next Steps

- Add create/update forms for cards, bills, paychecks, and savings goals.
- Add import/export for account snapshots.
- Add optional authentication after the Worker and D1 flows are stable.
- Add richer mortgage assumptions for PMI, property tax rates, and homeowners insurance.
- Add a payoff timeline view using `payment_plan_entries`.
