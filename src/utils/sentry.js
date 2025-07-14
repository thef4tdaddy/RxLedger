import { APP_VERSION } from './version.js';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Replay } from '@sentry/replay';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, // Replace with your actual DSN
  release: 'rxledger@' + APP_VERSION,
  environment: 'production',
  _experiments: {
    profilesSampleRate: 1.0,
  },
  replaysSessionSampleRate: 0.02,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event) {
    // Remove any sensitive data manually if needed
    if (event.request && event.request.headers) {
      delete event.request.headers['authorization'];
    }
    return event;
  },
  beforeSendTransaction(event) {
    return event;
  },
  integrations: [
    new BrowserTracing(),
    new Replay({
      maskAllText: true,
      blockAllMedia: true,
      sessionSampleRate: 0.02,
      errorSampleRate: 1.0,
    }),
  ],
  tracesSampleRate: 0.1,
});
