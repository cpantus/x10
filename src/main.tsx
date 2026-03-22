import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import CookieConsent from './components/CookieConsent'
import { DesignVariantProvider } from './context/DesignVariantContext'
import { initAnalytics } from './utils/analytics'
import './index.css'

const CatalogPage = lazy(() => import('./pages/CatalogPage'))
const SolutionsPage = lazy(() => import('./pages/SolutionsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const BlogListPage = lazy(() => import('./pages/blog/BlogListPage'))
const BlogPostPage = lazy(() => import('./pages/blog/BlogPostPage'))

// Initialize GA4 with consent checks before React renders
initAnalytics()

const LoadingFallback = () => (
  <div className="min-h-screen bg-[var(--color-bg-primary,#030303)] flex items-center justify-center text-white">Loading...</div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DesignVariantProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/catalog" element={<Suspense fallback={<LoadingFallback />}><CatalogPage /></Suspense>} />
          <Route path="/solutions" element={<Suspense fallback={<LoadingFallback />}><SolutionsPage /></Suspense>} />
          <Route path="/privacy" element={<Suspense fallback={<LoadingFallback />}><PrivacyPage /></Suspense>} />
          <Route path="/terms" element={<Suspense fallback={<LoadingFallback />}><TermsPage /></Suspense>} />
          <Route path="/blog" element={<Suspense fallback={<LoadingFallback />}><BlogListPage /></Suspense>} />
          <Route path="/blog/:slug" element={<Suspense fallback={<LoadingFallback />}><BlogPostPage /></Suspense>} />
          <Route path="*" element={<Suspense fallback={<LoadingFallback />}><NotFoundPage /></Suspense>} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </DesignVariantProvider>
  </React.StrictMode>,
)
