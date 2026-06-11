# CarbonWise Frontend Specification Document

# 1. Frontend Overview

## Product Positioning

CarbonWise should feel like a modern sustainability companion rather than a carbon calculator.

The interface should communicate:

* Trust
* Simplicity
* Clarity
* Progress
* Actionability

Design inspiration:

* Duolingo (simplicity)
* Notion (clean layout)
* Stripe Dashboard (data presentation)
* Apple (spacing and clarity)

---

# 2. Design System

## Color Palette

### Primary Colors

Primary Green

HEX: #166534

Usage:

* Primary buttons
* Navigation highlights
* Key actions

---

Secondary Green

HEX: #10B981

Usage:

* Success states
* Progress indicators
* Score improvements

---

Accent Green

HEX: #34D399

Usage:

* Hover states
* Supporting UI accents

---

## Neutral Colors

Background

HEX: #F8FAFC

---

Surface

HEX: #FFFFFF

---

Border

HEX: #E2E8F0

---

Muted Text

HEX: #64748B

---

Primary Text

HEX: #0F172A

---

## Semantic Colors

Success

HEX: #22C55E

---

Warning

HEX: #F59E0B

---

Error

HEX: #EF4444

---

Info

HEX: #3B82F6

---

# 3. Typography System

## Font Family

Inter

Fallback:

sans-serif

---

## Type Scale

Display

Size: 48px
Weight: 700

Used for:
Landing Page Hero

---

Heading 1

Size: 36px
Weight: 700

Used for:
Page Titles

---

Heading 2

Size: 28px
Weight: 600

Used for:
Section Titles

---

Heading 3

Size: 20px
Weight: 600

Used for:
Card Titles

---

Body Large

Size: 18px
Weight: 400

---

Body

Size: 16px
Weight: 400

---

Caption

Size: 14px
Weight: 400

Color:
Muted Text

---

# 4. Spacing System

Base Unit

4px

---

Spacing Scale

xs = 4px

sm = 8px

md = 16px

lg = 24px

xl = 32px

2xl = 48px

3xl = 64px

---

Section Padding

Desktop

80px top/bottom

---

Tablet

64px top/bottom

---

Mobile

48px top/bottom

---

# 5. Layout Rules

Maximum Content Width

1280px

---

Container Width

1200px

---

Grid

Desktop

12 columns

---

Tablet

8 columns

---

Mobile

4 columns

---

Card Gap

24px

---

Page Gap

32px

---

# 6. Component Specifications

## Primary Button

Style

Background:
#166534

Text:
White

Radius:
12px

Height:
48px

Padding:
16px 24px

---

Hover

Background:
#14532D

---

Disabled

Background:
#CBD5E1

Cursor:
Not Allowed

---

## Secondary Button

Background:
White

Border:
1px solid #E2E8F0

Text:
#0F172A

---

Hover

Background:
#F8FAFC

---

## Input Field

Height:
48px

Border:
#E2E8F0

Radius:
12px

Padding:
12px 16px

---

Focus State

Border:
#10B981

Ring:
2px

---

Error State

Border:
#EF4444

---

## Card Component

Background:
White

Radius:
16px

Padding:
24px

Border:
1px solid #E2E8F0

Shadow:
Small

---

## Modal Component

Max Width:
600px

Radius:
20px

Padding:
32px

Background:
White

Backdrop:
rgba(0,0,0,0.5)

---

# 7. Navigation Specification

Desktop

Top Navigation

Logo

Dashboard

Assessment

Insights

Simulator

Learn

Profile

---

Mobile

Bottom Navigation

Dashboard

Insights

Simulator

Learn

Profile

---

# 8. Dashboard UI Specification

## CarbonWise Score Card

Large score display

Example:

74/100

Color changes based on score

80+

Green

60-79

Amber

Below 60

Red

---

## Footprint Card

Display

285 kg CO₂/month

---

## Breakdown Chart

Pie Chart

Data:

Transport

Energy

Food

Waste

---

## Recommendation Card

Displays:

Title

Impact Level

Estimated Reduction

Explanation

---

# 9. Assessment Flow Specification

Step 1

Transportation

---

Step 2

Energy

---

Step 3

Food

---

Step 4

Waste

---

Progress Bar

Visible on every step

---

Navigation

Previous

Next

Submit

---

# 10. What-If Simulator Specification

Interactive Controls

Transport Usage

Energy Usage

Food Habits

Waste Reduction

---

Live Result Panel

Current Footprint

New Footprint

Estimated Reduction

Updated Score

---

# 11. Learn Hub Specification

Content Cards

Title

Short Description

Read More

---

Topic Categories

Carbon Basics

Transportation

Energy

Food

Waste

---

# 12. Myth Busters Specification

Card Layout

Myth

Reality

Explanation

---

Accordion Interaction

Expand / Collapse

---

# 13. Accessibility Requirements

WCAG AA Compliance

Keyboard Navigation

Visible Focus States

Color Contrast Compliance

Semantic HTML

ARIA Labels

Screen Reader Compatibility

Responsive Layouts

---

# 14. Third-Party Service Architecture

## Service 1: Supabase

Purpose

Authentication

Database

Session Management

---

Environment Variables

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

---

Frontend Library

@supabase/supabase-js

---

Authentication Actions

Sign In

Sign Out

Session Validation

Retrieve User

---

Expected Authentication Response

User Object

{
id,
email,
created_at
}

---

## Service 2: PostgreSQL (via Supabase)

Purpose

Persistent Data Storage

---

Tables

users

assessments

---

Assessment Record Structure

{
id,
user_id,
transport_score,
energy_score,
food_score,
waste_score,
total_footprint,
carbonwise_score,
created_at
}

---

Create Assessment Operation

Data Sent

Assessment Object

Expected Response

Created Record

---

Fetch Dashboard Operation

Data Sent

Authenticated User ID

Expected Response

Latest Assessment Record

---

## Service 3: Recharts

Purpose

Data Visualization

---

Components Used

PieChart

Pie

Tooltip

Legend

ResponsiveContainer

---

Input Data

[
{
category: "Transport",
value: 120
},
{
category: "Energy",
value: 80
}
]

---

Output

Interactive Chart Rendering

---

## Service 4: Vercel

Purpose

Hosting

Deployment

Build Pipeline

---

Build Command

npm run build

---

Output

Production Deployment URL

---

# 15. API Layer Specification

CarbonWise will use a Backend-for-Frontend pattern.

The frontend should not perform calculations directly inside UI components.

Business logic should live inside service modules.

---

Service Modules

carbonCalculator.ts

recommendationEngine.ts

simulatorEngine.ts

---

Function Contract

calculateCarbonFootprint()

Input

Assessment Responses

Output

{
transport,
energy,
food,
waste,
total
}

---

generateRecommendations()

Input

Assessment Results

Output

Array of Recommendations

---

simulateScenario()

Input

Assessment Results +
User Changes

Output

{
currentFootprint,
projectedFootprint,
reductionAmount,
updatedScore
}

---

# 16. Frontend Performance Requirements

Initial Page Load

Less than 3 seconds

---

Lighthouse Score

90+

Performance

90+

Accessibility

95+

Best Practices

90+

SEO

90+

---

# 17. Launch-Ready Definition

CarbonWise is considered frontend complete when:

* All routes implemented
* Responsive on mobile and desktop
* Assessment flow operational
* Dashboard operational
* Insights operational
* Simulator operational
* Learn Hub operational
* Myth Busters operational
* Accessibility audit passed
* Lighthouse score above target
* Production deployment successful
* No critical console errors
