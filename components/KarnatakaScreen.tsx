
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, TextMessage } from '../types';
import { sendMessageToBot } from '../services/geminiService';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import SendIcon from './icons/SendIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

interface KarnatakaScreenProps {
  onNavigate: () => void;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'karnataka-1',
    role: 'model',
    type: 'text',
    content: "Karnataka has a significant and beautiful mangrove cover along its coast. Let's explore the major regions!",
  },
  {
    id: 'karnataka-2',
    role: 'model',
    type: 'text',
    content: "Here are the key areas:\n1. **Karwar (Uttara Kannada)**: Known for its thick mangrove forests along the Kali river estuary.\n2. **Honnavar and Kumta**: Home to extensive mangrove ecosystems in the Sharavathi and Aghanashini estuaries.\n3. **Aghanashini Estuary**: One of the most pristine mangrove habitats in India.\n4. **Udupi (Kundapura region)**: Features numerous mangrove patches in the Gangolli-Aghanashini river systems.\n5. **Mangalore**: Found at the confluence of the Netravati and Gurupura rivers.",
  },
  {
    id: 'karnataka-3',
    role: 'model',
    type: 'image',
    images: [
      { src: 'https://picsum.photos/seed/karwar/600/400', alt: 'Karwar Mangroves', label: 'Karwar' },
      { src: 'https://picsum.photos/seed/honnavar/600/400', alt: 'Honnavar Mangroves', label: 'Honnavar' },
      { src: 'https://picsum.photos/seed/udupi/600/400', alt: 'Udupi Mangroves', label: 'Udupi' },
      { src: 'https://picsum.photos/seed/mangalore/600/400', alt: 'Mangalore Estuary', label: 'Mangalore' },
    ],
  },
  {
    id: 'karnataka-4',
    role: 'model',
    type: 'text',
    content: "The Karnataka Forest Department, along with local NGOs, is actively involved in conservation efforts, including mangrove plantation drives and creating awareness among local communities to protect these vital ecosystems.",
  },
];

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isModel = message.role === 'model';
  const bubbleClass = isModel ? 'bg-teal-800/50 self-start' : 'bg-blue-600/50 self-end';
  const alignmentClass = isModel ? 'items-start' : 'items-end';

  return (
    <div className={`flex w-full mb-4 animate-fade-in gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && <div className="w-10 h-10 flex-shrink-0 bg-teal-700 rounded-full flex items-center justify-center"><BotIcon /></div>}
      <div className={`flex flex-col max-w-lg ${alignmentClass}`}>
        {message.type === 'text' && (
          <div className={`px-4 py-3 rounded-2xl ${bubbleClass}`}>
            <p className="text-white leading-relaxed" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }}></p>
          </div>
        )}
        {message.type === 'image' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {message.images.map((img, index) => (
              <div key={index} className="relative">
                <img src={img.src} alt={img.alt} className="rounded-lg shadow-lg" />
                {img.label && <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{img.label}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
      {!isModel && <div className="w-10 h-10 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center"><UserIcon /></div>}
    </div>
  );
};

const KarnatakaScreen: React.FC<KarnatakaScreenProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: TextMessage = {
      id: Date.now().toString(),
      role: 'user',
      type: 'text',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botResponseContent = await sendMessageToBot(input, messages);

    const botMessage: TextMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      type: 'text',
      content: botResponseContent,
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  }, [input, isLoading, messages]);


  return (
    <div className="flex flex-col h-full bg-gray-800/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/10">
      <header className="p-4 border-b border-white/10 text-center flex items-center justify-between">
        <button onClick={onNavigate} className="p-2 rounded-full hover:bg-white/10 transition">
          <ChevronLeftIcon />
        </button>
        <h1 className="text-2xl font-bold text-teal-300">Mangroves in Karnataka 🌿</h1>
        <div className="w-8"></div>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex w-full mb-4 animate-fade-in gap-3 justify-start">
             <div className="w-10 h-10 flex-shrink-0 bg-teal-700 rounded-full flex items-center justify-center"><BotIcon /></div>
             <div className="px-4 py-3 rounded-2xl bg-teal-800/50 self-start">
                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse"></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about Karnataka's mangroves..."
            className="flex-1 w-full bg-gray-700/80 border border-gray-600 rounded-full px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-teal-600 text-white rounded-full p-3 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all transform hover:scale-110"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default KarnatakaScreen;
