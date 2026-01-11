
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
      const textarea = document.querySelector('textarea');
      if (textarea) textarea.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="relative">
      <div className={`
        flex items-end w-full bg-white rounded-[36px] border-2 transition-all duration-300 p-3 shadow-2xl
        ${disabled ? 'opacity-70 border-gray-100' : 'border-[#E5E1D8] focus-within:border-[#2D5A27] focus-within:ring-[12px] focus-within:ring-green-50 shadow-green-900/5'}
      `}>
        {/* Photo/Media */}
        <button
          type="button"
          className="p-3.5 text-gray-400 hover:text-[#D2691E] hover:bg-orange-50 rounded-[24px] transition-all active:scale-90"
          disabled={disabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Zone de Texte */}
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Dites AgriVoix, écrivez ici..."
          className="flex-1 px-4 py-3.5 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 font-bold resize-none max-h-48 text-[17px] leading-relaxed outline-none"
          disabled={disabled}
          style={{ height: 'auto' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        {/* Actions Droite */}
        <div className="flex items-center gap-3 pr-1 pb-1">
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <div className="voice-ripple w-14 h-14"></div>
                <div className="voice-ripple w-14 h-14" style={{ animationDelay: '0.5s' }}></div>
              </>
            )}
            <button
              type="button"
              onClick={toggleListening}
              className={`relative z-10 w-14 h-14 rounded-[24px] transition-all flex items-center justify-center active:scale-90 shadow-xl ${
                isListening 
                  ? 'bg-red-500 text-white shadow-red-200' 
                  : 'bg-[#F4EBD0] text-[#8B4513] hover:bg-[#D7C9AA] hover:text-[#2D5A27] shadow-orange-100'
              }`}
              disabled={disabled}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-transform ${isListening ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => handleSubmit()}
            disabled={!text.trim() || disabled}
            className={`w-14 h-14 rounded-[24px] flex items-center justify-center transition-all active:scale-90 shadow-xl ${
              !text.trim() || disabled 
                ? 'bg-gray-100 text-gray-300' 
                : 'bg-[#2D5A27] text-white hover:bg-[#1E3F1A] shadow-green-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
