import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col items-center justify-center px-6 text-center">
    <h1
      className="text-[8rem] md:text-[12rem] font-bold text-white/10 leading-none select-none font-heading"
    >
      404
    </h1>
    <p className="text-xl text-gray-400 mb-2 -mt-8 font-heading">
      Page not found
    </p>
    <p className="text-sm text-gray-600 mb-8 max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link
      to="/"
      className="px-8 py-3 border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white/5 transition-colors font-mono"
    >
      Back to Home
    </Link>
  </div>
);

export default NotFoundPage;
