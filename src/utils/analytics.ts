/**
 * GA4 Analytics — Conditional Loading with GDPR Consent
 *
 * GA4 is only loaded when the user grants analytics consent.
 * The gtag() script is dynamically injected (removed from index.html).
 * Listens for 'consentChanged' events to load GA4 after in-session consent.
 */

import { hasAnalyticsConsent } from './consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_MEASUREMENT_ID = 'G-90T710QXXS';
let ga4Loaded = false;

/** Dynamically inject the gtag.js script and configure GA4 */
function loadGA4(): void {
  if (ga4Loaded) return;
  ga4Loaded = true;

  // Create gtag script element
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
}

/**
 * Initialize analytics: load GA4 if consent already granted,
 * and listen for future consent changes.
 * Call once at app startup (before React render).
 */
export function initAnalytics(): void {
  // Load immediately if consent already granted
  if (hasAnalyticsConsent()) {
    loadGA4();
  }

  // Listen for future consent changes (e.g. user accepts analytics mid-session)
  window.addEventListener('consentChanged', () => {
    if (hasAnalyticsConsent()) {
      loadGA4();
    }
  });
}

// --- Event Tracking API (unchanged from original) ---

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export const events = {
  ctaClick: (label: string) =>
    trackEvent('cta_click', { cta_label: label }),

  roiCalculatorUse: (teamSize: number, hourlyCost: number, hoursAutomated: number, annualSavings: number) =>
    trackEvent('roi_calculator_use', { team_size: teamSize, hourly_cost: hourlyCost, hours_automated: hoursAutomated, annual_savings: annualSavings }),

  chatOpen: () =>
    trackEvent('chat_open'),

  chatMessage: () =>
    trackEvent('chat_message_sent'),

  scrollDepth: (percent: number) =>
    trackEvent('scroll_depth', { percent }),

  pageSection: (sectionId: string) =>
    trackEvent('section_view', { section: sectionId }),

  contactFormSubmit: (company: string, hasPhone: boolean, hasMessage: boolean) =>
    trackEvent('contact_form_submit', { company, has_phone: hasPhone, has_message: hasMessage }),
} as const;
