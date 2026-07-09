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