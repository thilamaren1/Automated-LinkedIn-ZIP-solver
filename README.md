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

### 4. Install Playwright

Run:

```bash
npm init playwright@latest
```

During the installation:

#### Step 1

Select **JavaScript**.

<img width="717" height="178" alt="Playwright JavaScript Selection" src="https://github.com/user-attachments/assets/c404dbd1-b925-44e1-aedc-035efab84c34" />

---

#### Step 2

Press **Enter** to accept the default option.

<img width="1117" height="167" alt="Playwright Default Option" src="https://github.com/user-attachments/assets/9fef2053-26a2-40f8-ac6d-788dd339742c" />

---

## Running the Script

Start the solver by running:

```bash
node index.js
```

*(Replace `index.js` with your actual entry file if different.)*

---

## Security

- ✅ Your LinkedIn credentials are stored locally in the `.env` file.
- ✅ No credentials are uploaded or shared.
- ✅ The automation runs entirely on your own machine.

---

## Notes

- Make sure you have **Node.js** installed before starting.
- Keep your `.env` file private.
- If LinkedIn changes the ZIP puzzle interface, the solver may require updates.
