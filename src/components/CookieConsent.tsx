/**
 * GDPR Cookie Consent Banner
 *
 * Fixed bottom banner with framer-motion animation.
 * - "Reject All" / "Accept All" equal prominence (same row, same size)
 * - "Manage Preferences" expands granular controls
 * - Analytics toggle starts OFF (no pre-checked boxes)
 * - Accessible: role="dialog", aria-label, aria-checked
 * - Shows 500ms after page load if no prior consent
 * - Re-openable via 'reopenCookieConsent' custom event (footer link)
 * - z-[60] to sit above chatbot's z-50
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { hasConsented, getConsent, setConsent } from '../utils/consent';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(false);

  // Show banner after 500ms if no prior consent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasConsented()) {
        setVisible(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Allow re-opening via custom event (footer "Cookie Settings" link)
  useEffect(() => {
    const handler = () => {
      const existing = getConsent();
      if (existing) {
        setAnalyticsOn(existing.analytics);
      }
      setVisible(true);
    };
    window.addEventListener('reopenCookieConsent', handler);
    return () => window.removeEventListener('reopenCookieConsent', handler);
  }, []);

  const handleAcceptAll = useCallback(() => {
    setConsent({ analytics: true });
    setVisible(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    setConsent({ analytics: false });
    setVisible(false);
  }, []);

  const handleSavePrefs = useCallback(() => {
    setConsent({ analytics: analyticsOn });
    setVisible(false);
  }, [analyticsOn]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          role="dialog"
          aria-label="Cookie consent preferences"
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6"
        >
          <div className="max-w-2xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_-4px_40px_rgba(0,0,0,0.5)] p-5 md:p-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-400 shrink-0" />
              <h2 className="text-sm font-semibold text-white font-['Space_Grotesk',sans-serif]">
                Cookie Preferences
              </h2>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              We use cookies to analyze how visitors use our site.
              You can choose which cookies to allow.{' '}
              <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>
            </p>

            {/* Manage Preferences (expandable) */}
            <AnimatePresence>
              {showPrefs && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border border-white/5 rounded-lg p-4 mb-4 space-y-3">
                    {/* Essential — always on */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-white">Essential</span>
                        <p className="text-[10px] text-gray-500">Required for the site to function. Cannot be disabled.</p>
                      </div>
                      <div
                        className="w-9 h-5 bg-blue-500/30 rounded-full flex items-center justify-end px-0.5 cursor-not-allowed opacity-60"
                        role="switch"
                        aria-checked="true"
                        aria-label="Essential cookies (always on)"
                      >
                        <div className="w-4 h-4 bg-blue-400 rounded-full" />
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-white">Analytics</span>
                        <p className="text-[10px] text-gray-500">Google Analytics 4 — helps us understand site usage.</p>
                      </div>
                      <button
                        onClick={() => setAnalyticsOn(!analyticsOn)}
                        className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                          analyticsOn ? 'bg-blue-500/30 justify-end' : 'bg-white/10 justify-start'
                        }`}
                        role="switch"
                        aria-checked={analyticsOn}
                        aria-label="Analytics cookies"
                      >
                        <div className={`w-4 h-4 rounded-full transition-colors ${
                          analyticsOn ? 'bg-blue-400' : 'bg-gray-500'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Save Preferences */}
                  <button
                    onClick={handleSavePrefs}
                    className="w-full text-xs font-medium text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg py-2.5 mb-3 transition-colors"
                  >
                    Save Preferences
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleRejectAll}
                className="flex-1 text-xs font-medium text-white bg-transparent hover:bg-white/5 border border-white/20 rounded-lg py-2.5 transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={() => setShowPrefs(!showPrefs)}
                className="flex-1 text-xs font-medium text-gray-300 hover:text-white bg-transparent hover:bg-white/5 border border-white/10 rounded-lg py-2.5 transition-colors flex items-center justify-center gap-1"
              >
                Manage Preferences
                {showPrefs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg py-2.5 transition-colors"
              >
                Accept All
              </button>
            </div>

            {/* Legal links */}
            <div className="mt-3 text-center">
              <a href="/privacy" className="text-[10px] text-gray-500 hover:text-gray-400 transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-700 mx-2">&middot;</span>
              <a href="/terms" className="text-[10px] text-gray-500 hover:text-gray-400 transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
