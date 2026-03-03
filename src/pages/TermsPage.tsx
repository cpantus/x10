/**
 * Terms & Conditions Page — /terms
 * Self-contained (same pattern as CatalogPage/SolutionsPage)
 */

import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms & Conditions — X10 Automation';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-gray-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[var(--color-bg-primary)]/90 backdrop-blur border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-heading font-bold tracking-wider text-xs uppercase">
              x10 Automation
            </span>
          </a>
          <span className="text-xs text-gray-600 font-mono">
            Last updated: March 2026
          </span>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-heading">
          Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-10 font-mono">
          Effective date: March 2, 2026 &middot; Version 1.0
        </p>

        <div className="space-y-10 text-sm leading-relaxed">

          {/* 1. Introduction */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 font-heading">
              1. Introduction
            </h2>
            <p>
              These Terms & Conditions ("Terms") govern your use of the website{' '}
              <a href="https://x10.ro" className="text-blue-400 hover:underline">x10.ro</a> ("Website"),
              operated by <strong className="text-white">Smart Business Solutions SRL</strong> ("we", "us", "our"),
              a company registered in Romania.
            </p>
            <p className="mt-2">
              By accessing or using the Website, you agree to be bound by these Terms.
              If you do not agree, please do not use the Website.
            </p>
          </section>

          {/* 2. Intellectual Property */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 font-heading">
              2. Intellectual Property
            </h2>
            <p>
              All content on this Website — including text, graphics, logos, design, code, and software —
              is the property of Smart Business Solutions SRL or its licensors and is protected by Romanian
              and international copyright, trademark, and intellectual property laws.
            </p>
            <p className="mt-2">
              You may not reproduce, distribute, modify, or create derivative works from any content
              on this Website without our prior written consent.
            </p>
          </section>

          {/* 3. AI Chatbot Terms */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 font-heading">
              3. AI Chatbot Terms
            </h2>
            <ul className="space-y-2">
              <li>The chatbot ("Unit x10") is an <strong className="text-white">AI-powered assistant</strong> that provides general information about our services. It is not a human.</li>
              <li>Responses are <strong className="text-white">informational only</strong> and may contain inaccuracies. Do not rely on chatbot responses for professional, legal, financial, or medical decisions.</li>
              <li>Do not share sensitive personal data (passwords, financial details, health information) with the chatbot.</li>
              <li>We reserve the right to impose rate limits (currently: 50 messages per session, 2-second cooldown between messages).</li>
              <li>We may modify, suspend, or discontinue the chatbot at any time without notice.</li>
            </ul>
          </section>

          {/* 4. Service Descriptions */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 font-heading">
              4. Service Descriptions
            </h2>
            <p>
              The service descriptions, pricing information, and case studies presented on this Website are for
              informational purposes only. They represent typical engagements and results, which may vary.
            </p>
            <p className="mt-2">
              All pricing shown is indicative. Actual project terms, deliverables, timelines, and pricing are
              determined by individual service agreements between you and Smart Business Solutions SRL.
            </p>
          </section>

          {/* 5. Limitation of Liability */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 font-heading">
              5. Limitation of Liability
            </h2>
            <p>
              The Website and its content are provided <strong className="text-white">"as is"</strong> and{' '}
              <strong className="text-white">"as available"</strong> without warranties of any kind,
              whether express or implied.
            </p>
            <p className="mt-2">
              To the maximum extent permitted by Romanian and EU law, Smart Business Solutions SRL shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages arising from your
              use of the Website. Our total aggregate liability for any claims related to the Website shall not
              exceed EUR 100.
            </p>
          </section>

          {/* 6. Acceptable Use */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 font-heading">
              6. Acceptable Use
            </h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="space-y-1">
              <li>Attempt to manipulate, jailbreak, or misuse the AI chatbot</li>
              <li>Use automated tools to scrape, crawl, or extract data from the Website beyond what is permitted by our robots.txt</li>
              <li>Attempt unauthorized access to any part of the Website or its infrastructure</li>
              <li>Use the Website for any unlawful purpose or in violation of any applicable law</li>
              <li>Interfere with or disrupt the Website's operation or security</li>
            </ul>
          </section>

          {/* 7. Third-Party Links */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 font-heading">
              7. Third-Party Links
            </h2>
            <p>
              The Website may contain links to third-party websites or services.
              We are not responsible for the content, privacy practices, or availability of these external sites.
              Inclusion of any link does not imply endorsement.
            </p>
          </section>

          {/* 8. Governing Law */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 font-heading">
              8. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of Romania.
              Any disputes arising from or related to these Terms or the Website shall be subject to
              the exclusive jurisdiction of the courts of Romania.
            </p>
            <p className="mt-2">
              For EU consumers: you may also use the European Commission's{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Online Dispute Resolution (ODR) platform
              </a>.
            </p>
          </section>

          {/* 9. Changes */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 font-heading">
              9. Changes to These Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on this page
              with an updated effective date. Your continued use of the Website after changes are posted
              constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* 10. Contact */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 font-heading">
              10. Contact
            </h2>
            <p>
              For questions about these Terms, contact us at:
            </p>
            <ul className="mt-2 space-y-1 text-gray-400">
              <li><strong className="text-white">Smart Business Solutions SRL</strong></li>
              <li>Email: <a href="mailto:contact@x10.ro" className="text-blue-400 hover:underline">contact@x10.ro</a></li>
              <li>Website: <a href="https://x10.ro" className="text-blue-400 hover:underline">x10.ro</a></li>
            </ul>
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

export default TermsPage;
