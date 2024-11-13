import * as Sentry from '@sentry/nuxt';

Sentry.init({
  // If set up, you can use your runtime config here
  // dsn: useRuntimeConfig().public.sentry.dsn,
  environment: 'production',
  dsn: 'https://140347f3423000381e45468967f9b946@o4508288755302400.ingest.us.sentry.io/4508289110704128',
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: [/^https:\/\/www.js-bridge.com/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
