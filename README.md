# Am I Being Scammed?

> AI-powered scam detection — paste any suspicious message and get an instant verdict.

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat&logo=stripe&logoColor=white)

---

## Features

- 🔍 **Instant AI scam analysis** powered by Claude
- 📊 **Scam risk score (0–100)** with color-coded verdict
- 🚩 **Detailed red flags** and safe indicators
- 📋 **Actionable next steps** for each analysis
- 🔐 **Supabase Auth** (email + Google OAuth)
- 💳 **Stripe subscription billing** (Free / Pro tiers)
- 📜 **Check history** for Pro subscribers
- 📱 **Mobile-first** responsive design
- 🛡️ **Rate limiting** and daily usage caps

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Font | Inter (via next/font) |
| AI Engine | Claude API (Anthropic) |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe (Checkout + Customer Portal) |
| Deployment | Vercel |

## Project Structure

```
├── app/
│   ├── layout.tsx                 # Root layout — Inter font, nav, footer, metadata
│   ├── page.tsx                   # Landing page — hero, social proof, examples, pricing
│   ├── check/page.tsx             # Analysis page — form + results display
│   ├── pricing/page.tsx           # Pricing page with FAQ
│   ├── history/page.tsx           # Check history (Pro only)
│   ├── account/page.tsx           # Account & subscription management
│   ├── auth/
│   │   ├── login/page.tsx         # Login page
│   │   └── signup/page.tsx        # Signup page
│   └── api/
│       ├── analyze/route.ts       # POST — Claude scam analysis + rate limiting
│       ├── auth/callback/route.ts # Supabase OAuth callback
│       └── stripe/
│           ├── checkout/route.ts  # Create Stripe Checkout session
│           ├── webhook/route.ts   # Stripe webhook handler
│           └── portal/route.ts    # Stripe Customer Portal session
├── components/                    # 20 React components (ScoreCard, ResultCard, etc.)
├── lib/
│   ├── claude.ts                  # Claude API client wrapper
│   ├── stripe.ts                  # Stripe client + helpers
│   ├── supabase/                  # Supabase clients (browser, server, middleware)
│   ├── usage.ts                   # Freemium usage tracking
│   ├── rate-limit.ts              # In-memory IP rate limiter
│   ├── types.ts                   # TypeScript types
│   ├── constants.ts               # App constants + system prompt
│   └── validation.ts              # Input validation
├── middleware.ts                   # Supabase session refresh middleware
├── supabase/
│   ├── schema.sql                 # Database schema (profiles, checks, ip_checks)
│   └── seed.sql                   # Test seed data
└── public/
    ├── og-image.png               # Open Graph social image
    ├── robots.txt
    └── sitemap.xml
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key
- A [Stripe](https://stripe.com) account

### 1. Clone the repo

```bash
git clone https://github.com/Savage2277z/Am-i-being-scammed-.git
cd Am-i-being-scammed-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Then fill in all values:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `ANTHROPIC_API_KEY` | Claude API key | [Anthropic Console](https://console.anthropic.com) |
| `NEXT_PUBLIC_APP_URL` | Your app URL | `http://localhost:3000` for dev |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Stripe Dashboard → Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_PRICE_ID` | Stripe Price ID for Pro plan | Create a $5/month product in Stripe |

### 4. Set up Supabase database

Run the schema in your Supabase SQL editor:

```bash
# Copy contents of supabase/schema.sql into Supabase Dashboard → SQL Editor → New Query → Run
```

This creates:

- **`profiles`** table (extends auth.users with tier, Stripe IDs, daily check counter)
- **`checks`** table (analysis history with results JSON)
- **`ip_checks`** table (anonymous usage tracking)
- Row Level Security policies
- Auto-profile creation trigger on signup
- Daily check counter reset function

### 5. Configure Supabase Auth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. Enable **Google** provider (requires Google Cloud OAuth credentials)
4. Add redirect URL: `http://localhost:3000/api/auth/callback`

### 6. Set up Stripe

1. Create a product in Stripe Dashboard: "Pro Plan" — $5/month recurring
2. Copy the Price ID (starts with `price_`) into `STRIPE_PRICE_ID`
3. Create a webhook endpoint pointing to `https://your-domain.com/api/stripe/webhook`
4. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
5. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`

### 7. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

### Analysis Flow

```
User pastes message → POST /api/analyze
  → Rate limit check (10 req/min per IP)
  → Auth check (optional — extracts user from Supabase session)
  → Usage check (3 free/day for free tier, unlimited for Pro)
  → Claude API call (with fraud detection system prompt)
  → JSON response parsed and validated
  → Usage incremented + check saved (if logged in)
  → Result returned to client
```

### Freemium Model

- **Free tier**: 3 checks/day, tracked by IP (anonymous) or profile (logged in)
- **Pro tier ($5/month)**: Unlimited checks, full history access
- Daily counters reset automatically when a new day is detected
- Stripe webhooks handle subscription lifecycle (create, update, cancel)

### Database Schema

Three tables:

- **profiles** — Extends Supabase auth.users. Stores tier, Stripe IDs, daily check count.
- **checks** — Analysis history. Stores input text, full result JSON, score, verdict, scam type.
- **ip_checks** — Tracks daily usage for anonymous (not logged in) users by IP address.

## Deployment (Vercel)

1. Push your repo to GitHub
2. Import into [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to your production URL
5. Deploy

**Post-deploy:**

- Update Supabase Auth redirect URL to your production domain
- Update Stripe webhook endpoint to your production URL
- Set up a Supabase cron job (or use pg_cron) to call `select reset_daily_checks()` daily at midnight

## License

MIT
