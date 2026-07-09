# Automated LinkedIn ZIP Solver

This project uses **Playwright** to automatically solve the daily **LinkedIn ZIP** puzzle.

The entire script runs **locally** on your machine. Your LinkedIn credentials are stored only in a local `.env` file and are **never sent anywhere**, so your login information remains on your system.

---

## Prerequisites

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Automated-LinkedIn-ZIP-solver
```

---

### 2. Create a `.env` File

Create a `.env` file in the project's root directory and add your LinkedIn credentials:

```env
email=your_linkedin_email
pass=your_linkedin_password
```

> **Note:** Never commit your `.env` file to GitHub.

---

### 3. Install Dependencies

Install all required packages:

```bash
npm install
```

---

### 4. Configure Playwright

Open `playwright.config.js` and make the following changes:

- **Comment out** the additional browser projects (`firefox` and `webkit`) so that only **Chromium** is enabled.
- Ensure only the **Chromium** project remains uncommented, for example:

```javascript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },

  // {
  //   name: 'firefox',
  //   use: { ...devices['Desktop Firefox'] },
  // },

  // {
  //   name: 'webkit',
  //   use: { ...devices['Desktop Safari'] },
  // },
],
```

This prevents Playwright from launching multiple browser workers and ensures the script runs only in **Chromium**, which is the browser supported by this project.

---

## Running the Script

Start the solver by running:

```bash
npx playwright test ./tests/linkedinLogin.spec.js
```

---

## Security

- Your LinkedIn credentials are stored locally in the `.env` file.
- No credentials are uploaded or shared.
- The automation runs entirely on your own machine.

---

## Notes

- Make sure you have **Node.js** installed before starting.
- Keep your `.env` file private.
- If LinkedIn changes the ZIP puzzle interface, the solver may require updates.
