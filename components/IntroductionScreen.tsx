
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, TextMessage } from '../types';
import { sendMessageToBot } from '../services/geminiService';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import SendIcon from './icons/SendIcon';

interface IntroductionScreenProps {
  onNavigate: () => void;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'intro-1',
    role: 'model',
    type: 'text',
    content: "Hello! Welcome to the 'Mangroves and Coastal Ecosystems' interactive guide. 🌊🌴",
  },
  {
    id: 'intro-2',
    role: 'model',
    type: 'text',
    content: "Let's start with the basics. Mangroves are unique trees and shrubs that grow in coastal saline or brackish water. They're characterized by their dense tangled root systems that appear above the water.",
  },
  {
    id: 'intro-3',
    role: 'model',
    type: 'image',
    images: [
      { src: 'https://picsum.photos/seed/mangrove1/600/400', alt: 'Dense mangrove forest' },
      { src: 'https://picsum.photos/seed/mangrove2/600/400', alt: 'Mangrove roots in water' },
    ],
  },
  {
    id: 'intro-4',
    role: 'model',
    type: 'text',
    content: "These ecosystems are incredibly important! They act as a natural barrier, protecting coastal areas from storms and erosion. They are also biodiversity hotspots, providing a nursery for fish and a home for countless species, while playing a crucial role in regulating our climate by capturing massive amounts of carbon.",
  },
  {
    id: 'intro-5',
    role: 'model',
    type: 'button',
    label: "Explore Karnataka's Mangroves",
    onClick: () => {},
  },
];

const MessageBubble: React.FC<{ message: ChatMessage; onNavigate: () => void }> = ({ message, onNavigate }) => {
  const isModel = message.role === 'model';
  const bubbleClass = isModel ? 'bg-teal-800/50 self-start' : 'bg-blue-600/50 self-end';
  const alignmentClass = isModel ? 'items-start' : 'items-end';

  return (
    <div className={`flex w-full mb-4 animate-fade-in gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && <div className="w-10 h-10 flex-shrink-0 bg-teal-700 rounded-full flex items-center justify-center"><BotIcon /></div>}
      <div className={`flex flex-col max-w-lg ${alignmentClass}`}>
        {message.type === 'text' && (
          <div className={`px-4 py-3 rounded-2xl ${bubbleClass}`}>
            <p className="text-white leading-relaxed">{message.content}</p>
          </div>
        )}
        {message.type === 'image' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {message.images.map((img, index) => (
              <img key={index} src={img.src} alt={img.alt} className="rounded-lg shadow-lg" />
            ))}
          </div>
        )}
        {message.type === 'button' && (
          <button
            onClick={onNavigate}
            className="mt-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-full transition-transform transform hover:scale-105 shadow-lg"
          >
            {message.label}
          </button>
        )}
      </div>
       {!isModel && <div className="w-10 h-10 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center"><UserIcon /></div>}
    </div>
  );
};


const IntroductionScreen: React.FC<IntroductionScreenProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialMessages.map(msg =>
      msg.type === 'button' ? { ...msg, onClick: onNavigate } : msg
    )
  );
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
      <header className="p-4 border-b border-white/10 text-center">
        <h1 className="text-2xl font-bold text-teal-300">Mangroves and Coastal Ecosystems 🌊🌴</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} onNavigate={onNavigate} />
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
            placeholder="Ask a question about mangroves..."
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

export default IntroductionScreen;
