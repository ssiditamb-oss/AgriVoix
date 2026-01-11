
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from './services/geminiService';
import { Message } from './types';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import QuickActions from './components/QuickActions';

const AgriLogo = ({ className = "w-10 h-10" }) => (
  <div className={`${className} bg-[#2D5A27] rounded-2xl rotate-3 flex items-center justify-center shadow-lg relative overflow-hidden group transition-transform hover:rotate-0`}>
    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L12 22M12 2L15 7M12 2L9 7M12 10L17 14M12 10L7 14M12 16L19 19M12 16L5 19" />
    </svg>
  </div>
);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Producteur Faso');
  const [userStatus, setUserStatus] = useState('Accès Premium');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await getGeminiResponse(text, history);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response || "Pardon, je n'ai pas pu trouver le conseil. Peux-tu reformuler ?",
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FCF9F2]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onNewChat={clearChat}
        messages={messages}
        userName={userName}
        setUserName={setUserName}
        userStatus={userStatus}
        setUserStatus={setUserStatus}
      />

      <main className="flex-1 flex flex-col relative min-w-0 h-full overflow-hidden">
        {/* En-tête Responsive */}
        <header className="flex items-center justify-between px-4 sm:px-8 h-20 sm:h-24 border-b border-[#E5E1D8] bg-white/90 backdrop-blur-xl shrink-0 z-30">
           <button 
             onClick={() => setIsSidebarOpen(true)} 
             className="lg:hidden p-3 hover:bg-[#F4EBD0] rounded-2xl text-gray-700 transition-all active:scale-90"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>
           
           <div className="flex items-center gap-4">
             <AgriLogo className="w-10 h-10 sm:w-12 h-12" />
             <div className="flex flex-col">
               <h1 className="text-2xl sm:text-3xl font-black text-[#2D5A27] leading-none tracking-tight">AgriVoix</h1>
               <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.25em] mt-1.5">Burkina Faso</span>
             </div>
           </div>

           <button 
             onClick={clearChat}
             className="p-3 sm:px-6 sm:py-3 bg-gray-50 hover:bg-white border border-gray-200 rounded-2xl text-gray-600 font-bold text-sm transition-all flex items-center gap-2 active:scale-95"
           >
             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
             <span className="hidden sm:inline">Nouveau</span>
           </button>
        </header>

        {/* Zone de Discussion */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain pb-48 px-4 sm:px-8">
          <div className="max-w-3xl mx-auto py-8 sm:py-16 min-h-full flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center fade-in py-10">
                <div className="relative mb-14">
                  <div className="absolute inset-0 bg-[#2D5A27]/20 blur-[40px] rounded-full animate-pulse"></div>
                  <div className="relative w-32 h-32 sm:w-40 h-40 bg-white border-4 border-[#F4EBD0] rounded-[40px] sm:rounded-[50px] flex items-center justify-center shadow-2xl rotate-3">
                    <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 h-20 text-[#2D5A27]"><path d="M12 2L12 22M12 2L15 7M12 2L9 7M12 10L17 14M12 10L7 14M12 16L19 19M12 16L5 19" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
                  </div>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
                  Bonjour, <span className="text-[#2D5A27]">{userName.split(' ')[0]}</span>
                </h2>
                <p className="text-gray-500 text-lg sm:text-xl mb-12 max-w-lg font-medium px-6 leading-relaxed">
                  Je suis ton assistant agronome intelligent. Dis-moi ce qui se passe dans ton champ ou ton enclos.
                </p>
                <QuickActions onAction={handleSendMessage} />
              </div>
            ) : (
              <MessageList messages={messages} />
            )}
            
            {isLoading && (
              <div className="mt-12 flex items-center gap-4 fade-in">
                <div className="px-6 py-5 bg-white rounded-3xl border border-[#E5E1D8] shadow-sm flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-[#2D5A27] rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-[#D2691E] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Analyse en cours...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Barre de saisie flottante */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#FCF9F2] via-[#FCF9F2]/95 to-transparent pt-16 pb-6 sm:pb-12 px-4 sm:px-8 z-40">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className="w-8 h-px bg-gray-200"></span>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Excellence Agricole • Burkina Faso</p>
              <span className="w-8 h-px bg-gray-200"></span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
