# Jasima Bank - Playwright Practice Website

A local mock business-banking website inspired by the screenshots you supplied.

## Included flows

### Login
- Username/password
- Show/hide password
- Sign In

### Pay & Transfer
- Send money
- Select source account
- Search/select beneficiary
- Enter amount
- Fee payer
- Schedule checkbox
- Purpose of payment
- Payment note
- Review
- Terms checkbox
- OTP authentication
- Success page

### Manage Beneficiary
- Beneficiary table
- Search
- Add new beneficiary
- Country
- SWIFT
- Beneficiary name
- Nickname
- Account/IBAN
- Bank name
- Review beneficiary details
- Confirmation checkbox
- OTP authentication
- Success page
- Delete beneficiary

## Run locally

Option 1:
Open `index.html` directly in Chrome.

Option 2 (recommended):
```bash
npx serve .
```

Then open the URL printed by the command.

## Suggested Playwright test IDs/selectors

This demo intentionally uses normal labels, buttons, headings and text so you can practice:

```ts
page.getByLabel('Username')
page.getByLabel('Password')
page.getByRole('button', { name: 'Sign In' })
page.getByText('Pay & transfer')
page.getByRole('heading', { name: 'Set transfer details' })
page.getByLabel('Transfer amount')
page.getByRole('button', { name: 'Review Payment Details' })
page.getByRole('heading', { name: 'Please review payment details' })
page.getByLabel('OTP digit 1')
```

## Test data

Login:
- Username: any non-empty value
- Password: any non-empty value
- OTP: any six digits

The beneficiary data is stored in browser localStorage so you can practice stateful tests.
