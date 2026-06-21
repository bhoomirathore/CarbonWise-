# CarbonWise 🌱

> Understand your impact. Track your progress. Build a greener future.

CarbonWise is a sustainability platform that helps individuals understand, track, and reduce their carbon footprint through a guided assessment, personalized recommendations, and a what-if simulator.

Built for PromptWars Challenge 3.

---

## 🎯 Problem Statement

Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

---

## ✨ Features

### 📊 Carbon Footprint Assessment
Calculates a footprint score from five lifestyle inputs: transport type, weekly transport distance, energy usage, diet type, and waste habits.

### 📈 Insights Dashboard
Ranks which category (Transportation, Energy, Diet, Waste) contributes most to your footprint, with a category-by-category breakdown and trend view across past assessments.

### 💡 Personalized Recommendations
Generates 3–5 prioritized, actionable suggestions based on your specific answers and your largest-contributing category.

### 🎮 What-If Simulator
Lets you adjust your inputs and see how your score and impact level would change before committing to real changes.

### 🏆 Achievements
Unlocks badges for assessment milestones (first assessment, 3 assessments) and for reaching low-footprint score thresholds.

### 📱 Responsive Design
Built with Tailwind CSS for desktop, tablet, and mobile.

---

## 💻 Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Backend / Database:** Supabase (PostgreSQL with Row Level Security)
- **Authentication:** Supabase Auth — Google OAuth and email magic link (no passwords stored or handled directly)
- **Testing:** Vitest, with unit tests and coverage reporting for the core scoring and recommendation logic
- **Icons:** Lucide React

---

## 🏗️ How It Works

```text
User completes assessment (5 inputs)
            │
            ▼
  Rule-based scoring engine
  (carbonCalculator.ts)
            │
            ▼
  Category ranking + insights
  (contributorUtils.ts, insightsEngine.ts)
            │
            ▼
  Personalized recommendations
  (recommendationEngine.ts)
            │
            ▼
  Dashboard, achievements, and
  progress tracking over time
```

The scoring and recommendation logic is deterministic, rule-based TypeScript — not a machine learning model. "Personalized" refers to results being computed from the user's own specific inputs and assessment history, not generic content.

---

## 📂 Project Structure

```text
CarbonWise-/
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── assessment/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── learn/
│   │   ├── profile/
│   │   ├── results/
│   │   └── simulator/
│   ├── components/
│   │   ├── charts/
│   │   ├── shared/          # Navigation, AuthGuard, etc.
│   │   └── ui/
│   ├── lib/                 # Core scoring, recommendation, and insight logic
│   │   └── __tests__/       # Vitest unit tests
│   ├── services/            # Supabase data access
│   └── types/
├── supabase/
│   └── migrations/          # SQL schema and RLS policies
├── docs/                    # Planning documents (PRD, specs)
└── package.json
```

---

## 🚀 Getting Started

### Clone the repository
```bash
git clone https://github.com/bhoomirathore/CarbonWise-.git
cd CarbonWise-
```

### Install dependencies
```bash
npm install
```

### Set up environment variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
You'll need a Supabase project with the migrations in `supabase/migrations/` applied.

### Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Run tests
```bash
npm run test            # run once
npm run test:coverage   # run with coverage report
```

### Build for production
```bash
npm run build
npm run start
```

---

## 🔒 Security Notes

- Database access is enforced server-side via Supabase Row Level Security — every query on the `assessments` table is scoped to `auth.uid() = user_id`.
- Authentication uses Supabase's managed Google OAuth and magic-link flows; this app never stores or handles passwords directly.
- Route-level redirects (e.g. sending a logged-out user to `/auth`) are currently handled client-side. The data itself stays protected by RLS regardless; a server-side session check via Next.js Middleware is a known next step, not yet implemented.
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) are configured in `next.config.ts`.

---

## 🎯 Possible Future Enhancements

- Server-side route protection via Next.js Middleware
- Trend-aware, dynamically-generated insight copy (using actual score history, not just static templates)
- Expanded test coverage for components and the Supabase service layer
- Optional integration of an LLM for free-text habit input or richer recommendation generation

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.