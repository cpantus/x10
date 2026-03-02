/**
 * Privacy Policy Page — /privacy
 * Self-contained (same pattern as CatalogPage/SolutionsPage)
 * GDPR-compliant privacy policy for x10.ro
 */

import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const fonts = {
  heading: '"Space Grotesk", sans-serif',
  mono: '"JetBrains Mono", monospace',
};

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy — X10 Automation';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-gray-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#030303]/90 backdrop-blur border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontFamily: fonts.heading }} className="font-bold tracking-wider text-xs uppercase">
              x10 Automation
            </span>
          </a>
          <span className="text-xs text-gray-600" style={{ fontFamily: fonts.mono }}>
            Last updated: March 2026
          </span>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: fonts.heading }}>
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-10" style={{ fontFamily: fonts.mono }}>
          Effective date: March 2, 2026 &middot; Version 1.0
        </p>

        <div className="space-y-10 text-sm leading-relaxed">

          {/* 1. Data Controller */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: fonts.heading }}>
              1. Data Controller
            </h2>
            <p>
              The data controller for this website is <strong className="text-white">Smart Business Solutions SRL</strong>,
              a company registered in Romania.
            </p>
            <ul className="mt-2 space-y-1 text-gray-400">
              <li>Website: <a href="https://x10.ro" className="text-blue-400 hover:underline">x10.ro</a></li>
              <li>Email: <a href="mailto:contact@x10.ro" className="text-blue-400 hover:underline">contact@x10.ro</a></li>
            </ul>
          </section>

          {/* 2. What Data We Collect */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: fonts.heading }}>
              2. What Data We Collect
            </h2>
            <p className="mb-3">We process minimal personal data through the following channels:</p>

            <h3 className="text-sm font-semibold text-white mt-4 mb-2">Analytics (Google Analytics 4)</h3>
            <p>
              <strong className="text-white">Only with your explicit consent.</strong> When you accept analytics cookies,
              we collect anonymized usage data: page views, CTA interactions, scroll depth, and ROI calculator usage.
              GA4 uses cookies (<code className="text-blue-300 bg-white/5 px-1 rounded">_ga</code>, <code className="text-blue-300 bg-white/5 px-1 rounded">_ga_*</code>)
              to distinguish unique visitors. IP anonymization is enabled.
            </p>

            <h3 className="text-sm font-semibold text-white mt-4 mb-2">AI Chatbot (Unit x10)</h3>
            <p>
              When you use our chatbot, your messages are sent to third-party AI model providers via OpenRouter
              for processing. Messages are processed in real-time and are not stored on our servers.
              The chatbot retains up to 10 messages in your browser session for conversation context;
              this data is cleared when you close the tab.
            </p>

            <h3 className="text-sm font-semibold text-white mt-4 mb-2">Consent Preferences</h3>
            <p>
              Your cookie consent choice is stored in your browser's <code className="text-blue-300 bg-white/5 px-1 rounded">localStorage</code> under
              the key <code className="text-blue-300 bg-white/5 px-1 rounded">x10_consent</code>. This data never leaves your device.
            </p>
          </section>

          {/* 3. Third-Party Processors */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: fonts.heading }}>
              3. Third-Party Data Processors
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-white/10 rounded-lg overflow-hidden">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Processor</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Purpose</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Data Sent</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Consent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 py-2 text-white">Google LLC</td>
                    <td className="px-4 py-2">Analytics (GA4)</td>
                    <td className="px-4 py-2">Page views, interactions (anonymized)</td>
                    <td className="px-4 py-2">Required</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-white">OpenRouter, Inc.</td>
                    <td className="px-4 py-2">AI Chatbot routing</td>
                    <td className="px-4 py-2">Chat messages</td>
                    <td className="px-4 py-2">Legitimate interest</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-white">Cloudflare, Inc.</td>
                    <td className="px-4 py-2">Website hosting (Pages)</td>
                    <td className="px-4 py-2">Standard web logs (IP, user agent)</td>
                    <td className="px-4 py-2">Legitimate interest</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Legal Basis */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: fonts.heading }}>
              4. Legal Basis for Processing
            </h2>
            <ul className="space-y-2">
              <li><strong className="text-white">Consent (Art. 6(1)(a) GDPR)</strong> — Analytics cookies (GA4). You may withdraw consent at any time via the "Cookie Settings" link in the footer.</li>
              <li><strong className="text-white">Legitimate interest (Art. 6(1)(f) GDPR)</strong> — AI chatbot operation (providing the requested service), website hosting and security (Cloudflare).</li>
            </ul>
          </section>

          {/* 5. Cookies & Storage */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: fonts.heading }}>
              5. Cookies & Local Storage
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-white/10 rounded-lg overflow-hidden">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Name</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Type</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Category</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Duration</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 py-2 text-white font-mono">x10_consent</td>
                    <td className="px-4 py-2">localStorage</td>
                    <td className="px-4 py-2">Essential</td>
                    <td className="px-4 py-2">Until cleared</td>
                    <td className="px-4 py-2">Stores your cookie consent preferences</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-white font-mono">_ga</td>
                    <td className="px-4 py-2">Cookie</td>
                    <td className="px-4 py-2">Analytics</td>
                    <td className="px-4 py-2">2 years</td>
                    <td className="px-4 py-2">Distinguishes unique visitors (GA4)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-white font-mono">_ga_*</td>
                    <td className="px-4 py-2">Cookie</td>
                    <td className="px-4 py-2">Analytics</td>
                    <td className="px-4 py-2">2 years</td>
                    <td className="px-4 py-2">Persists session state (GA4)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 6. Data Retention */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: fonts.heading }}>
              6. Data Retention
            </h2>
            <ul className="space-y-2">
              <li><strong className="text-white">Analytics data (GA4):</strong> 14 months, then automatically deleted by Google.</li>
              <li><strong className="text-white">Chatbot conversations:</strong> Browser session only. Cleared when you close the tab. Not stored on our servers.</li>
              <li><strong className="text-white">Consent preferences:</strong> Stored in your browser until you clear localStorage or revoke consent.</li>
            </ul>
          </section>

          {/* 7. International Transfers */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: fonts.heading }}>
              7. International Data Transfers
            </h2>
            <p>
              Some of our third-party processors (Google, OpenRouter, Cloudflare) are based in the United States.
              These transfers are protected by Standard Contractual Clauses (SCCs) approved by the European Commission,
              and where applicable, by the EU-US Data Privacy Framework.
            </p>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: fonts.heading }}>
              8. Your Rights (GDPR Articles 15-22)
            </h2>
            <p className="mb-3">Under the GDPR, you have the right to:</p>
            <ul className="space-y-1">
              <li><strong className="text-white">Access</strong> — request a copy of your personal data</li>
              <li><strong className="text-white">Rectification</strong> — correct inaccurate data</li>
              <li><strong className="text-white">Erasure</strong> — request deletion of your data ("right to be forgotten")</li>
              <li><strong className="text-white">Restriction</strong> — limit how we process your data</li>
              <li><strong className="text-white">Data portability</strong> — receive your data in a machine-readable format</li>
              <li><strong className="text-white">Object</strong> — object to processing based on legitimate interest</li>
              <li><strong className="text-white">Withdraw consent</strong> — at any time, via the "Cookie Settings" link in the footer</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{' '}
              <a href="mailto:contact@x10.ro" className="text-blue-400 hover:underline">contact@x10.ro</a>.
            </p>
            <p className="mt-2">
              You also have the right to lodge a complaint with the Romanian supervisory authority:{' '}
              <strong className="text-white">Autoritatea Nationala de Supraveghere a Prelucrarii Datelor cu Caracter Personal (ANSPDCP)</strong>,{' '}
              <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                www.dataprotection.ro
              </a>.
            </p>
          </section>

          {/* 9. AI Chatbot Disclosure */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: fonts.heading }}>
              9. AI Chatbot Disclosure (EU AI Act, Article 50)
            </h2>
            <ul className="space-y-2">
              <li>The chatbot ("Unit x10") is an <strong className="text-white">AI system</strong>, not a human. You are always interacting with artificial intelligence.</li>
              <li>It uses third-party AI models (Google Gemini, DeepSeek, GPT-4.1 Mini) via OpenRouter for response generation.</li>
              <li>Responses are <strong className="text-white">informational only</strong> and do not constitute professional, legal, or financial advice.</li>
              <li>We send a <code className="text-blue-300 bg-white/5 px-1 rounded">data_collection: "deny"</code> header to OpenRouter to request that conversation data is not used for model training.</li>
            </ul>
          </section>

          {/* 10. Changes */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: fonts.heading }}>
              10. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. Material changes will increment the consent version,
              requiring you to review and re-confirm your preferences. The "Last updated" date at the top of this page
              reflects the most recent revision.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center text-xs text-gray-600">
          &copy; 2026 Smart Business Solutions SRL. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;
