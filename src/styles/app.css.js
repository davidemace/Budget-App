/**
 * Application Styles (CSS-in-JS)
 * Main stylesheet for the budget app
 */

export const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
  }

  header {
    background-color: #2c3e50;
    color: white;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  header nav h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  header nav ul {
    list-style: none;
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  header nav a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
  }

  header nav a:hover {
    color: #3498db;
  }

  main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .card h3 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }

  .card-content {
    padding: 1rem 0;
  }

  .budget-item {
    margin-bottom: 1.5rem;
  }

  .budget-item label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .progress-bar {
    width: 100%;
    height: 24px;
    background-color: #ecf0f1;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3498db, #2980b9);
    transition: width 0.3s ease;
  }

  .amount {
    display: block;
    font-size: 0.9rem;
    color: #7f8c8d;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
    border: none;
    font-size: 1rem;
    transition: all 0.3s;
  }

  .btn-primary {
    background-color: #3498db;
    color: white;
  }

  .btn-primary:hover {
    background-color: #2980b9;
  }

  .btn-secondary {
    background-color: #95a5a6;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #7f8c8d;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #bdc3c7;
    border-radius: 4px;
    font-size: 1rem;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  footer {
    background-color: #2c3e50;
    color: white;
    text-align: center;
    padding: 2rem;
    margin-top: 3rem;
  }

  @media (max-width: 768px) {
    header nav ul {
      flex-direction: column;
      gap: 1rem;
    }

    main {
      margin: 1rem auto;
    }
  }
`;

export function getStylesheet() {
  return styles;
}
