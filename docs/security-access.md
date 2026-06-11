# CarbonWise Security & Access Document

## 1. Security Philosophy

CarbonWise is an educational sustainability platform, not a financial, healthcare, or government system.

The goal is to:

* Protect user data
* Prevent unauthorized access
* Ensure users only see their own information
* Keep implementation simple and maintainable

Security should be strong enough for production use while remaining practical for an early-stage product.

---

# 2. Authentication Strategy

## Recommended Authentication Method

Supabase Authentication using:

* Google Sign-In
* Email Magic Link

### Why This Approach?

Benefits:

* No password storage required
* Reduced security risks
* Faster user onboarding
* Trusted authentication provider
* Easy integration with Supabase

### Authentication Flow

1. User clicks Sign In
2. User selects Google or Email Magic Link
3. Supabase verifies identity
4. Session is created
5. User gains access to personal dashboard and saved assessments

---

# 3. User Roles

CarbonWise only needs two roles.

Keeping roles simple reduces security mistakes.

---

## Role 1: User

Purpose:
Regular application user.

Can:

✅ Create an account

✅ Complete assessments

✅ View personal dashboard

✅ View personal recommendations

✅ Use What-If Simulator

✅ Read Learn Hub content

✅ Read Myth Busters content

✅ Save personal assessments

Can Not:

❌ View other users' data

❌ Modify other users' assessments

❌ Access admin tools

❌ Delete database records directly

---

## Role 2: Admin

Purpose:
Application owner.

Can:

✅ View platform analytics

✅ Manage educational content

✅ Manage myth library

✅ Review platform health

Can Not:

❌ Modify user authentication records directly

❌ View sensitive session tokens

---

# 4. Database Security Model

## Core Tables

### users

Stores:

* User ID
* Email
* Created Date

---

### assessments

Stores:

* Assessment ID
* User ID
* Transport Score
* Energy Score
* Food Score
* Waste Score
* CarbonWise Score
* Total Footprint
* Created Date

---

### myths

Stores:

* Myth
* Reality
* Category

---

### learn_content

Stores:

* Title
* Description
* Category

---

# 5. Row-Level Security (RLS)

Row-Level Security is the most important protection in CarbonWise.

It ensures users can only access their own records.

---

## Users Table

Rule:

A user can only view their own profile.

Example:

User A cannot access User B's profile.

---

## Assessments Table

Rule:

A user can only:

* Create their own assessments
* View their own assessments
* Update their own assessments
* Delete their own assessments

Example:

User A cannot view User B's footprint history.

---

## Learn Content

Rule:

Everyone can read.

Only admins can modify.

---

## Myth Library

Rule:

Everyone can read.

Only admins can modify.

---

# 6. Data Protection Rules

## Store Minimum Data

Only collect:

* Email
* Assessment results
* CarbonWise scores

Do NOT collect:

* Phone numbers
* Home addresses
* Payment information
* Government IDs

---

## Never Store Passwords

Authentication is managed by Supabase.

CarbonWise never handles passwords directly.

---

## HTTPS Only

All communication must occur over HTTPS.

No unsecured traffic allowed.

---

# 7. Error Handling Guide

Users should never see technical errors.

Always show human-friendly messages.

---

## Authentication Failure

Cause:

* Expired login link
* Login cancellation
* Provider outage

User Message:

"Unable to sign in. Please try again."

Log:

Authentication error details.

---

## Assessment Submission Failure

Cause:

* Database unavailable
* Network issue

User Message:

"We couldn't save your assessment. Please try again."

Log:

Database write failure.

---

## Carbon Calculation Failure

Cause:

* Invalid data
* Missing values

User Message:

"We couldn't calculate your footprint. Please review your answers."

Log:

Calculation error details.

---

## Dashboard Loading Failure

Cause:

* Data retrieval issue

User Message:

"Unable to load your dashboard right now."

Log:

Database read error.

---

## Simulator Failure

Cause:

* Invalid scenario values

User Message:

"Unable to generate simulation results."

Log:

Simulation calculation error.

---

## Learn Hub Failure

Cause:

* Content retrieval issue

User Message:

"Learning content is temporarily unavailable."

Log:

Content loading error.

---

# 8. Security Logging

Record:

* Login attempts
* Authentication failures
* Database errors
* API failures
* Unexpected application crashes

Do NOT record:

* Session tokens
* Passwords
* Authentication secrets

---

# 9. Launch Readiness Edge Cases

## Authentication Edge Cases

* User closes login popup
* User cancels Google sign-in
* Expired magic link
* Session expiration
* Multiple browser tabs

---

## Assessment Edge Cases

* User refreshes page mid-assessment
* User skips required questions
* User submits incomplete assessment
* User navigates backward during assessment
* User double-clicks submit button

---

## Calculation Edge Cases

* Missing category values
* Zero-emission responses
* Extremely high-emission responses
* Invalid assessment data

---

## Dashboard Edge Cases

* First-time user with no assessments
* Missing historical data
* Corrupted assessment record

---

## Simulator Edge Cases

* User selects no changes
* User selects maximum reductions
* User selects conflicting options

---

## Database Edge Cases

* Failed insert operation
* Failed update operation
* Network interruption
* Duplicate assessment submission

---

## Content Edge Cases

* Missing Learn Hub article
* Missing myth entry
* Empty content response

---

# 10. Security Checklist Before Launch

Authentication

✅ Google Sign-In tested

✅ Magic Link tested

✅ Session persistence verified

---

Authorization

✅ Users can only access their own data

✅ Row-Level Security enabled

✅ Admin permissions verified

---

Application Security

✅ Environment variables protected

✅ HTTPS enabled

✅ Sensitive information hidden

---

Error Handling

✅ User-friendly messages implemented

✅ Error logging enabled

✅ No raw stack traces exposed

---

Testing

✅ Authentication testing completed

✅ Assessment testing completed

✅ Dashboard testing completed

✅ Simulator testing completed

✅ Security edge cases validated

---

# Recommended Security Scope for CarbonWise

For Version 1:

* Supabase Authentication
* Row-Level Security
* HTTPS
* User/Admin roles
* Secure error handling
* Minimal data collection

Nothing more is required for a challenge-quality launch.

This provides strong security while keeping implementation manageable within the project timeline.

