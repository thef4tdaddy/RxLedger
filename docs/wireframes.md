# RxLedger Wireframes

Below are the wireframes for the six main screens of the RxLedger application. Each section includes an ASCII wireframe and a brief explanation of the screen's purpose and elements.

---

## 1. Dashboard

```
-------------------------------------------------------
|  RxLedger                       [User Avatar]    |
-------------------------------------------------------
|  [Today] [Week] [Month]                              |
-------------------------------------------------------
|  Mood: 😊    |  Meds: ✔️   |  Sleep: 7h  |  Energy: 🔋 |
-------------------------------------------------------
|                                                   |
|  [Quick Log Entry]                                |
|  Mood: [😊] [😐] [😞]                              |
|  Take Meds: [✔️]                                  |
|  Notes: [_____________________]                   |
|  [Log Entry Button]                               |
|                                                   |
-------------------------------------------------------
|  Recent Activity                                  |
|  - Mood: 😊  9:00am                               |
|  - Meds taken 8:00am                              |
|  - Slept 7h last night                            |
-------------------------------------------------------
```

**Explanation:**  
The Dashboard is the main landing screen, providing a summary of the user's day, quick logging options, and recent activity.

---

## 2. My Medications

```
-------------------------------------------------------
|  My Medications                [Add Medication +]   |
-------------------------------------------------------
|  Name         |  Dosage   |  Time   |  Taken?       |
|-----------------------------------------------------|
|  Sertraline   |  50mg     |  8:00am |  [✔️]         |
|  Vitamin D    |  2000IU   |  9:00am |  [ ]          |
|-----------------------------------------------------|
|  [Edit] [Delete]                                   |
-------------------------------------------------------
|  Reminders: [On/Off Toggle]                        |
-------------------------------------------------------
```

**Explanation:**  
Lists all medications, dosages, scheduled times, and whether they've been taken today. Users can add, edit, or delete medications and toggle reminders.

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
