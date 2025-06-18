
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-850 text-center py-6 mt-12 border-t border-slate-700">
      <p className="text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} AInything Short Form Trends. Empowering Creators.
      </p>
    </footer>
  );
};

export default Footer;
