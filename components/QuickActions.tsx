
import React from 'react';

interface QuickActionsProps {
  onAction: (text: string) => void;
}

const actions = [
  { 
    icon: (
      <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M12 2l3 5M12 2L9 5M12 10l5 4M12 10L7 14M12 16l4 3M12 16l-4 3" />
      </svg>
    ), 
    label: 'Conseil Maïs', 
    desc: 'Réussir les semis',
    color: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    text: 'Donne-moi des conseils pour cultiver le maïs.' 
  },
  { 
    icon: (
      <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 10a4 4 0 014-4h8a4 4 0 014 4v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z" />
        <circle cx="9" cy="11" r="1" />
        <circle cx="15" cy="11" r="1" />
      </svg>
    ), 
    label: 'Petit Élevage', 
    desc: 'Santé des poules',
    color: 'border-orange-200 bg-orange-50 text-orange-900',
    text: 'Comment bien soigner mes poulets pour qu\'ils grandissent vite ?' 
  },
  { 
    icon: (
      <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ), 
    label: 'Prix Marché', 
    desc: 'Où vendre cher ?',
    color: 'border-green-200 bg-green-50 text-green-900',
    text: 'Je veux savoir les prix des céréales au marché cette semaine.' 
  },
  { 
    icon: (
      <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4v14a2 2 0 002 2h12a2 2 0 002-2v-5" />
        <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ), 
    label: 'Mon Journal', 
    desc: 'Noter ma journée',
    color: 'border-brown-200 bg-amber-50 text-amber-900',
    text: 'Je veux dire à mon journal que j\'ai terminé le sarclage aujourd\'hui.' 
  },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  return (
    <div className="grid grid-cols-2 gap-5 w-full max-w-2xl mx-auto">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onAction(action.text)}
          className={`
            flex flex-col items-start gap-4 p-6 border-2 rounded-[32px] 
            transition-all duration-300 text-left group shadow-lg shadow-black/5 hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.96]
            ${action.color}
          `}
        >
          <div className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300 text-inherit">
            {action.icon}
          </div>
          <div>
            <p className="text-base font-black mb-1 group-hover:text-black transition-colors">{action.label}</p>
            <p className="text-[11px] font-bold opacity-60 uppercase tracking-widest">{action.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
