import React from 'react';
import { Leaf, Sprout } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-lg text-white">
            <Leaf size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Flora<span className="text-green-600">Guard</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
          <span className="hover:text-green-600 cursor-pointer transition-colors flex items-center gap-1">
            <Sprout size={16} /> Diagnosis
          </span>
          <span className="hover:text-green-600 cursor-pointer transition-colors">History</span>
          <span className="hover:text-green-600 cursor-pointer transition-colors">About</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
