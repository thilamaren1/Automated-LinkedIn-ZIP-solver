# Automated LinkedIn ZIP Solver

Automatically solves the daily **LinkedIn ZIP** puzzle using **Playwright**.

The entire automation runs **locally** on your machine. Your LinkedIn credentials are stored only in a local `.env` file and are **never uploaded or shared**.

---

## Features

- ✅ Automatic LinkedIn authentication
- ✅ Session persistence using Playwright's `storageState`
- ✅ Automatically reads the ZIP puzzle grid
- ✅ Solves the puzzle using a Depth-First Search (DFS) algorithm
- ✅ Plays the solution automatically using keyboard navigation

---

## Prerequisites

Before running the project, make sure you have:

- Node.js (v18 or later recommended)
- npm
- Google Chrome / Chromium (Playwright will install the required browser)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/username/Automated-LinkedIn-ZIP-Solver.git
cd Automated-LinkedIn-ZIP-solver
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Configure your LinkedIn credentials

Rename the template file:

```bash
# Windows
rename .env.example .env
```

or manually rename `.env.example` to `.env`.

Then edit the `.env` file:

```env
email=your_linkedin_email
pass=your_linkedin_password
```

> **Important:** Never commit your `.env` file to GitHub.

---

## Running the Solver

Run the following command:

```bash
npx playwright test ./tests/linkedinLogin.spec.js --headed
```

---

# First-Time Login

When you run the script for the **first time**, LinkedIn may detect a new browser session and display one of the following security checks:

- Two-Factor Authentication (2FA)
- CAPTCHA
- Email verification
- Phone verification
- Security checkpoint

If this happens, the script automatically pauses and waits for you to complete the verification manually.

Once verification is complete, the authenticated browser session is saved as `linkedin.json`.

Future runs will reuse this saved session, allowing the solver to skip the login process whenever possible.

If your session expires or LinkedIn requests verification again, simply complete the verification and the session will be saved again.

---

## Security

- Your LinkedIn credentials remain on your local machine.
- Credentials are read only from the `.env` file.
- No credentials are transmitted anywhere except LinkedIn during login.
- The project does not collect, upload, or store any personal information.

---

## Notes

- Keep your `.env` file private.
- Do not commit `linkedin.json`.
- If LinkedIn updates the ZIP game interface, minor changes to the automation may be required.
- If the saved session becomes invalid, delete `linkedin.json` and run the script again to create a new authenticated session.

---

## Disclaimer

This project is intended for educational and automation-learning purposes.

LinkedIn may change its authentication flow or puzzle interface at any time, which could require updates to the automation.

---

## Important Note

The login flow will be the same for everyone the **first time** you run the script.

However, on subsequent runs, LinkedIn may show different login screens depending on your account. Some users may be asked to enter their email again, while others may be logged in directly using the saved session.

If the script fails during login on subsequent runs:

1. Open `tests/linkedinLogin.spec.js`.
2. Go to **lines 110–112**.
3. Modify these lines based on the login screen you see:
   - **If LinkedIn asks you to enter your email again**, **uncomment** lines **110–112**.
   - **If LinkedIn asks you to enter only password**, **uncomment** line **110**.
   - **If LinkedIn logs you in directly without asking for your email and password** and password***, **comment out** lines **110–112**.

This is only required because LinkedIn occasionally changes its login UI depending on the account and session state.
