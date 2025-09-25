
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        Personal Finance Dashboard
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Track, visualize, and analyze your monthly financial health with clarity and gain AI-powered insights.
      </p>
    </header>
  );
};

export default Header;
