# 🧩 Playwright Automations — Personal Automation Hub (QA Portfolio)

A small collection of Playwright + TypeScript automations I built to solve real needs in my day-to-day life.

They also work as **QA portfolio pieces**, showcasing:

- Playwright + TypeScript
- Page Object Model (POM)
- Robust locators (role/test-id/aria-friendly)
- Resilient flows (search → match → product detail)
- Environment variables for credentials
- Traces & videos on failures
- Clean, readable test output

---

## 📌 Automations Included

### 1) 🐱 Cat Store Purchase — End-to-end order flow (Colombia)

Automates a full purchase flow on **https://www.depelos.co/**.

I live abroad and my cats remain in Colombia. This automation helps me order their food and litter reliably on their behalf.

**Spec:**

- `cats-purchase-automation.spec.ts`

**Highlights**

- Login → product selection → cart → checkout
- Dynamic delivery date selection (skips Sundays + Colombian holidays)
- Optional safety flag to avoid placing a real order (`PLACE_ORDER=false`)
- Screenshot + Playwright HTML report attachments

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

### 2) 🛒 Weekly Grocery Price Checker — Woolworths vs New World (NZ)

Compares prices between **Woolworths NZ** and **New World NZ** for the same items.

**Spec:**

- `weekly-price-checker.spec.ts`

**Highlights**

- Searches items in both stores
- Uses match text to open the correct product (more reliable than “first result”)
- Handles cases where New World blocks automation (Cloudflare) by returning `null` and continuing

---

### 3) 🧾 Weekly Woolworths Price Checker — My list, grouped by category (NZ)

Fetches prices for a custom grocery list on **Woolworths NZ**, then prints a grouped summary.

**Spec:**

- `weekly-woolworths-price-checker.spec.ts`

**Highlights**

- Search → open correct product → extract price from product page
- Supports unit labels (e.g. `per kg`, `per ea`, etc.)
- Final output grouped by category + totals

### ⚠️ Woolworths automation note

Woolworths automations run reliably in a local environment.

During CI execution, requests originating from GitHub Actions (datacenter IPs) are intermittently blocked, resulting in network interruptions and incomplete page rendering.

To ensure CI stability and meaningful signal, Woolworths tests are intentionally excluded from the public CI pipeline.  
This behaviour was validated through connectivity checks (`curl`) and Playwright traces.

---

## 🚀 Setup

### Prerequisites

- Node.js v16+ (recommended: latest LTS)
- npm
- Playwright browsers

Install:

```bash
npm install
npx playwright install
```

**🔐 Environment Variables**

- Some tests require credentials. Set the following environment variables before running Cat store test:
- **`CAT_STORE_EMAIL`**: Account email used to sign in
- **`CAT_STORE_PASSWORD`**: Account password

Optional:

PLACE_ORDER=false (default)
Set PLACE_ORDER=true only when you intentionally want to submit a real order.

⚠️ Never commit credentials or .env files to GitHub. Use a separate test account if possible.

---

▶️ Running Tests

Run all tests (headless): npx playwright test
Run a single spec: npx playwright test automations/personal-automations/weekly-price-checker.spec.ts
Open the latest report: npx playwright show-report

### Examples

Run the Woolworths price list checker:

````bash
npx playwright test automations/personal-automations/weekly-woolworths-price-checker.spec.ts

---

**How to run (Windows)**

- **CMD (Windows):**

  ```cmd
  set CAT_STORE_EMAIL=you@example.com && set CAT_STORE_PASSWORD=secret && set PLACE_ORDER=false && npx playwright test
````

- **PowerShell:**

  ```powershell
  $env:CAT_STORE_EMAIL="you@example.com"; $env:CAT_STORE_PASSWORD="secret"; $env:PLACE_ORDER="false"; npx playwright test
  ```

- **Run without placing an actual order:** set `PLACE_ORDER=false` (default). Set `PLACE_ORDER=true` only when you intentionally want the test to submit a real order.

---

⚠️ GitHub Actions / CI Note (Important)

Some automations may pass locally but fail in GitHub Actions.

This is expected for certain retail websites due to:

- Bot protection / anti-automation measures (e.g. Cloudflare)
- IP reputation or geo/network restrictions on CI runners
- Intermittent network issues or rate limiting

Because of this, these automations are primarily intended to be executed locally.

## Trace and video recording are enabled on failures to support debugging and analysis.

👤 Author

Ivonne
QA · Manual & Automation ·

🐾 This repo represents a blend of personal care, automation skills, and real-world problem-solving.

```

```
