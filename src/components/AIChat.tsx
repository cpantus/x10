
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import type { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to x10 Automation. I\'m your Strategy Advisor. Ask me about our AI agent teams, industries we serve, or how we can accelerate your business growth.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(scrollToBottom, 100);

    const responseText = await sendMessageToGemini(input);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end pointer-events-auto font-mono">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] md:w-[400px] bg-[#0a0a0a] border border-teal-400/30 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,229,204,0.2)]"
          >
            {/* Header */}
            <div className="bg-[#111] p-4 flex justify-between items-center border-b border-teal-400/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                <h3 className="text-teal-400 font-bold tracking-wider text-xs uppercase">x10 Strategy Advisor</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-teal-900/50 scrollbar-track-transparent"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 text-xs md:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-white text-black rounded-lg rounded-br-none font-sans font-semibold'
                        : 'bg-teal-950/20 text-teal-100 border border-teal-400/20 rounded-lg rounded-bl-none'
                    }`}
                  >
                    {msg.role === 'model' && <Terminal className="w-3 h-3 mb-2 text-teal-400 inline-block mr-2" />}
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-teal-950/10 p-3 rounded-lg border border-teal-400/10 flex items-center gap-2">
                    <span className="w-1 h-1 bg-teal-400 animate-ping" />
                    <span className="text-[10px] text-teal-400 uppercase">Processing</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about our AI solutions..."
                  className="flex-1 bg-[#111] border border-white/10 text-white placeholder-gray-600 text-xs p-3 focus:outline-none focus:border-teal-400/50 transition-colors rounded"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-teal-500 hover:bg-teal-400 text-white p-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group w-14 h-14 rounded-full bg-black border border-teal-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,204,0.3)] hover:bg-teal-950/30 transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-teal-400" />
        ) : (
          <Bot className="w-6 h-6 text-teal-400 group-hover:text-white transition-colors" />
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;

