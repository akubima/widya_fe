import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-center lg:justify-start">
        <Link to="/dashboard/users" className="text-lg font-bold text-blue-600">
          User Dashboard
        </Link>
      </div>
    </header>
  );
};
