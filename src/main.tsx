import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import './index.css'

const CatalogPage = lazy(() => import('./pages/CatalogPage'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/catalog" element={
          <Suspense fallback={<div className="min-h-screen bg-[#030303] flex items-center justify-center text-white">Loading...</div>}>
            <CatalogPage />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
