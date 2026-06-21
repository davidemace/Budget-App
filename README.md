# MACE Budget Worker

A single-user Cloudflare Worker + D1 financial command center for monthly budgeting, credit-card payoff, utilization optimization, paycheck allocation, real spending actuals, savings goals, and home-buyer readiness for a $320k to $380k purchase range.

## Setup

```bash
npm install
```

Create the D1 database:

```bash
npx wrangler d1 create mace-budget-db
```

Copy the returned `database_id` into `wrangler.toml`.

Apply migrations locally:

```bash
npm run db:migrate:local
```

Apply migrations remotely:

```bash
npm run db:migrate:remote
```

Run the app locally:

```bash
npm run dev
```

Deploy:

```bash
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
```

## Data Model

Migrations create these D1 tables:

- `budget_categories`
- `credit_cards`
- `paychecks`
- `bills`
- `spending_entries`
- `savings_goals`
- `mortgage_scenarios`
- `payment_plan_entries`

Seed data is realistic starter planning data for budgeting, spending actuals, card payoff, down payment savings, emergency fund progress, and mortgage scenarios.

## Phase 2 Features

- Paycheck allocation engine that finds bills due before the next paycheck and recommends buckets for bills, card payments, down payment savings, emergency savings, and safe spending.
- Credit-card payment simulation showing new balance, utilization, and crossed 89%, 49%, 29%, or 9% thresholds before recording a payment.
- CRUD forms for credit cards, bills, budget categories, savings goals, and mortgage scenarios.
- Budget actuals through `spending_entries`, with planned vs actual vs remaining on the budget page.
- Dashboard Next Best Move panel using score-focused and interest-focused recommendations.

## Tests

```bash
npm test
```

The current tests cover utilization calculations, target payments for 49%, 29%, and 9%, and recommendation priority.

## Known Next Steps

- Add edit forms for cards, bills, paychecks, categories, and goals.
- Add CSV import/export for transaction and balance updates.
- Add optional authentication only after the single-user dashboard is stable.
- Expand payment-plan generation into a month-by-month payoff schedule.
