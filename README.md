# Expense Tracker

Expense Tracker is a single-page web application for recording and reviewing
income and expenses. It is built with plain HTML, CSS, and JavaScript, so it
does not require a backend, database, package manager, or build process.

All transactions, budget settings, and theme preferences are stored in the
browser's `localStorage`.

## Features

- View total balance, income, expenses, and monthly budget information.
- Add income and expense transactions with descriptions, amounts, and
  categories.
- Delete transactions.
- Search transactions by description.
- Filter transactions by type and category.
- Set a budget and view the remaining amount.
- Switch between light and dark themes.
- Reset saved transactions and settings.
- Use the responsive layout on desktop, tablet, and mobile screens.

## Technology

- HTML5
- CSS3 with custom properties, Flexbox, Grid, and media queries
- Vanilla JavaScript (ES6+)
- Font Awesome 6 through a CDN
- Browser `localStorage` for persistence

## Project Structure

```text
Expense_Tracker/
|-- index.html   Page markup and application sections
|-- style.css    Theme styles, layout, and responsive rules
|-- script.js    State management, rendering, filtering, and calculations
`-- README.md    Project documentation
```

## How to Run

### Option 1: Open the HTML file

1. Download or clone the repository.
2. Open `index.html` in a modern web browser.

This is sufficient because the project is a static client-side application.

### Option 2: Run a local server

Using a local server is recommended for consistent browser behavior.

1. Open a terminal in the project folder.
2. Start a Python web server:

   ```bash
   python -m http.server 8000
   ```

3. Open [http://localhost:8000](http://localhost:8000) in your browser.
4. Press `Ctrl+C` in the terminal to stop the server when finished.

No installation command is required if Python 3 is already available. You can
also use any equivalent static-file server.

## How It Works

When the page loads, `script.js` reads transactions, the budget, and the theme
from `localStorage`. Adding or deleting a transaction updates the in-memory
state and saves it again. Totals and filtered transaction lists are recalculated
whenever the state changes. The dark theme is enabled by applying a class to
the document body.

## Current Limitations

- Data is stored only in the current browser and is not synchronized between
  devices.
- The application uses a fixed Indian rupee (INR) currency.
- Transactions do not have a usable date field, so budget calculations are not
  truly limited to the current month.
- Transactions can be added or deleted but not edited.
- There is no data export or import feature.
- The project currently has no automated tests or build tooling.

## License

No license file is currently included. Add a `LICENSE` file, such as an MIT
license, if you intend to distribute or reuse the project.
