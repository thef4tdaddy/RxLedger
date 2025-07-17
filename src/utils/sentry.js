import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Replay } from '@sentry/replay';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: 'rxledger@1.0.0',
  environment: import.meta.env.MODE || 'production',

  // ✅ FIXED: Use new configuration format
  replaysSessionSampleRate: 0.02,
  replaysOnErrorSampleRate: 1.0,

  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
    }
    return event;
  },

  integrations: [
    new BrowserTracing(),
    new Replay({
      maskAllText: true,
      blockAllMedia: true,
      // ❌ REMOVED: deprecated options
    }),
  ],

  tracesSampleRate: 0.1,
});
