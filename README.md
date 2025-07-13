<p align="center">
  <img src="src/assets/branding/logo-horizontal.png" alt="RxLedger logo" width="300" />
</p>

# RxLedger

RxLedger is a secure medication tracking app built with React, Vite, and Tailwind CSS. It allows users to:

- Track medications and manufacturers
- Log how they feel and any side effects
- Share anonymized experiences to help others

## Tech Stack

- React + Vite
- Tailwind CSS v4
- Firebase (authentication and encrypted storage)
- Husky + lint-staged + Prettier for consistent commits

## Getting Started

Install dependencies:

```
npm install
```

Start the dev server:

```
npm run dev
```

### Turnstile Setup

Set the `VITE_TURNSTILE_SITE_KEY` environment variable in your `.env` file and
create an API route at `/api/verify-turnstile` that validates the token with
Cloudflare. The registration form will block sign up until the captcha is
completed and verified.

## Contributing

Please see `CONTRIBUTING.md` for guidelines.

## License

Proprietary — This project is public for transparency, but not licensed for reuse or redistribution.

## Project Docs

- [Contributing Guidelines](CONTRIBUTING.md)
- [Project Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)

## Branding Assets

- **favicon.ico** – Browser tab icon
- **icon-512-maskable.png** – PWA maskable icon (future use)
- **logo-512-tight-crop.png** – Tightly cropped icon for app icons and small contexts
- **logo-horizontal.png** – Main logo with icon and text side by side
- **logo-icon.svg** – Scalable vector version of the icon only
- **logo-vertical.png** – Logo with icon above text
- **social-preview.png** – Image used for social sharing previews
