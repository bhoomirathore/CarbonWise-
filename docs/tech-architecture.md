# CarbonWise Technical Architecture Document

## 1. System Overview

CarbonWise is a web application that helps users:

* Assess their carbon footprint
* Understand emission sources
* Receive personalized recommendations
* Learn sustainability concepts
* Simulate lifestyle changes and their environmental impact

Architecture Style:

* Frontend: Next.js Application
* Backend: Supabase
* Database: PostgreSQL
* Authentication: Supabase Auth
* Hosting: Vercel
* Charts & Analytics: Recharts
* Recommendation Engine: Rule-Based Logic

No AI services are required for MVP.

---

# 2. Recommended Tech Stack

## Frontend

### Next.js (App Router)

Why:

* Modern React framework
* Server Components support
* Excellent performance
* Easy deployment to Vercel
* Scalable architecture

Use For:

* Pages
* Routing
* API routes if required
* Server-side rendering

---

### TypeScript

Why:

* Type safety
* Better maintainability
* Fewer runtime bugs
* Strong integration with Supabase

---

### Tailwind CSS

Why:

* Fast UI development
* Consistent design system
* Mobile responsive by default

---

### shadcn/ui

Why:

* Professional UI components
* Accessible by default
* Highly customizable

Use For:

* Cards
* Dialogs
* Forms
* Navigation
* Tables
* Tabs

---

### Recharts

Why:

* Lightweight
* Easy React integration
* Ideal for analytics dashboards

Use For:

* Pie charts
* Line charts
* Category breakdowns

---

## Backend

### Supabase

Why:

* Authentication
* PostgreSQL database
* Storage
* Security rules
* Auto-generated APIs

Eliminates need for custom backend.

---

## Database

### PostgreSQL

Why:

* Relational data fits assessment model
* Reliable
* Scalable
* Supported natively by Supabase

---

## Deployment

### Vercel

Why:

* Native Next.js support
* Automatic deployments
* Preview environments
* Global CDN

---

# 3. Project Folder Structure

carbonwise/

├── public/
│
├── src/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   │
│   ├── assessment/
│   │   └── page.tsx
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── insights/
│   │   └── page.tsx
│   │
│   ├── simulator/
│   │   └── page.tsx
│   │
│   ├── learn/
│   │   └── page.tsx
│   │
│   └── auth/
│       ├── login/
│       └── signup/
│
├── components/
│   ├── ui/
│   ├── assessment/
│   ├── dashboard/
│   ├── insights/
│   ├── simulator/
│   └── learn/
│
├── lib/
│   ├── supabase.ts
│   ├── carbonCalculator.ts
│   ├── scoreEngine.ts
│   ├── recommendationEngine.ts
│   └── simulatorEngine.ts
│
├── services/
│   ├── assessmentService.ts
│   ├── userService.ts
│   ├── dashboardService.ts
│   └── recommendationService.ts
│
├── hooks/
│
├── types/
│
├── constants/
│
├── utils/
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── .env.local
├── package.json
└── README.md

---

# 4. Database Schema

## users

Stores user information.

Fields:

id UUID Primary Key

email TEXT

name TEXT

created_at TIMESTAMP

updated_at TIMESTAMP

Relationship:

One User → Many Assessments

---

## assessments

Stores completed assessments.

Fields:

id UUID Primary Key

user_id UUID Foreign Key

transport_score NUMERIC

energy_score NUMERIC

food_score NUMERIC

waste_score NUMERIC

total_emissions NUMERIC

carbonwise_score INTEGER

created_at TIMESTAMP

Relationship:

Many Assessments → One User

---

## recommendations

Stores generated recommendations.

Fields:

id UUID Primary Key

assessment_id UUID Foreign Key

category TEXT

title TEXT

description TEXT

estimated_reduction NUMERIC

created_at TIMESTAMP

Relationship:

One Assessment → Many Recommendations

---

## simulations

Stores what-if scenarios.

Fields:

id UUID Primary Key

user_id UUID Foreign Key

assessment_id UUID Foreign Key

scenario_name TEXT

projected_emissions NUMERIC

projected_score INTEGER

reduction_amount NUMERIC

created_at TIMESTAMP

Relationship:

One User → Many Simulations

---

## learn_topics

Stores educational content.

Fields:

id UUID Primary Key

title TEXT

slug TEXT

content TEXT

category TEXT

created_at TIMESTAMP

Examples:

Carbon Basics

How Emissions Work

Reducing Transport Impact

Renewable Energy

---

## myths

Stores Myth Busters content.

Fields:

id UUID Primary Key

myth TEXT

reality TEXT

created_at TIMESTAMP

---

# 5. Database Relationships

users
│
├── assessments
│
├── simulations
│
└── recommendations
│
└── assessments

learn_topics

myths

---

# 6. Core Business Logic Modules

## carbonCalculator.ts

Responsibilities:

* Transport calculations
* Energy calculations
* Food calculations
* Waste calculations
* Total footprint calculations

---

## scoreEngine.ts

Responsibilities:

Generate CarbonWise Score

Input:

Emission values

Output:

0-100 score

---

## recommendationEngine.ts

Responsibilities:

Generate personalized insights

Examples:

High transport emissions

High food emissions

High energy emissions

High waste emissions

---

## simulatorEngine.ts

Responsibilities:

Recalculate emissions

Compare current vs projected footprint

Generate projected CarbonWise score

---

# 7. Environment Variables

Required

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

Optional

SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_APP_URL=

---

# 8. Security Considerations

Enable Supabase Row Level Security (RLS)

Policies:

Users can read only their own assessments

Users can read only their own simulations

Users can read only their own recommendations

Anonymous users can access Learn Hub

---

# 9. Deployment Flow

Developer
↓
GitHub Repository
↓
Vercel Build
↓
Production Application

Database:

Supabase Hosted PostgreSQL

Authentication:

Supabase Auth

---

# 10. Future Scalability Roadmap

Phase 1 (MVP)

* Assessment
* Dashboard
* Insights
* Learn Hub
* What-If Simulator

Phase 2

* User Accounts
* Saved History
* Monthly Reports

Phase 3

* Gamification
* Achievements
* Community Challenges

Phase 4

* AI Sustainability Coach
* Smart Recommendations
* Personalized Action Plans

This architecture comfortably supports thousands of users while remaining simple enough for a small team or solo founder to build and maintain.
