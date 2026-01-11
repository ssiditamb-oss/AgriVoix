
import React from 'react';

interface HeaderProps {
  onClear: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClear }) => {
  return (
    <header className="bg-green-700 text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-green-700 font-bold text-xl">A</span>
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">AgriVoix</h1>
          <p className="text-xs text-green-100">Conseiller du Faso</p>
        </div>
      </div>
      
      <button 
        onClick={onClear}
        className="p-2 hover:bg-green-600 rounded-full transition-colors"
        title="Nouvelle discussion"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </header>
  );
};

export default Header;
