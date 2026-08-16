# GrowForMe Agri Finance Management System

An enterprise-grade agricultural financing, outgrower aggregation, and supply chain ERP tailored for the Ghanaian and African agribusiness ecosystem. Developed by **SmartMusto** for **GrowForMe**.

---

## Key Operational Modules

1. **Budget**: Financial planning, cost categorizations, and seasonal variance tracking.
2. **Partners**: Agribusiness directory with an algorithmic SLA vetting engine (0–100%).
3. **Raise Funds**: Crowd-sponsorship campaign manager with escrow protection and ROI tracking.
4. **Farmers**: Outgrower registration with Ghana Card KYC, Mobile Money accounts, and GIS farm asset profiling.
5. **Inputs**: Digital voucher issuing, warehouse stock inventory, and OTP/QR pickup authentication.
6. **Mechanization**: Real-time Leaflet GIS mapping for tractor telematics, land prep, and drone spraying dispatches.
7. **Harvest**: Farm-gate weighing, moisture/aflatoxin quality grading, and EUDR zero-deforestation certification.
8. **Retrieval**: Commodity waybills and automated in-kind loan recovery offset ledger.
9. **Trade Dept**: Commodity exchange off-taker spot & futures contract fulfillment.
10. **Money Back**: 4-tier revenue waterfall settlement engine (Investors $\rightarrow$ Inputs $\rightarrow$ Aggregator $\rightarrow$ Outgrower MoMo Payouts).

---

## System Utilities & RBAC

- **Reports & Analytics**: Executive revenue charts, farmer payouts, and operational metrics.
- **Calendar & Cycles**: Crop cycle timelines, planting start dates, and harvest windows.
- **Messages & Alerts**: Automated SMS/USSD notification logs and tractor telematics alerts.
- **Documents & Contracts**: Generated legal SLAs, off-taker contracts, and EUDR compliance certificates.
- **Settings & Role Management**: Multi-tenant RBAC (Super Admin, Staff, Field Agent), dynamic custom role creator, user password reset engine, and editable PostgreSQL ORM connection strings.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS (Dark Mode Aesthetic: Emerald `#10B981`, Amber `#F59E0B`, Navy `#0F172A`)
- **Database & ORM**: Prisma ORM v7 (PostgreSQL ready)
- **GIS Mapping**: Leaflet GIS with OpenStreetMap WGS84 tile feeds
- **Charts**: Recharts

---

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the system.

### Database Setup (Optional Live PostgreSQL)

1. Rename `.env.example` to `.env`.
2. Update the `DATABASE_URL` string with your PostgreSQL connection URL.
3. Run Prisma migration / sync:

```bash
npx prisma db push
```

---

## Deployment on Vercel

1. Push this repository to GitHub.
2. Import the project into **Vercel** (`https://vercel.com`).
3. Set the build command to `npm run build` and install command to `npm install`.
4. Add environment variable `DATABASE_URL` if connecting a live PostgreSQL database (Supabase / Neon / AWS RDS).
5. Click **Deploy**.

---

## Copyright & Licensing

© 2026 **GrowForMe Agri Finance Management System**. Developed by **SmartMusto** for **GrowForMe**. All rights reserved.
