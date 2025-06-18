
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="text-3xl font-bold text-sky-500 hover:text-sky-400 transition-colors">
          AInything<span className="text-slate-200">Shorts</span>
        </Link>
        <p className="text-sm text-slate-400">AI-Powered Trends & Insights for Creators</p>
      </div>
    </header>
  );
};

export default Header;
