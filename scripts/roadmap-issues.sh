#!/bin/bash

# Define your issues: Title|Phase|Description
issues=(
"Implement Offline Functionality|Phase 3 – Mobile & Accessibility|Allow users to log medications and view recent data without an internet connection."
"Add Push Notifications for Reminders|Phase 3 – Mobile & Accessibility|Notify users when it's time to take their medication."
"Add Dark Mode Support|Phase 3 – Mobile & Accessibility|Provide a dark theme for better night-time usability."
"Implement Responsive Design Improvements|Phase 3 – Mobile & Accessibility|Ensure all views work well on different screen sizes."
"Advanced Analytics Dashboard|Phase 5 – Advanced Features|Provide detailed data analysis and trends for users."
"Data Export/Import Functionality|Phase 5 – Advanced Features|Allow users to back up and import their medication data."
"Integration with Health APIs (Apple Health, Google Fit)|Phase 5 – Advanced Features|Enable syncing with popular health tracking services."
"Medication Interaction Warnings|Phase 5 – Advanced Features|Warn users of potential interactions between medications."
"Multi-language Support|Phase 5 – User Experience Enhancements|Support additional languages to broaden accessibility."
"Customizable Reminder Notifications|Phase 5 – User Experience Enhancements|Let users customize timing and style of reminders."
"Voice Logging Capabilities|Phase 5 – User Experience Enhancements|Allow users to log entries using voice input."
"Photo Documentation for Pills/Side Effects|Phase 5 – User Experience Enhancements|Enable photo attachments to medication logs."
"Advanced Community Features (Forums, Q&A)|Phase 5 – Community & Insights|Create spaces for users to discuss medications and experiences."
"Healthcare Provider Dashboard|Phase 5 – Community & Insights|Provide a dashboard for clinicians to review anonymized patient data."
"Research Partnership Tools|Phase 5 – Community & Insights|Offer data access tools for research institutions."
"Anonymous Clinical Trial Matching|Phase 5 – Community & Insights|Help users find and enroll in clinical trials anonymously."
"Medication Adherence Scoring|Future Ideas – Short-term|Score how consistently users take their medications."
"Side Effect Prediction Models|Future Ideas – Short-term|Use AI to predict potential side effects."
"Integration with Pharmacy Systems|Future Ideas – Short-term|Connect to pharmacy systems for refill tracking."
"Backup/Restore Functionality|Future Ideas – Short-term|Allow users to back up and restore data."
"AI-powered Insights|Future Ideas – Long-term|Provide AI recommendations based on user data."
"Telemedicine Integration|Future Ideas – Long-term|Offer telehealth appointments within the app."
"Clinical Decision Support|Future Ideas – Long-term|Help providers make decisions using aggregated data."
"Global Medication Database|Future Ideas – Long-term|Include comprehensive medication data across countries."
"Regulatory Compliance Tools (HIPAA, GDPR)|Future Ideas – Long-term|Ensure compliance with healthcare regulations."
)

default_labels=("enhancement" "priority:low")

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g'
}

# Collect unique phases
unique_phases=()
for item in "${issues[@]}"; do
  phase=$(echo "$item" | cut -d"|" -f2)
  if [[ ! " ${unique_phases[*]} " =~ " ${phase} " ]]; then
    unique_phases+=("$phase")
  fi
done

# Delete labels with no description
existing_labels=$(gh label list --json name,description -q '.[] | select(.description == null or .description == "") | .name')
for label in $existing_labels; do
  echo "Deleting label with no description: $label"
  gh label delete "$label" --yes 2>/dev/null || true
done

# Create labels
for phase in "${unique_phases[@]}"; do
  slug=$(slugify "$phase")
  gh label create "$slug" --color "0e8a16" --description "Phase label for $phase" 2>/dev/null || true
done

for label in "${default_labels[@]}"; do
  gh label create "$label" --color "d93f0b" --description "Default label $label" 2>/dev/null || true
done

# Create milestones via gh api
for phase in "${unique_phases[@]}"; do
  echo ""
  echo "Checking milestone: $phase"
  milestone_exists=$(gh api repos/:owner/:repo/milestones --jq ".[] | select(.title==\"$phase\") | .title")
  if [[ -z "$milestone_exists" ]]; then
    echo "Creating milestone: $phase"
    gh api repos/:owner/:repo/milestones -f title="$phase" -f description="Roadmap milestone for $phase" -f state="open"
  else
    echo "Milestone already exists: $phase"
  fi
done

# Loop to create issues
for item in "${issues[@]}"; do
  title=$(echo "$item" | cut -d"|" -f1)
  phase=$(echo "$item" | cut -d"|" -f2)
  description=$(echo "$item" | cut -d"|" -f3)
  slug=$(slugify "$phase")

  echo ""
  echo "Creating issue: $title"

  issue_url=$(gh issue create \
    --title "$title" \
    --body "**Phase:** $phase

$description

_This issue was generated automatically from the project roadmap._" \
    --label "$slug" \
    --label "${default_labels[0]}" \
    --label "${default_labels[1]}" \
    --milestone "$phase")

  echo "Created issue at: $issue_url"
  issue_number=$(basename "$issue_url")
  echo "- [ ] [#$issue_number]($issue_url) $title"
done