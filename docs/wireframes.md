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
-------------------------------------------------------
|  Side Effects: [Select multiple from dropdown]    |
|  Side Effect Notes:                                |
|  [___________________________]                     |
-------------------------------------------------------
|  General Notes:                                    |
|  [___________________________]                     |
-------------------------------------------------------
|  [Save Entry]                                      |
-------------------------------------------------------
```

**Explanation:**  
Allows users to log daily mood, energy, and sleep, along with detailed notes. Users can select multiple side effects from a dropdown and enter side effect–specific notes to track symptoms clearly. A separate general notes field is provided for other observations about the day. Entries are timestamped and saved for comprehensive tracking.

---

## 4. Trends

```
-------------------------------------------------------
|  Trends                                            |
-------------------------------------------------------
|  [Mood] [Sleep] [Energy] [Meds Taken] [Side Effects]|
-------------------------------------------------------
|         [Graph: Mood Over Time]                   |
|                                                   |
|  😊😊😐😞😊😐😊😞                                     |
|  |---|---|---|---|---|---|---|---|               |
|  1   2   3   4   5   6   7   8 (days)             |
-------------------------------------------------------
|         [Graph: Sleep Totals]                     |
|                                                   |
|  ████ ███ ████ ████ █                             |
|  |---|---|---|---|---|---|---|---|               |
|  1   2   3   4   5   6   7   8 (days)             |
-------------------------------------------------------
|         [Graph: Energy Levels]                   |
|                                                   |
|  ● ● ● ● ● ● ● ●                                  |
|  |---|---|---|---|---|---|---|---|               |
-------------------------------------------------------
|         [Graph: Meds Taken Time]                 |
|                                                   |
|  [Bar chart showing time of day meds were logged]|
-------------------------------------------------------
|         [Heatmap: Side Effects Frequency]        |
|                                                   |
|  [Heatmap grid showing side effects over time]   |
-------------------------------------------------------
|  [Full Report]                                   |
|  Time Range: [Last 7 days | Last Month | Custom] |
-------------------------------------------------------
|  [Export Data]                                   |
-------------------------------------------------------
```

**Explanation:**  
The Trends screen now includes detailed visualizations of user health and medication data over time. Mood Over Time shows mood trends. Sleep Totals displays nightly sleep duration. Energy Levels chart energy scores. Meds Taken Time shows what time of day medications were logged. The Side Effects Heatmap visualizes frequency over time. Users can generate a full report for a custom time range and export all historical data.

---

## 5. Community Insights

```
-------------------------------------------------------
|  Community Insights                                |
-------------------------------------------------------
|  "Users who log side effects weekly see 20% more   |
|   consistent mood scores."                         |
-------------------------------------------------------
|  Broad Insights                                    |
|  - 78% took all doses last week                    |
|  - Most common side effect: Mild headache          |
|  - Avg. sleep duration last month: 7.2 hours       |
|  - Top mood improvement strategy: Journaling       |
-------------------------------------------------------
|  Tailored Insights                                 |
|  Medication: [Adderall ▼]                          |
|  - Most common side effect: Dry Mouth              |
|  - Avg. mood rating: 3.2/5                         |
|  - 62% take in morning                             |
|  - 40% report increased focus                      |
-------------------------------------------------------
|  [Select Medication ▼]                             |
|  Search medications to see community trends        |
-------------------------------------------------------
|  [View Community Trends] [Share My Progress]      |
-------------------------------------------------------
```

**Explanation:**  
The Community Insights screen provides aggregated trends and peer data. Broad Insights show overall patterns across all users, including adherence, side effects, sleep, and mood. Tailored Insights let users select a medication to view common side effects, dosing patterns, and outcomes among other users. The search feature helps explore trends for any medication, supporting informed decisions.

---

## 6. Account Settings

```
-------------------------------------------------------
|  Account Settings                                  |
-------------------------------------------------------
|  Profile                                           |
|  - [User Avatar] [Change Photo]                    |
|  - Name: John Doe                                  |
|  - Email: john@example.com                         |
|  - [Edit Profile]                                  |
-------------------------------------------------------
|  Notifications                                     |
|  - Medication Reminders: [On/Off]                  |
|  - Refill Reminders: [On/Off]                      |
|  - Manufacturer Change Alerts: [On/Off]            |
-------------------------------------------------------
|  Data & Privacy                                    |
|  - Export All Data [Download]                      |
|  - Anonymize Logs [Enable/Disable]                 |
|  - Manage Permissions                              |
-------------------------------------------------------
|  Community Sharing                                 |
|  - Share anonymized insights: [On/Off]             |
|  - View shared contributions                       |
-------------------------------------------------------
|  Integrations                                      |
|  - Connect Health Apps [Connect]                   |
|  - Sync with Pharmacy [Manage]                     |
-------------------------------------------------------
|  Danger Zone                                       |
|  - Delete My Account [Delete]                      |
-------------------------------------------------------
|  [Logout]                                          |
-------------------------------------------------------
```

**Explanation:**  
The Account Settings screen provides tools for profile management, including user avatar, name, and email. Notifications can be customized per reminder type. Data & Privacy offers exporting and anonymizing logs. Community Sharing controls participation in anonymized insights. Integrations connect health apps and pharmacies. Danger Zone clearly separates account deletion.

---

## 7. Admin Dashboard

```
-------------------------------------------------------
|  Admin Dashboard                                   |
-------------------------------------------------------
|  Overview                                          |
|  - Total Users: 1,532                              |
|  - Active Users This Month: 480                    |
|  - Logs Recorded: 12,942                           |
|  - Reports Reviewed: 36                            |
-------------------------------------------------------
|  User Management                                   |
|  [Search users by email or ID] [🔍]               |
|  - [User List with Suspend/Delete actions]         |
-------------------------------------------------------
|  Content Moderation                                |
|  - Pending Reports: [12]                           |
|  - [View Reports]                                  |
-------------------------------------------------------
|  System Monitoring                                 |
|  - Error Logs (Sentry)                             |
|  - Deployment Status (Vercel)                      |
|  - Data Sync Health (Firebase)                     |
-------------------------------------------------------
|  Data & Privacy                                    |
|  - Export User Logs                                |
|  - Purge Inactive Accounts                         |
|  - Manage Data Retention Policies                  |
-------------------------------------------------------
|  Audit Logs                                        |
|  - [View all admin actions and timestamps]         |
-------------------------------------------------------
```

**Explanation:**  
The Admin Dashboard provides tools to manage users, moderate reported content, and monitor system health. The Overview section summarizes key metrics. User Management enables searching, suspending, or deleting accounts. Content Moderation displays pending reports. System Monitoring surfaces error logs and deployment health. Data & Privacy controls allow exporting or purging user data and adjusting retention policies. Audit Logs track all admin actions for accountability.
