# ThriveTrack

## Overview
ThriveTrack is a secure medication tracking application designed to empower users to monitor their medication intake and share anonymized experiences to support others on similar health journeys.

## Features
- **Medication Logging:** Easily record and track medication schedules and dosages.
- **Anonymized Sharing:** Share your medication experiences anonymously to help build a supportive community.
- **Secure Data Storage:** All user data is encrypted and stored securely to ensure privacy.
- **Reminders & Notifications:** Set up customizable reminders to never miss a dose.
- **Progress Visualization:** View charts and reports to monitor your medication adherence over time.

## Tech Stack
- **Frontend:** React.js with TypeScript for a responsive and interactive user interface.
- **Backend:** Node.js with Express.js for robust API services.
- **Database:** MongoDB for flexible and scalable data storage.
- **Authentication:** JWT-based authentication for secure user sessions.
- **Hosting:** Deployed on AWS with SSL encryption for secure access.

## Development Setup
1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/ThriveTrack.git
   ```
2. **Install dependencies:**
   - Frontend:
     ```
     cd ThriveTrack/frontend
     npm install
     ```
   - Backend:
     ```
     cd ThriveTrack/backend
     npm install
     ```
3. **Configure environment variables:**
   Create `.env` files in both frontend and backend directories with necessary API keys and secrets.
4. **Run the application:**
   - Start backend server:
     ```
     npm run start
     ```
   - Start frontend server:
     ```
     npm start
     ```
5. **Access the app:**
   Open your browser at `http://localhost:3000`.

## Wireframes
Wireframes are available in the `/docs/wireframes` directory. They outline the user interface layout and user flow for the application.

## Roadmap & Issues
- **Upcoming Features:**
  - Integration with wearable devices for automatic medication tracking.
  - Enhanced analytics dashboard.
  - Multi-language support.
- **Known Issues:**
  - Occasional delays in notification delivery.
  - Minor UI glitches on mobile devices.
- For detailed tracking, visit the [GitHub Issues](https://github.com/yourusername/ThriveTrack/issues) page.

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

Please ensure your code adheres to the existing style and includes appropriate tests.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Privacy Notice
Your privacy is our priority. ThriveTrack uses encryption to protect your personal data and anonymizes shared experiences to safeguard your identity. We do not sell or share your data with third parties without explicit consent. For more details, refer to our [Privacy Policy](PRIVACY.md).
