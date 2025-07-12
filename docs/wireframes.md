# RxLedger Wireframes

Below are the wireframes for the six main screens of the RxLedger application. Each section includes an ASCII wireframe and a brief explanation of the screen's purpose and elements.

---

## 1a. Updated Dashboard Wireframe

```
-------------------------------------------------------
|  RxLedger                       [User Avatar]    |
-------------------------------------------------------
|  [Today] [Week] [Month]                              |
-------------------------------------------------------
|  [Medication Manufacturer Chart]                    |
|  - Current manufacturer: Pfizer                     |
|  - Notice: New manufacturer detected!               |
-------------------------------------------------------
|  [Overall Feeling / Mood / Energy Chart]            |
-------------------------------------------------------
|  [Side Effects Tracking Chart]                      |
|  - Time range selector: Day / Week / Month          |
-------------------------------------------------------
|  [Quick Log Entry]                                  |
|  Mood: [😊] [😐] [😞]                                |
|  Take Meds: [✔️]                                    |
|  Notes: [_____________________]                     |
|  [Log Entry Button]                                 |
-------------------------------------------------------
```

**Explanation:**  
The updated Dashboard adds new visual charts to enhance user insights. The Medication Manufacturer Chart displays the current medication manufacturer and alerts users if a new manufacturer is detected. The Overall Feeling / Mood / Energy Chart provides a combined view of key wellbeing metrics. The Side Effects Tracking Chart allows users to monitor side effects over selectable time ranges (Day, Week, Month), providing deeper tracking capabilities alongside the existing quick log entry features.

---

## 2. My Medications

```
-------------------------------------------------------
|  My Medications                [Add Medication +]   |
-------------------------------------------------------
|  Common Name   | Medical Name   | Brand/Generic     |
|  Manufacturer  | Pharmacy       | Dose Amount       |
|  Schedule      | Refill Schedule|                   |
-------------------------------------------------------|
|  Sertraline    | Sertraline HCl | Generic           |
|  Pfizer        | CVS Pharmacy   | 50mg              |
|  Daily 8:00am  | Every 30 days  |                   |
-------------------------------------------------------|
|  [View History] [Archive] [Delete] [Reminders Toggle]|
-------------------------------------------------------
```

**Explanation:**  
This layout displays each medication's full details, including common and medical names, brand/generic status, manufacturer, pharmacy, dose, and schedules. Clicking "View History" opens the medication's past records. Users can also archive, delete, and toggle reminders for both taking the medication and refills.

---

## 3. Log Entry

```
-------------------------------------------------------
|  Log Entry                                         |
-------------------------------------------------------
|  Date: [MM/DD/YYYY]  Time: [HH:MM]                 |
-------------------------------------------------------
|  Mood: [😊] [😐] [😞] [😠] [😱] [😴]                |
|  Energy: [slider ----|-----]                       |
|  Sleep: [__] hours                                 |
|  Notes:                                            |
|  [___________________________]                     |
-------------------------------------------------------
|  [Save Entry]                                      |
-------------------------------------------------------
```

**Explanation:**  
Allows users to log daily mood, energy, sleep, and add notes. Entries are timestamped and saved for tracking.

---

## 4. Trends

```
-------------------------------------------------------
|  Trends                                            |
-------------------------------------------------------
|  [Mood] [Sleep] [Meds] [Energy]                    |
-------------------------------------------------------
|                 [Graph: Mood Over Time]            |
|                                                    |
|  😊😊😐😞😊😐😊😞                                    |
|  |---|---|---|---|---|---|---|---|                |
|  1   2   3   4   5   6   7   8 (days)              |
-------------------------------------------------------
|  [Export Data]                                     |
-------------------------------------------------------
```

**Explanation:**  
Displays graphs visualizing trends over days/weeks/months for mood, sleep, medication adherence, and energy levels.

---

## 5. Community Insights

```
-------------------------------------------------------
|  Community Insights                                |
-------------------------------------------------------
|  “Most users report higher mood after 7h+ sleep.”   |
-------------------------------------------------------
|  - 75% took all meds last week                      |
|  - Top coping strategy: Journaling                  |
|  - Avg. mood improved by 12% last month             |
-------------------------------------------------------
|  [Share My Progress]                               |
-------------------------------------------------------
```

**Explanation:**  
Provides anonymized, aggregated insights from the community, highlighting trends, tips, and positive outcomes.

---

## 6. Account Settings

```
-------------------------------------------------------
|  Account Settings                                  |
-------------------------------------------------------
|  - Profile: [Edit]                                 |
|  - Email: user@email.com                           |
|  - Reminders: [On/Off]                             |
|  - Data Export: [Download]                         |
|  - Privacy: [Manage Permissions]                   |
|  - Logout                                          |
-------------------------------------------------------
```

**Explanation:**  
User settings for managing profile, notifications, data export, privacy, and account actions.
