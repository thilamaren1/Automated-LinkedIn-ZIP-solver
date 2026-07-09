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

## Running the Script

Start the solver by running:

```bash
npx playwright test ./tests/linkedinLogin.spec.js --headed
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

---

## Important Note

The login flow will be the same for everyone the **first time** you run the script.

However, on subsequent runs, LinkedIn may show different login screens depending on your account. Some users may be asked to enter their email again, while others may be logged in directly using the saved session.

If the script fails during login on subsequent runs:

1. Open `tests/linkedinLogin.spec.js`.
2. Go to **lines 110–112**.
3. Modify these lines based on the login screen you see:
   - **If LinkedIn asks you to enter your email again**, **uncomment** lines **110–112**.
   - **If LinkedIn logs you in directly without asking for your email**, **comment out** lines **110–112**.

This is only required because LinkedIn occasionally changes its login UI depending on the account and session state.
