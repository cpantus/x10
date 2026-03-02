/**
 * GDPR Cookie Consent State Manager
 *
 * Standalone module (no React dependency) managing consent via localStorage.
 * Dispatches 'consentChanged' CustomEvent on state changes so other modules
 * (e.g. analytics.ts, CookieConsent.tsx) can react.
 *
 * Only 2 categories:
 * - Essential (always on) — consent storage itself
 * - Analytics (GA4) — off by default, requires explicit opt-in
 */

const STORAGE_KEY = 'x10_consent';
const CONSENT_VERSION = 1;

export interface ConsentState {
  version: number;
  timestamp: string;
  analytics: boolean;
}

function getStoredConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    // Version mismatch → treat as no consent (triggers re-consent)
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Returns current consent state, or null if user hasn't consented yet */
export function getConsent(): ConsentState | null {
  return getStoredConsent();
}

/** Whether the user has made any consent decision */
export function hasConsented(): boolean {
  return getStoredConsent() !== null;
}

/** Whether analytics (GA4) consent is granted */
export function hasAnalyticsConsent(): boolean {
  const consent = getStoredConsent();
  return consent !== null && consent.analytics === true;
}

/** Save consent preferences and dispatch change event */
export function setConsent(prefs: { analytics: boolean }): void {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    analytics: prefs.analytics,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent('consentChanged', { detail: state }));
}

/** Revoke all consent (clears stored preferences) */
export function revokeConsent(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('consentChanged', { detail: null }));
}
