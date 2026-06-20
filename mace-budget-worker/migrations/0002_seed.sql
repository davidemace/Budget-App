-- Seed initial data
-- This migration populates the database with sample data

INSERT INTO users (name, email) VALUES 
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com');

INSERT INTO budgets (user_id, name, amount) VALUES
  (1, 'Monthly Budget', 5000),
  (1, 'Emergency Fund', 10000),
  (2, 'Monthly Budget', 4500);
