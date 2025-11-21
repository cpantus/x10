/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import type { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'System Online. I am Unit X1. How can I assist with your automation architecture today?' }
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
            className="mb-4 w-[90vw] md:w-[400px] bg-[#0a0a0a] border border-red-500/30 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.2)]"
          >
            {/* Header */}
            <div className="bg-[#111] p-4 flex justify-between items-center border-b border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <h3 className="text-red-500 font-bold tracking-wider text-xs uppercase">X10 Neural Uplink</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-red-900/50 scrollbar-track-transparent"
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
                        : 'bg-red-950/20 text-red-100 border border-red-500/20 rounded-lg rounded-bl-none'
                    }`}
                  >
                    {msg.role === 'model' && <Terminal className="w-3 h-3 mb-2 text-red-500 inline-block mr-2" />}
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-red-950/10 p-3 rounded-lg border border-red-500/10 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-500 animate-ping" />
                    <span className="text-[10px] text-red-500 uppercase">Processing</span>
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
                  placeholder="Initialize inquiry..."
                  className="flex-1 bg-[#111] border border-white/10 text-white placeholder-gray-600 text-xs p-3 focus:outline-none focus:border-red-500/50 transition-colors rounded"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-red-600 hover:bg-red-500 text-white p-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        className="group w-14 h-14 rounded-full bg-black border border-red-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:bg-red-950/30 transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-red-500" />
        ) : (
          <Bot className="w-6 h-6 text-red-500 group-hover:text-white transition-colors" />
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
