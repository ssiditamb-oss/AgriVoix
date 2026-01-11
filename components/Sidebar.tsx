
import React, { useState } from 'react';
import { Message } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNewChat: () => void;
  messages: Message[];
  userName: string;
  setUserName: (name: string) => void;
  userStatus: string;
  setUserStatus: (status: string) => void;
}

const AgriLogo = ({ className = "w-10 h-10" }) => (
  <div className={`${className} bg-[#2D5A27] rounded-xl flex items-center justify-center text-white shadow-lg`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2L12 22M12 2L15 7M12 2L9 7M12 10l5 4M12 10l-5 4M12 16l7 3M12 16l-7 3" />
    </svg>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  onNewChat, 
  messages,
  userName,
  setUserName,
  userStatus,
  setUserStatus
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userName);

  const categories = [
    { 
      label: 'Cultures Maraichères', 
      color: 'text-green-600',
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L12 22M12 2L15 7M12 2L9 7M12 10l5 4M12 10l-5 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
    },
    { 
      label: 'Petit Élevage', 
      color: 'text-orange-600',
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10a4 4 0 014-4h8a4 4 0 014 4v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/></svg>
    },
    { 
      label: 'Vente & Marchés', 
      color: 'text-blue-600',
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" strokeLinecap="round" strokeLinejoin="round"/></svg>
    },
    { 
      label: 'Santé & Sécurité', 
      color: 'text-red-600',
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="11" r="3"/></svg>
    }
  ];

  const handleAction = (callback: () => void) => {
    callback();
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-[#2D5A27]/30 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[60] w-[300px] bg-white border-r border-[#E5E1D8] 
        transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-2xl lg:shadow-none
      `}>
        <div className="p-8 border-b border-[#E5E1D8] flex items-center justify-between">
          <div className="flex items-center gap-4">
             <AgriLogo className="w-10 h-10" />
             <h2 className="text-2xl font-black text-gray-900 brand-font">Menu</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-gray-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-6">
          <button 
            onClick={() => handleAction(onNewChat)}
            className="flex items-center justify-center gap-3 px-6 py-4 text-sm font-black text-white bg-[#2D5A27] rounded-2xl shadow-xl hover:bg-[#1E3F1A] transition-all w-full active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            NOUVEL APPEL
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          <div>
             <h3 className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-6">SERVICES PRO</h3>
             <div className="space-y-2">
               {categories.map((cat) => (
                 <button 
                  key={cat.label} 
                  onClick={() => handleAction(() => {})}
                  className="flex items-center gap-4 w-full px-4 py-3.5 text-sm font-bold text-gray-600 rounded-2xl hover:bg-gray-50 hover:text-[#2D5A27] transition-all group"
                 >
                   <div className={`p-2 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-md transition-all ${cat.color}`}>
                     {cat.icon}
                   </div>
                   {cat.label}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#E5E1D8] bg-gray-50/30">
           <div className={`p-4 bg-white rounded-2xl border ${isEditingProfile ? 'ring-2 ring-[#D2691E] border-[#D2691E]' : 'border-[#E5E1D8] shadow-sm'} transition-all`} onClick={() => !isEditingProfile && setIsEditingProfile(true)}>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D2691E] to-[#8B4513] flex items-center justify-center text-white font-black text-xl shadow-md rotate-2">
                  {userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  {isEditingProfile ? (
                    <div className="space-y-2" onClick={e => e.stopPropagation()}>
                      <input 
                        type="text" value={editName} onChange={e => setEditName(e.target.value)} 
                        className="w-full text-xs font-bold bg-gray-100 rounded-lg px-3 py-2 outline-none border-b-2 border-transparent focus:border-[#D2691E]" 
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button onClick={() => { setUserName(editName); setIsEditingProfile(false); }} className="flex-1 py-1.5 bg-[#D2691E] text-white text-[10px] font-black rounded-lg">OK</button>
                        <button onClick={() => setIsEditingProfile(false)} className="flex-1 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-black rounded-lg">X</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-black text-gray-900 truncate">{userName}</p>
                      <p className="text-[10px] text-[#D2691E] font-extrabold uppercase tracking-tighter truncate">{userStatus}</p>
                    </div>
                  )}
                </div>
             </div>
           </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
