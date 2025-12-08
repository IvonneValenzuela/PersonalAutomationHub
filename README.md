# 🧩 Playwright Automation — Cat Store Purchase (Personal Project)

## 🐱 Project Purpose

This project automates a full end-to-end purchase flow on **https://www.depelos.co/** —  
but it is also meaningful on a personal level.

I live abroad and my cats remain in Colombia. This automation lets me order
their food and litter reliably and securely on their behalf.

This project also serves as a **QA portfolio piece**, demonstrating:

- Playwright + TypeScript expertise
- Page Object Model (POM) architecture
- Smart, accessible locators
- Dynamic date handling (skipping Sundays + Colombian holidays)
- Checkout and cart flow automation
- Secure credential handling using environment variables
- Screenshot capture + report attachments
- Clean, structured, human-readable tests

# 🚀 Features

### ✔ End-to-end purchase flow

Logs in, navigates product menus, selects preferred litter, adds to cart and completes checkout steps.

### ✔ Dynamic delivery date

Automatically selects **the next valid delivery date**, avoiding:

- Sundays
- Colombian public holidays (2025–2027)

### ✔ Secure credentials

Email & password are injected via environment variables, not saved in code.

### ✔ Realistic automation

Valid for real customer flows: adding products, checkout navigation, payment selection, accepting terms.

### ✔ Screenshots + HTML reporting

Final screenshot saved locally **and** attached to Playwright’s HTML report.

### ✔ Clean, reusable POM

Selectors are stable and methods descriptive.

---

# 🔧 Prerequisites

- **Node.js v16+**
- **npm** or **pnpm**
- **Playwright browsers**

Install all requirements:

```bash
npm install
npx playwright install
```

**Environment Variables**
**Environment Variables**

- The test requires credentials to log into the store. Set the following environment variables before running tests:
- **`CAT_STORE_EMAIL`**: Account email used to sign in
- **`CAT_STORE_PASSWORD`**: Account password

⚠️ Never commit credentials or .env files to GitHub.
Use a separate test account if possible.

---

▶️ Running Tests

Headless execution: npx playwright test
Open the latest report: npx playwright show-report

---

📅 Dynamic Delivery Date Logic

The checkout step requires selecting a valid delivery date.
This project automatically computes the next available date that is:

- Not a Sunday
- Not a Colombian public holiday
- Formatted as YYYY-MM-DD

This logic lives in:
common/helpers/date-helper.ts
and uses holiday arrays stored in:
common/helpers/holidays-colombia.ts

---

**How to run (Windows)**

- **CMD (Windows):**

  ```cmd
  set CAT_STORE_EMAIL=you@example.com && set CAT_STORE_PASSWORD=secret && set PLACE_ORDER=false && npx playwright test
  ```

- **PowerShell:**

  ```powershell
  $env:CAT_STORE_EMAIL="you@example.com"; $env:CAT_STORE_PASSWORD="secret"; $env:PLACE_ORDER="false"; npx playwright test
  ```

- **Run without placing an actual order:** set `PLACE_ORDER=false` (default). Set `PLACE_ORDER=true` only when you intentionally want the test to submit a real order.

---

🔍 What the Test Verifies

---

🛑 Safety Note

The final action that submits the real order can be enabled or disabled.
If using real credentials, ensure you intentionally want to place the order.

---

👤 Author

Ivonne
QA · Manual & Automation ·

🐾 🐱 This project represents a blend of personal care, automation skills, and real-world problem-solving. 🐱 🐾

```


```
