/**
 * GA4 event tracking wrapper.
 * Uses the existing gtag() function injected via index.html.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

// Pre-defined events for consistent naming
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

  // Lead generation events
  contactFormSubmit: (company: string, hasPhone: boolean, hasMessage: boolean) =>
    trackEvent('contact_form_submit', { company, has_phone: hasPhone, has_message: hasMessage }),
} as const;
