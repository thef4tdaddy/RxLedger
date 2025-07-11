#!/bin/bash

# Make sure you are authenticated with gh:
# Run: gh auth login

# Target repository
REPO="thef4tdaddy/ThriveTrack"

gh issue create -R "$REPO" --title "Implement Dashboard Screen" --body "Create the Dashboard page to display:

- Today's medication reminder
- Quick mood log
- Recent activity list
- Trends snapshot (mini chart)

Use Tailwind CSS for layout and styling. Refer to the wireframe in docs/wireframes.md."

gh issue create -R "$REPO" --title "Implement My Medications Screen" --body "Develop the Medications management screen:

- List medications with dosage, time, and taken status
- Buttons to add, edit, and delete medications
- Toggle for reminders on/off

Ensure inputs and data are validated and saved securely."

gh issue create -R "$REPO" --title "Implement Log Entry Screen" --body "Create the Log Entry form with the following inputs:

- Date and time
- Mood selection (emoji or scale)
- Energy level slider
- Sleep hours input
- Notes text area

Data must be encrypted client-side before saving."

gh issue create -R "$REPO" --title "Implement Trends Visualization Screen" --body "Build the Trends screen showing:

- Mood over time graph
- Sleep and medication adherence trends
- Date range selector
- Data export option

Use a chart library (e.g., Recharts) and Tailwind components."

gh issue create -R "$REPO" --title "Implement Community Insights Screen" --body "Develop the Community Insights screen with:

- Anonymized aggregated stats
- Common side effects and mood trends
- Option for users to share their progress anonymously

Design should align with the wireframe."

gh issue create -R "$REPO" --title "Implement Account Settings Screen" --body "Create Account Settings allowing the user to:

- View and edit profile info
- Change email/password
- Manage reminders and notifications
- Export or delete data
- Manage encryption keys and privacy options

Handle data deletion carefully with confirmation prompts."

gh issue create -R "$REPO" --title "Implement Client-Side Encryption" --body "Develop encryption utilities for secure data storage:

- AES or Web Crypto encryption of logs and medication data
- Decryption on load with user-provided key
- Ensure no unencrypted data is stored in Firestore

Document the encryption strategy in docs/encryption.md."

gh issue create -R "$REPO" --title "Create Application Navigation and Layout" --body "Implement a responsive navigation bar:

- Dashboard
- Medications
- Log Entry
- Trends
- Community
- Account

Use Tailwind CSS for styling and ensure mobile support."

gh issue create -R "$REPO" --title "Implement User Authentication" --body "Set up Firebase Authentication:

- Email/password registration and login
- Store last login timestamp
- Require encryption key entry after login
- Optional 'Remember me' encryption key storage in browser."