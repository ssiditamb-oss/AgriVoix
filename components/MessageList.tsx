
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { simplifyText, generateAudio } from '../services/geminiService';

interface MessageListProps {
  messages: Message[];
}

const AgriLogo = ({ className = "w-10 h-10" }) => (
  <div className={`${className} bg-white border-2 border-[#E5E1D8] rounded-2xl flex items-center justify-center text-[#2D5A27] shadow-xl`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2L12 22M12 2L15 7M12 2L9 7M12 10L17 14M12 10L7 14M12 16L19 19M12 16L5 19" />
    </svg>
  </div>
);

// Fonctions utilitaires de décodage PCM comme requis par les directives
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const [simplified, setSimplified] = useState<Record<string, string>>({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [isLargeText, setIsLargeText] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stopAudio = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) {}
      sourceRef.current = null;
    }
    setSpeakingId(null);
  };

  const cleanTextForSpeech = (text: string) => {
    return text
      .replace(/[\*\#\_]/g, '')
      .replace(/[\-\+]/g, ' ')
      .replace(/\d+\./g, (match) => match.replace('.', ''))
      .trim();
  };

  const speakText = async (id: string, text: string) => {
    if (speakingId === id) {
      stopAudio();
      return;
    }

    stopAudio();
    setIsAudioLoading(id);

    try {
      const cleanedText = cleanTextForSpeech(text);
      const base64Data = await generateAudio(cleanedText);
      
      if (!base64Data) {
        throw new Error("Échec de la génération audio");
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      const audioBuffer = await decodeAudioData(decode(base64Data), ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        if (sourceRef.current === source) {
          setSpeakingId(null);
          sourceRef.current = null;
        }
      };

      sourceRef.current = source;
      setSpeakingId(id);
      setIsAudioLoading(null);
      source.start();
    } catch (err) {
      console.error(err);
      setIsAudioLoading(null);
      // Optionnel: fallback sur la synthèse native si Gemini TTS échoue
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const handleSimplify = async (id: string, text: string) => {
    if (simplified[id]) {
      const newSimp = { ...simplified };
      delete newSimp[id];
      setSimplified(newSimp);
      return;
    }
    setLoadingIds(prev => new Set(prev).add(id));
    const simpler = await simplifyText(text);
    setSimplified(prev => ({ ...prev, [id]: simpler }));
    setLoadingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col space-y-10 w-full px-1">
      <div className="sticky top-0 z-20 flex justify-end gap-2 pb-4 -mx-2 bg-gradient-to-b from-[#FCF9F2] to-transparent">
        <button 
          onClick={() => setIsLargeText(!isLargeText)}
          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${isLargeText ? 'bg-[#2D5A27] text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
        >
          {isLargeText ? 'Texte Normal' : 'Gros Texte'}
        </button>
      </div>

      {messages.map((msg) => {
        const isSimp = !!simplified[msg.id];
        const displayContent = isSimp ? simplified[msg.id] : msg.content;
        const isCurrentlySpeaking = speakingId === msg.id;
        const isLoadingAudio = isAudioLoading === msg.id;
        
        return (
          <div key={msg.id} className={`flex gap-3 md:gap-6 w-full fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && <div className="hidden sm:block mt-2 shrink-0"><AgriLogo /></div>}
            
            <div className={`w-full sm:max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`
                w-full px-5 py-5 sm:px-8 sm:py-7 leading-relaxed font-semibold transition-all duration-300
                ${isLargeText ? 'text-xl sm:text-2xl' : 'text-[15px] sm:text-[17px]'}
                ${msg.role === 'user' ? 'user-bubble rounded-[24px_24px_4px_24px]' : 'assistant-card text-gray-800 border-l-8 border-l-[#2D5A27] rounded-[24px_24px_24px_4px]'}
                ${isSimp ? 'bg-blue-50/50 border-blue-200 border-l-blue-500' : ''}
              `}>
                <div className="whitespace-pre-wrap">{displayContent}</div>

                {msg.role === 'assistant' && (
                  <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => speakText(msg.id, displayContent)}
                      disabled={isLoadingAudio}
                      className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all ${isCurrentlySpeaking ? 'bg-red-500 text-white' : isLoadingAudio ? 'bg-gray-100 text-gray-400' : 'bg-[#F4EBD0] hover:bg-[#D7C9AA] text-[#8B4513]'}`}
                    >
                      {isLoadingAudio ? (
                        <div className="w-5 h-5 border-2 border-[#8B4513] border-t-transparent rounded-full animate-spin"></div>
                      ) : isCurrentlySpeaking ? (
                        <>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          Arrêter la voix
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                          Voix fluide
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => handleSimplify(msg.id, msg.content)}
                      disabled={loadingIds.has(msg.id)}
                      className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 ${isSimp ? 'bg-blue-100 text-blue-700 border-blue-200 border' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {loadingIds.has(msg.id) ? (
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      )}
                      {isSimp ? 'Conseil complet' : 'Simplifier'}
                    </button>
                  </div>
                )}
              </div>
              <span className="mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
