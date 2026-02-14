# EWC Calgary Platform — Build Plan

---

## 📋 RESEARCH SUMMARY

### Church Identity

| Field | Detail |
|---|---|
| **Full Name** | Empowerment Worship Centre (EWC) |
| **Also Known As** | EWC Prayer Factory |
| **Type** | Pentecostal / Charismatic |
| **Headquarters** | Accra, Ghana (Dzorwulu, Obasanjo Highway) |
| **Global Website** | empowermentworshipcentre.org |
| **Mandate** | "A Bible-believing church with a mandate to win souls and prepare them for the soon coming of Christ" |
| **Core Values** | Holiness, Prayer, Grace, Integrity, Service, Community, Order |

### Global Lead Pastor — Prophet Gideon Danso

- Prophet, Pastor, Bible Teacher, International Conference Speaker, Business Visionary, Mentor
- Founder & Global Lead Pastor of Empowerment Worship Centre, Accra-Ghana
- Founder of Empowerment Ministries Worldwide
- Also founded Empowerment Care Foundation (medical & educational outreach)
- His messages center on: **holiness, prayer, Grace, integrity, service, community, order, knowing God's will**
- Married to Lady Gina Danso (née Gina Nipah)
- Instagram: **@gideondanso_**
- Facebook: **facebook.com/GideonDansoMinistries** (68K+ followers)

### Calgary Campus (Canada)

| Field | Detail |
|---|---|
| **Campus Name** | EWC Calgary (Canada Campus) |
| **Campus Pastor** | Humphrey Lomotey (listed on HQ site as Humphrey Nii Lomo Annan) |
| **Location** | 225 Chaparral Drive SE, Calgary, Alberta |
| **Status** | Currently listed as "Online" on HQ, transitioning to in-person |
| **This Platform** | Official website for the Calgary campus |

### EWC International Campuses (Context)

- **Global HQ** — Accra, Ghana (Prayer Factory)
- **London, UK** — St George's Catholic School, Maida Vale
- **New Jersey, USA** — Elizabeth, NJ
- **Berlin, Germany** — Laurentiuskirche
- **Canada (Calgary)** — 225 Chaparral Drive SE
- **15+ Ghana campuses** (West Hills, Achimota, Ridge, Takoradi, etc.)

### EWC Ministries & Programs (from HQ — adapt for Calgary)

| Ministry | Description |
|---|---|
| **EWC Kidz Church** | Children ages 0–13, leadership development |
| **EWC FIXED Teens** | Teens ages 13–19, youth ministry |
| **EWC 4.12 Young Adults** | Ages 19–30, based on 1 Timothy 4:12 |
| **EWC LIVE Worship** | Music & worship ministry |
| **EWC Creative Army** | Branding, media, design, film, photography, broadcasting |
| **Community Circles** | Small groups — Love, Faith, Hope, Grace, Favour |
| **Discovery Class** | New members orientation |
| **Family Matters** | Marriages, child dedications, anniversaries, funerals |

### Community Circle System

- **Vision:** Create an atmosphere where today's person is born, grows, serves, and leads others
- **5 Communities:** Love • Faith • Hope • Grace • Favour
- **4 Objectives:** Connection, Conversation, Care, Accountability
- **Meetings:** Weekly small group gatherings

### Social Media & Streaming (Global EWC Handles)

| Platform | Handle/Link |
|---|---|
| **Instagram** | @empowermentworshipcentre |
| **YouTube** | youtube.com/c/EmpowermentWorshipCentre (66.9K subscribers) |
| **Facebook** | facebook.com/ewclife |
| **Twitter/X** | @ewclife |
| **Gideon Danso IG** | @gideondanso_ |

### Key Conferences & Events

- **Heaven on Earth Conference** (annual flagship)
- **Empowerment Conference**
- **Jesus Saves High School Tour** (teen evangelism)
- **Gideon's Army** (spiritual warfare program)
- **Christ Arena**
- **Stand In The Gap (SITG)**
- **EWC Fasting** (corporate fasting seasons)

### Branding & Visual Identity

| Element | Detail |
|---|---|
| **Primary Background** | Dark / Deep Black (#0a0a0a) |
| **Text Color** | Clean White (#ffffff) |
| **Accent** | Warm Gold (#c9a84c) — consistent across EWC media |
| **Secondary Accent** | Soft Cream / Off-White |
| **Style** | Modern, minimalist, bold, premium feel |
| **Typography** | Clean sans-serif (similar to Montserrat / Inter) |
| **Photography** | High-contrast, dark-toned, worship atmosphere |
| **Overall Aesthetic** | Luxury church branding — dark, elegant, impactful |

---

## 🏗️ TECHNOLOGY STACK

| Layer | Technology | Reason |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR, API routes, SEO, performance |
| **Language** | TypeScript | Type safety, maintainability, scalability |
| **Styling** | Tailwind CSS | Rapid UI development, responsive design |
| **Database** | SQLite via Prisma ORM | Zero-config, portable, easy deployment |
| **Auth** | NextAuth.js | Admin dashboard authentication |
| **Email** | Nodemailer (SMTP) | Volunteer confirmation emails |
| **Forms** | React Hook Form + Zod | Validation, type-safe forms |
| **Live Stream** | YouTube iframe embed | Direct integration with EWC YouTube |
| **Payments** | Stripe (Seeds/Donations) | Secure, PCI-compliant, recurring support |
| **Deployment** | Vercel (recommended) | Free tier, Next.js native, CDN |

---

## 📐 PHASED BUILD PLAN

---

### PHASE 1 — Foundation & Core Pages
**Estimated effort: ~3–4 hours**

#### 1.1 Project Setup
- [ ] Initialize Next.js 14 with TypeScript
- [ ] Configure Tailwind CSS with EWC brand colors
- [ ] Set up project folder structure
- [ ] Configure fonts (Inter / Montserrat)
- [ ] Create shared layout (Header, Footer, Navigation)

#### 1.2 Home Page (`/`)
- [ ] Hero section with welcome message & church tagline
- [ ] "A Bible-believing church with a mandate to win souls..."
- [ ] Campus Pastor welcome from Humphrey Lomotey
- [ ] Service times display
- [ ] Quick links to key sections (About, Volunteer, Give, Watch Live)
- [ ] Upcoming events preview
- [ ] Community Circles preview
- [ ] Instagram/social feed embed section

#### 1.3 About Page (`/about`)
- [ ] About EWC Calgary — campus story, vision, mission
- [ ] Connection to EWC Global (Accra HQ)
- [ ] Mandate & core values section
- [ ] Community Circles explanation (Love, Faith, Hope, Grace, Favour)
- [ ] History / timeline of EWC

#### 1.4 Contact Page (`/contact`)
- [ ] Address: 225 Chaparral Drive SE, Calgary, Alberta
- [ ] Google Maps embed
- [ ] Contact form (name, email, subject, message)
- [ ] Service times
- [ ] Social media links
- [ ] Campus Pastor info

---

### PHASE 2 — Leadership & Ministries
**Estimated effort: ~2–3 hours**

#### 2.1 Leadership Page (`/leadership`)
- [ ] Global Lead Pastor — Prophet Gideon Danso (bio, photo placeholder)
- [ ] Lady Gina Danso — First Lady bio
- [ ] Campus Pastor — Humphrey Lomotey (bio, photo placeholder)
- [ ] Local leadership team section (expandable as team grows)

#### 2.2 Ministries / Departments Page (`/ministries`)
- [ ] EWC Kidz Church (Calgary)
- [ ] EWC FIXED Teens (Calgary)
- [ ] EWC 4.12 Young Adults (Calgary)
- [ ] EWC LIVE Worship (Calgary)
- [ ] Creative / Media Team
- [ ] Ushering / Protocol
- [ ] Technical / Sound
- [ ] Community Circles (with the 5 communities)
- [ ] Each ministry card: name, description, leader (placeholder), meeting times

#### 2.3 Events Page (`/events`)
- [ ] Upcoming events list with date, time, location
- [ ] Event detail view
- [ ] Past events archive
- [ ] RSVP functionality (basic form)
- [ ] Integration ready for conferences (Heaven on Earth, etc.)

---

### PHASE 3 — Sermons / Media & Live Stream
**Estimated effort: ~2–3 hours**

#### 3.1 Sermons & Media Page (`/sermons`)
- [ ] YouTube video embed grid (from EWC YouTube channel)
- [ ] Filter by series, speaker, date
- [ ] Search functionality
- [ ] Featured/latest sermon hero section
- [ ] Audio sermon support (future)

#### 3.2 Live Stream Integration (`/live`)
- [ ] Embedded YouTube live player
- [ ] Live status indicator (LIVE NOW badge)
- [ ] Service schedule display
- [ ] "Watch on YouTube" fallback link
- [ ] Chat/interaction link to YouTube live chat
- [ ] Past streams archive

---

### PHASE 4 — Volunteer Registration System
**Estimated effort: ~4–5 hours**

#### 4.1 Database Setup
- [ ] Prisma schema for volunteers, departments, assignments
- [ ] SQLite database initialization
- [ ] Seed data for departments

#### 4.2 Volunteer Sign-Up Form (`/volunteer`)
- [ ] Multi-step registration form:
  - **Step 1:** Personal Info (name, email, phone, age range)
  - **Step 2:** Department Selection (multi-select checkboxes):
    - Media / Creative
    - Ushering / Protocol
    - Choir / Worship Team
    - Technical / Sound
    - Kidz Church
    - FIXED Teens
    - 4.12 Young Adults
    - Hospitality
    - Community Circle Leader
    - Prayer Team
  - **Step 3:** Skills & Experience (text area, relevant skills checkboxes)
  - **Step 4:** Availability (days of week, service times preference)
  - **Step 5:** Review & Submit
- [ ] Form validation with Zod
- [ ] Success confirmation page
- [ ] Duplicate email detection

#### 4.3 Automated Confirmation Email
- [ ] Nodemailer SMTP setup
- [ ] HTML email template (EWC branded — dark + gold)
- [ ] Confirmation email on successful registration
- [ ] Admin notification email on new volunteer

#### 4.4 API Routes
- [ ] `POST /api/volunteers` — Submit new volunteer
- [ ] `GET /api/volunteers` — List volunteers (admin only)
- [ ] `PATCH /api/volunteers/[id]` — Update volunteer status
- [ ] `GET /api/departments` — List departments
- [ ] `POST /api/departments/[id]/assign` — Assign volunteer to department

---

### PHASE 5 — Admin Dashboard
**Estimated effort: ~5–6 hours**

#### 5.1 Authentication
- [ ] NextAuth.js setup with credentials provider
- [ ] Admin login page (`/admin/login`)
- [ ] Protected routes middleware
- [ ] Session management

#### 5.2 Dashboard Home (`/admin`)
- [ ] Overview stats: total volunteers, pending, assigned, by department
- [ ] Recent volunteer registrations
- [ ] Quick action buttons

#### 5.3 Volunteer Management (`/admin/volunteers`)
- [ ] Volunteer list with search, filter, sort
- [ ] Status badges: Pending, Approved, Assigned, Inactive
- [ ] Individual volunteer detail view
- [ ] Assign to department(s)
- [ ] Edit volunteer info
- [ ] Export to CSV
- [ ] Bulk actions (approve, assign, deactivate)

#### 5.4 Department Management (`/admin/departments`)
- [ ] List all departments
- [ ] View volunteers per department
- [ ] Add/edit department details
- [ ] Department leader assignment

#### 5.5 Events Management (`/admin/events`)
- [ ] Create/edit/delete events
- [ ] Event RSVP list view
- [ ] Publish/unpublish toggle

#### 5.6 Sermon Management (`/admin/sermons`)
- [ ] Add YouTube video links
- [ ] Categorize by series/speaker
- [ ] Feature/unfeature sermons

---

### PHASE 6 — Seeds / Donation System
**Estimated effort: ~4–5 hours**

#### 6.1 Give / Seeds Page (`/give`)
- [ ] Giving categories:
  - Tithes
  - Offering
  - Seeds (special giving)
  - Building Fund
  - Missions
  - Community Projects
- [ ] Stripe Checkout integration
- [ ] One-time and recurring giving options
- [ ] Custom amount input
- [ ] Mobile-optimized giving experience
- [ ] Giving testimony section (optional)

#### 6.2 Payment Processing
- [ ] Stripe API integration (server-side)
- [ ] Webhook handling for payment confirmation
- [ ] Payment receipt email
- [ ] Giving history (for logged-in users, future)

#### 6.3 Admin Giving Dashboard (`/admin/giving`)
- [ ] Total giving overview
- [ ] Giving by category breakdown
- [ ] Transaction history
- [ ] Export reports

---

## 📁 PROJECT STRUCTURE

```
ewc-calgary/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # Seed data
├── public/
│   ├── images/                # Static images
│   ├── fonts/                 # Custom fonts
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (header, footer)
│   │   ├── page.tsx           # Home page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── leadership/
│   │   │   └── page.tsx
│   │   ├── ministries/
│   │   │   └── page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── sermons/
│   │   │   └── page.tsx
│   │   ├── live/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── volunteer/
│   │   │   ├── page.tsx       # Registration form
│   │   │   └── success/page.tsx
│   │   ├── give/
│   │   │   ├── page.tsx       # Donation page
│   │   │   └── success/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx     # Admin layout
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── volunteers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── departments/
│   │   │   │   └── page.tsx
│   │   │   ├── events/
│   │   │   │   └── page.tsx
│   │   │   ├── sermons/
│   │   │   │   └── page.tsx
│   │   │   └── giving/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── volunteers/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── departments/
│   │       │   └── route.ts
│   │       ├── events/
│   │       │   └── route.ts
│   │       ├── sermons/
│   │       │   └── route.ts
│   │       ├── contact/
│   │       │   └── route.ts
│   │       ├── give/
│   │       │   ├── route.ts
│   │       │   └── webhook/route.ts
│   │       └── email/
│   │           └── route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Table.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── ServiceTimes.tsx
│   │   │   ├── EventsPreview.tsx
│   │   │   └── SocialFeed.tsx
│   │   ├── volunteer/
│   │   │   ├── VolunteerForm.tsx
│   │   │   └── StepIndicator.tsx
│   │   ├── admin/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── VolunteerTable.tsx
│   │   │   └── DepartmentCard.tsx
│   │   └── give/
│   │       ├── DonationForm.tsx
│   │       └── GivingCategories.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   ├── email.ts           # Nodemailer setup
│   │   ├── stripe.ts          # Stripe config
│   │   └── utils.ts           # Utility functions
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── styles/
│       └── globals.css        # Tailwind base + custom styles
├── .env.local                 # Environment variables
├── .env.example               # Env template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🎨 DESIGN SYSTEM (EWC Brand)

### Color Palette

```
Primary Black:     #0a0a0a   (backgrounds, hero sections)
Deep Charcoal:     #1a1a1a   (card backgrounds, sections)
Medium Gray:       #2a2a2a   (borders, subtle dividers)
Light Gray:        #888888   (secondary text)
White:             #ffffff   (primary text, headings)
Off-White:         #f5f5f0   (body text on dark)
Gold Accent:       #c9a84c   (buttons, highlights, links)
Gold Hover:        #d4b65e   (button hover states)
Dark Gold:         #a68a3a   (pressed/active states)
Success Green:     #22c55e   (confirmations)
Error Red:         #ef4444   (form errors)
```

### Typography

```
Headings:          Montserrat (Bold / Semibold)
Body:              Inter (Regular / Medium)
Accent/Labels:     Montserrat (Medium / Uppercase tracking)
```

### Component Style

- Dark, premium, cinematic feel
- Large hero images with dark overlays
- Gold accent CTAs on dark backgrounds
- Subtle animations (fade-in, slide-up)
- Generous whitespace
- Full-width sections with contained content (max-w-7xl)

---

## ⚙️ ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Admin Credentials (initial setup)
ADMIN_EMAIL="admin@ewccalgary.ca"
ADMIN_PASSWORD="change-this-password"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="EWC Calgary <noreply@ewccalgary.ca>"

# Stripe (Donations)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# YouTube (Live Stream)
YOUTUBE_CHANNEL_ID="UCzTCJDP5Zf7BdpwduuYSNuQ"
```

---

## 🚀 DEPLOYMENT PLAN

| Stage | Platform | Purpose |
|---|---|---|
| **Development** | localhost:3000 | Local dev & testing |
| **Staging** | Vercel Preview | Review before go-live |
| **Production** | Vercel + Custom Domain | ewccalgary.ca (or similar) |

---

## 📊 BUILD PRIORITY & DEPENDENCIES

```
Phase 1 ──→ Phase 2 ──→ Phase 3
   │                        │
   └────────────────────────┴──→ Phase 4 ──→ Phase 5
                                                │
                                                └──→ Phase 6
```

- **Phases 1–3** are public-facing pages (can go live immediately)
- **Phase 4** requires database setup (Prisma + SQLite)
- **Phase 5** requires Phase 4 + authentication
- **Phase 6** requires Stripe account setup

---

## ✅ READY TO BUILD

Review this plan and confirm to begin **Phase 1**. Each phase will be built completely and tested before moving to the next.
