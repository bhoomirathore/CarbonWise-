# CarbonWise Carbon Calculation & Recommendation Rules Specification

# 1. Purpose

This document defines:

* Assessment questions
* Answer options
* Emission scoring logic
* CarbonWise Score formula
* Emission category calculations
* Recommendation rules
* What-If Simulator rules
* User result classifications

This document serves as the single source of truth for all CarbonWise calculations.

---

# 2. Calculation Philosophy

CarbonWise is an educational estimation tool.

Goals:

* Simple
* Consistent
* Explainable
* Easy to understand

The platform does NOT attempt to provide scientifically precise carbon accounting.

Instead, it provides realistic lifestyle-based estimates and actionable guidance.

---

# 3. Assessment Structure

Assessment contains four categories:

1. Transportation
2. Energy Consumption
3. Food Habits
4. Waste Management

Each answer contributes points.

Higher points = Higher emissions.

---

# 4. Transportation Assessment

## Question 1

What is your primary mode of transport?

Options:

Walking = 0

Cycling = 0

Public Transport = 15

Bike/Scooter = 30

Car = 50

---

## Question 2

How far do you travel on a typical day?

Less than 5 km = 5

5–15 km = 15

15–30 km = 30

More than 30 km = 50

---

## Question 3

How often do you use public transport?

Frequently = 0

Sometimes = 10

Rarely = 20

Never = 30

---

Transportation Score Formula

transportScore =
Q1 + Q2 + Q3

Maximum Possible Transport Score

130

---

# 5. Energy Assessment

## Question 1

How many AC units are regularly used in your home?

None = 0

1 AC = 15

2 ACs = 30

3+ ACs = 45

---

## Question 2

Average daily AC usage?

Less than 2 hours = 5

2–5 hours = 15

5–8 hours = 30

More than 8 hours = 45

---

## Question 3

How would you describe your electricity usage?

Low = 10

Average = 25

High = 40

---

Energy Score Formula

energyScore =
Q1 + Q2 + Q3

Maximum Possible Energy Score

130

---

# 6. Food Assessment

## Question 1

What best describes your diet?

Vegan = 0

Vegetarian = 10

Eggetarian = 20

Non-Vegetarian = 40

---

## Question 2

How often do you consume meat?

Never = 0

Once a week = 10

2–4 times a week = 25

Daily = 40

---

## Question 3

How often do you order food online?

Rarely = 5

Weekly = 15

Several times a week = 25

Daily = 40

---

Food Score Formula

foodScore =
Q1 + Q2 + Q3

Maximum Possible Food Score

120

---

# 7. Waste Assessment

## Question 1

Do you recycle?

Always = 0

Sometimes = 10

Rarely = 20

Never = 35

---

## Question 2

How often do you use single-use plastics?

Rarely = 5

Sometimes = 15

Frequently = 30

---

## Question 3

Do you carry reusable bags or bottles?

Always = 0

Sometimes = 10

Never = 25

---

Waste Score Formula

wasteScore =
Q1 + Q2 + Q3

Maximum Possible Waste Score

90

---

# 8. Total Footprint Calculation

totalScore =
transportScore +
energyScore +
foodScore +
wasteScore

Maximum Possible Score

470

---

# 9. Carbon Footprint Conversion

The application converts totalScore into estimated monthly emissions.

Formula:

monthlyFootprint =
totalScore × 2

Example:

totalScore = 150

monthlyFootprint = 300 kg CO₂/month

---

# 10. CarbonWise Score Formula

Purpose:

Provide an easy-to-understand sustainability score.

Formula:

carbonWiseScore =
100 - ((totalScore / 470) × 100)

Round to nearest whole number.

Example:

totalScore = 150

Score = 68

---

Minimum Score

0

Maximum Score

100

---

# 11. Score Categories

90–100

Excellent

Color:
Green

Message:

Your lifestyle currently has a relatively low carbon footprint.

---

75–89

Good

Color:
Green

Message:

You are doing well but still have opportunities to improve.

---

50–74

Moderate

Color:
Amber

Message:

Several lifestyle changes could significantly reduce your footprint.

---

0–49

High Impact

Color:
Red

Message:

Your footprint is relatively high and should be prioritized for improvement.

---

# 12. Emission Breakdown Percentages

Each category percentage is calculated as:

categoryPercentage =
(categoryScore / totalScore) × 100

Used for:

Dashboard

Pie Charts

Insights

Recommendations

Simulator

---

# 13. Recommendation Engine

Recommendations are generated based on highest category contributors.

Maximum Recommendations Returned

3

Priority Order

Highest percentage first.

---

# 14. Transportation Recommendations

Trigger:

transportPercentage > 35%

Recommendation A

Use public transport more often.

Estimated Reduction

15–20 kg CO₂/month

---

Recommendation B

Combine multiple errands into one trip.

Estimated Reduction

10–15 kg CO₂/month

---

Recommendation C

Walk or cycle for short trips.

Estimated Reduction

5–10 kg CO₂/month

---

# 15. Energy Recommendations

Trigger:

energyPercentage > 35%

Recommendation A

Reduce AC usage by one hour daily.

Estimated Reduction

10–15 kg CO₂/month

---

Recommendation B

Switch to energy-efficient appliances.

Estimated Reduction

15–25 kg CO₂/month

---

Recommendation C

Turn off unused electronics.

Estimated Reduction

5–10 kg CO₂/month

---

# 16. Food Recommendations

Trigger:

foodPercentage > 30%

Recommendation A

Reduce meat consumption by one meal per week.

Estimated Reduction

10–20 kg CO₂/month

---

Recommendation B

Reduce food delivery frequency.

Estimated Reduction

5–10 kg CO₂/month

---

Recommendation C

Minimize food waste.

Estimated Reduction

5–15 kg CO₂/month

---

# 17. Waste Recommendations

Trigger:

wastePercentage > 20%

Recommendation A

Recycle more consistently.

Estimated Reduction

5–10 kg CO₂/month

---

Recommendation B

Reduce single-use plastic usage.

Estimated Reduction

5–15 kg CO₂/month

---

Recommendation C

Carry reusable bags and bottles.

Estimated Reduction

3–5 kg CO₂/month

---

# 18. Recommendation Explanation Format

Every recommendation must include:

Title

Estimated Impact

Category

Explanation

Example:

Title:
Reduce AC Usage

Impact:
10–15 kg CO₂/month

Explanation:
Energy consumption contributes 42% of your total footprint. Reducing AC usage can lower overall emissions.

---

# 19. What-If Simulator Rules

Simulator uses percentage reductions.

---

Use Public Transport More

Transport Score Reduction

-15%

---

Walk/Cycle Short Trips

Transport Score Reduction

-10%

---

Reduce AC Usage

Energy Score Reduction

-15%

---

Use Energy Efficient Appliances

Energy Score Reduction

-20%

---

Reduce Meat Consumption

Food Score Reduction

-20%

---

Reduce Food Delivery

Food Score Reduction

-10%

---

Recycle More Frequently

Waste Score Reduction

-15%

---

Reduce Plastic Usage

Waste Score Reduction

-10%

---

# 20. Simulator Output

Display:

Current Footprint

Projected Footprint

Reduction Amount

Current Score

Projected Score

Improvement Percentage

---

# 21. Edge Cases

If totalScore = 0

Set:

monthlyFootprint = 0

carbonWiseScore = 100

---

Prevent:

Negative scores

Negative emissions

Division by zero

Null category values

Missing assessment answers

---

# 22. Validation Rules

Every assessment question is required.

Users cannot submit incomplete assessments.

Values must always be selected from predefined options.

No free-text assessment inputs allowed.

---

# 23. Future Expansion Compatibility

The engine should support:

Additional questions

Regional emission factors

Country-specific calculations

Historical tracking

Advanced scoring systems

Without requiring major refactoring.

Current implementation should isolate all constants and scoring values into a dedicated configuration file.

Suggested File:

/lib/calculation-rules.ts

All scoring values, recommendation thresholds, and simulator reductions should be stored in configuration rather than hardcoded into UI components.
