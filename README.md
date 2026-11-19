# Echo Client — front-end demo clone

A front-end-only recreation of the echoclient.net design, built for demonstration.

**Every plan is $0.00, and no payments are processed.** No payment provider (Stripe, PayPal, OxaPay or any other) is connected. The site never asks for payment details. "Continue to payment" shows a processing state and then a demo notice. It does not redirect, create a checkout or make any network request.

## Run

```bash
npm install
npm run dev        # development server
npm run build      # type-check + production build
npm run preview    # serve the production build
```

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds the site and deploys it on every push to `main`. It builds with `BASE_PATH=/<repo-name>/`, and `404.html` is a copy of `index.html`, so deep links like `/EchoWork/dashboard` work.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Pages on a private repository needs a paid GitHub plan; otherwise make the repository public.

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Hero, creator links, gameplay marquee, pricing ($0.00), FAQ accordion |
| `/auth`, `/auth?mode=register` | Sign in, create account, and the forgot-password flow (all local) |
| `/dashboard`, `/dashboard/account` | Download and Account tabs; Upgrade, Redeem Key and Verify Email modals |
| `/changelog` | Release timeline |
| `/terms`, `/privacy` | Demo legal pages |

## Demo behaviour

- **Accounts:** a profile (username, email, demo flags) is stored in `localStorage` only. Passwords are never stored or sent anywhere.
- **Upgrade your plan:** you can select a plan, a payment method and a promo code. All of it is visual only.
- **Redeem key:** any key in the format `ECHO-XXXX-XXXX-XXXX-XXXX` unlocks the demo Lifetime state, so you can see the premium dashboard.
- **Verify email / reset password:** no email is sent. Any 6-digit code works.
- **Download:** shows a toast, because there is no real build.

## Structure

```
src/
  lib/         router (pushState), demo auth store, plan data ($0.00), content
  components/  ui primitives, Navbar, Footer, Modal, UpgradeModal, PaymentMethodPicker,
               PromoCode, DashboardModals, PricingCard, FaqItem, MediaMarquee, Reveal, Toast, DemoBanner
  pages/       Landing, Auth, Dashboard, Changelog, Legal
```
