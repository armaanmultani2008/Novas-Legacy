# Nova's Legacy

Official website of **Nova's Legacy**, a cheetah breeding and conservation centre in Bela‑Bela, Limpopo (South Africa), founded by Kim Hiltrop and run in partnership with the **FeraCare Wildlife Centre**. The site tells the story of the project and its animals, and also runs the organisation's day‑to‑day operations: symbolic animal adoptions, a merch store, donations, a physical‑goods wishlist, volunteer/internship applications, a blog, an FAQ, a contact channel and a fully admin‑editable CMS — all wrapped around an AI chat widget and a WhatsApp button for visitor support.

It is a full‑stack JavaScript application: a **React (Vite) single‑page frontend** talking to a **Node.js/Express backend** backed by **MongoDB Atlas**, with **Stripe**, **PayPal** and **Printful** handling payments and fulfilment, and **Brevo** handling transactional email.

## Table of contents

- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Content management (CMS)](#content-management-cms)
- [Frontend pages](#frontend-pages)
- [Other notable features](#other-notable-features)
- [Project structure](#project-structure)
- [Running locally](#running-locally)
- [Environment variables](#environment-variables)
- [Organisation details](#organisation-details)

## Tech stack

### Frontend (`/`)

- **React 19** + **Vite 5** (`@vitejs/plugin-react`), ESLint with `eslint-plugin-react-hooks` / `eslint-plugin-react-refresh`
- **react-i18next / i18next** — not used for multilingual translation, but as the app's CMS templating layer: all page copy is fetched once from the backend (`GET /api/content`), injected into i18next as the `en` translation bundle, and cached in `localStorage` (`nl_content`) so repeat visits render instantly before the network call resolves
- A **hand‑rolled router** in `src/App.jsx` (hash + query‑string based, with `pushState`/`popstate` handling and animated page transitions) — `react-router-dom` is present in `package.json` but not actually wired up
- **react-turnstile** — Cloudflare Turnstile widget guarding the contact form
- **Stripe.js** and the **PayPal JS SDK**, both loaded client‑side for checkout (merch, adoptions, donations)
- Plain CSS (`src/index.css`, `src/App.css`, plus component‑scoped `<style>` blocks) with custom hooks for scroll‑reveal animations (`useScrollReveal`) and body‑scroll locking on modals (`useBodyScrollLock`), a custom cursor, and a lightbox component

### Backend (`backend/`)

- **Node.js + Express 5**
- **MongoDB Atlas** (official `mongodb` driver) as the primary datastore for content, users, contact logs and the IP/email blacklist
- **JWT** (`jsonwebtoken`) for both the admin session and per‑user sessions, **bcryptjs** for password hashing
- **Stripe** — one‑off `payment`‑mode Checkout for the merch store, recurring `subscription`‑mode Checkout for symbolic animal adoptions, a Billing Portal integration so adopters can manage/cancel their own subscription, and a webhook (`/api/stripe/webhook`) that fulfils orders, sends confirmation emails and awards account XP
- **Printful API** — print‑on‑demand fulfilment for the merch store (product/variant sync via `/api/printful/products`, automatic order creation once a Stripe merch payment succeeds)
- **PayPal** — client‑funded one‑off donations on the Donate page, with the publishable client ID served by the backend (`/api/paypal-config`)
- **Brevo** (Sendinblue) HTTP API — transactional email: contact‑form relay to the team, adoption welcome email + internal adoption alert, order confirmation email
- **Cloudflare Turnstile** — bot verification on the contact form, backed by a MongoDB‑stored IP/email blacklist and an admin endpoint to ban an offender directly from a logged submission

Two server files exist in `backend/`: **`index.js`** is the real, fully‑featured server and the actual entry point (`"main"`/`"start"` in `backend/package.json`); **`server.js`** is a much smaller legacy variant (only PayPal config + admin login) that remains in the repo but is not what's deployed/run.

## Architecture

```
React/Vite SPA  ──fetch──>  Express API (backend/index.js)  ──>  MongoDB Atlas
   (port 5173)                     (port 3001)                       │
        │                            │  │  │                        │
        │                         Stripe PayPal Printful           cms.json
        │                            │              (local fallback/seed)
        └── Stripe.js / PayPal SDK ──┘
                                   Brevo (email) · Turnstile (anti‑spam)
```

The frontend never talks to Stripe/PayPal/Printful/Brevo directly except for loading their client‑side SDKs — all secret‑bearing calls go through the Express API.

## Content management (CMS)

All site copy and per‑section images live in a single JSON document (`{ _id: "cms" }` in the `store` collection on Atlas). On boot, the server:

1. reads `backend/cms.json` as a local seed/fallback,
2. then connects to MongoDB Atlas (if `MONGODB_URI` is set) and **overlays** whatever is already stored there on top of the local data — Atlas wins for any key it already has, while brand‑new keys not yet in Atlas come through from the local file.

The frontend calls `GET /api/content` once on load, feeds the result into i18next, and caches it in `localStorage` for instant rendering on the next visit. Authenticated edits made through the in‑app admin panel (`src/pages/Admin.jsx`, reachable at `/#admin`) are written back to Atlas (or to `cms.json` if no database is configured) via dedicated `PUT /api/cms/*` routes for blog posts, shop products, adoptable animals, the "Our Animals" roster and per‑product price/text overrides.

## Frontend pages

| Route (`#hash`) | Component | What it covers |
|---|---|---|
| *(home)* | `Home.jsx` | Hero, the three pillars (breeding, education, rehabilitation), Cheetah Run teaser, "ways to participate" cards, photo gallery, volunteering pitch, animals teaser, testimonials, chalet/accommodation teaser, donation CTA, contact form |
| `cheetah` | `Cheetah.jsx` | Hub page: Nova's origin story, Cheetah Run overview, breeding programme overview |
| `cheetah-run` | `CheetahRun.jsx` | Dedicated Cheetah Run experience page — how it works, speed/stats, practical info, booking details |
| `nova-story` | `NovaStory.jsx` | The founder cheetah Nova's story and the genetics/outbreeding rationale behind the breeding programme |
| `kim-story` | `KimStory.jsx` | Biography of founder Kim Hiltrop |
| `conservation` | `Conservation.jsx` | Mission statement, environmental education, scientific research, human‑wildlife coexistence work |
| `horses` | `Horses.jsx` | The horse rescue & rehabilitation project |
| `volunteer` | `Volunteer.jsx` | Volunteering programme: what it involves, daily schedule, task list, how to apply |
| `internship` | `Internship.jsx` | University internship programme: fields of specialisation, duration & costs |
| `visit` | `Visit.jsx` | On‑site chalets/accommodation, how to get there, adding the Cheetah Run to a stay |
| `blog` / `blog-post` | `Blog.jsx` / `BlogPost.jsx` | News & stories list and single‑post detail view |
| `adopt` | `Adopt.jsx` | Symbolic animal adoption (Stripe subscription checkout) + a self‑service portal to manage/cancel a subscription |
| `merch` | `Merch.jsx` | Online shop — Printful products sold via Stripe one‑off Checkout |
| `donate` | `Donate.jsx` | One‑off donations via PayPal, preset (€10/€25/€50/€100) or custom amount |
| `wishlist` | `Wishlist.jsx` | Physical‑goods wishlist fulfilled through a shared Takealot list |
| `faq` | `FAQ.jsx` | Categorised FAQ — volunteering, internships, accommodation, on‑site shop, donations |
| `other-animals` | `OtherAnimals.jsx` | Non‑cheetah/horse residents (lions, tigers, small cats, free‑roaming herbivores) and the FeraCare partnership |
| `our-animals` | `OurAnimals.jsx` | Full animal roster across every species cared for at the reserve |
| `user-profile` | `UserProfile.jsx` | Visitor account dashboard: order/adoption history, XP and level progress |
| `admin` | `Admin.jsx` | Password‑protected CMS dashboard for editing all of the above content, images and product/animal listings |

## Other notable features

- **Visitor accounts** — JWT‑based registration/login (`AuthModal.jsx`, `UserContext.jsx`) with order/adoption history and a gamified XP/level system to encourage engagement
- **Chatbase AI chat widget** (`ChatbaseBot.jsx`) and a floating **WhatsApp** button (`WhatsappButton.jsx`) embedded site‑wide for instant visitor support
- Animal detail modals with image galleries/lightbox (`AnimalModal.jsx`, `Lightbox.jsx`), a custom cursor (`Cursor.jsx`), scroll‑reveal animations and animated page transitions throughout

## Project structure

```
.
├── backend/
│   ├── index.js          # main Express server (active entry point)
│   ├── server.js         # minimal legacy server (not used in production)
│   ├── cms.json           # local CMS seed/fallback content
│   └── .env.example
├── public/
│   └── img/                # static site imagery
├── src/
│   ├── components/         # Navbar, Footer, modals, chat/WhatsApp widgets, etc.
│   ├── hooks/               # useScrollReveal, useBodyScrollLock
│   ├── pages/                # one component per route (see table above)
│   ├── App.jsx              # hand-rolled router + global layout
│   ├── CMSContext.jsx       # fetches/caches CMS content, feeds i18next
│   ├── UserContext.jsx      # visitor auth state
│   └── i18n.js
├── index.html
└── vite.config.js
```

## Running locally

**Frontend**

```bash
npm install
npm run dev      # http://localhost:5173
```

**Backend**

```bash
cd backend
npm install
npm start        # http://localhost:3001
```

Without a `MONGODB_URI`, the backend falls back to serving/saving content from `backend/cms.json` and most database‑backed features (accounts, orders, contact logs) will be unavailable.

## Environment variables

**Root `.env` (frontend, Vite)**

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key |

**`backend/.env`**

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Signing secret for admin & user JWTs |
| `ADMIN_PASSWORD` / `ADMIN_PASSWORD_HASH` | Admin login (first‑run setup or pre‑hashed) |
| `ADMIN_RECOVERY_KEY` | Recovery key for admin password reset |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe API & webhook signature verification |
| `PAYPAL_CLIENT_ID` | PayPal client ID served to the Donate page |
| `PRINTFUL_API_KEY` | Printful store API access |
| `BREVO_API_KEY` | Brevo transactional email API |
| `EMAIL_FROM` / `EMAIL_TO` | Sender/recipient addresses for system emails |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile server‑side verification |
| `FRONTEND_URL` / `PORT` | CORS origin and server port |

## Organisation details

Nova's Legacy · Feracare Wildlife Centre — 431 Diepdrift, Bela‑Bela, 0480, Limpopo, South Africa
PBO No. 930069839 · Reg. No. 2018/463513/08
