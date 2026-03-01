
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage, isRateLimited, isSessionLimitReached, isAvailable } from '../services/openRouterService';
import type { ChatMessage } from '../types';

// Conversation starters — reduce friction for first interaction
const STARTERS = [
  { label: 'What do you do?', message: 'What does x10 Automation do?' },
  { label: 'Show me results', message: 'What results have you achieved for clients?' },
  { label: 'How does pricing work?', message: 'How much does it cost to work with x10?' },
  { label: 'Is this right for me?', message: 'How do I know if x10 is right for my business?' },
];

// Simple markdown-ish rendering: **bold**, bullet lists, links
function renderMessageText(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Bullet list items
    if (/^[-•]\s/.test(line)) {
      const content = line.replace(/^[-•]\s/, '');
      elements.push(
        <div key={i} className="flex gap-1.5 ml-1">
          <span className="text-teal-400 shrink-0">•</span>
          <span>{renderInline(content)}</span>
        </div>
      );
      continue;
    }

    // Regular line
    if (line.trim()) {
      elements.push(<p key={i} className={i > 0 ? 'mt-1.5' : ''}>{renderInline(line)}</p>);
    } else if (i > 0 && i < lines.length - 1) {
      elements.push(<div key={i} className="h-1.5" />);
    }
  }

  return <>{elements}</>;
}

// Inline formatting: **bold** and [links](url)
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Match **bold** or [text](url)
  const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/[^\s)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      parts.push(<strong key={match.index} className="font-semibold text-teal-300">{match[2]}</strong>);
    } else if (match[3] && match[4]) {
      // [text](url)
      parts.push(
        <a key={match.index} href={match[4]} target="_blank" rel="noopener noreferrer" className="text-teal-400 underline hover:text-teal-300">
          {match[3]}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to x10 Automation. I\'m Unit x10, your AI strategy advisor. Ask me about our AI agent teams, how we deliver results, or whether we\'re a fit for your business.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    if (isRateLimited()) return;
    if (isSessionLimitReached()) return;

    setShowStarters(false);
    setInput('');

    const userMessage: ChatMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add placeholder for streaming response
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    setTimeout(scrollToBottom, 100);

    try {
      let fullText = '';
      for await (const chunk of sendMessage(messageText)) {
        fullText += chunk;
        const currentText = fullText; // Capture for closure
        setMessages(prev => {
          const updated = [...prev];
          // Update the last model message
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].role === 'model') {
            updated[lastIdx] = { ...updated[lastIdx], text: currentText };
          }
          return updated;
        });
      }

      // If we got no text (empty response), show a fallback
      if (!fullText) {
        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].role === 'model') {
            updated[lastIdx] = { ...updated[lastIdx], text: "I'm having trouble responding right now. Please try again or reach out through our contact form." };
          }
          return updated;
        });
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0 && updated[lastIdx].role === 'model') {
          updated[lastIdx] = { role: 'model', text: "I'm having trouble connecting right now. Please try again in a moment, or reach out through our contact form.", isError: true };
        }
        return updated;
      });
    }

    setIsLoading(false);
  }, [input, isLoading, messages.length, scrollToBottom]);

  const handleStarterClick = useCallback((starterMessage: string) => {
    handleSend(starterMessage);
  }, [handleSend]);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

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
                <h3 className="text-teal-400 font-bold tracking-wider text-xs uppercase">Unit x10</h3>
                {!isAvailable() && (
                  <span className="text-[9px] text-yellow-500/80 uppercase tracking-wide">demo</span>
                )}
              </div>
              <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
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
                    {msg.role === 'model' ? renderMessageText(msg.text) : msg.text}
                  </div>
                </div>
              ))}

              {/* Conversation starters */}
              {showStarters && messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => handleStarterClick(s.message)}
                      className="text-[10px] md:text-xs px-3 py-1.5 rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-400/10 hover:border-teal-400/50 transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing indicator */}
              {isLoading && messages[messages.length - 1]?.text === '' && (
                <div className="flex justify-start">
                  <div className="bg-teal-950/10 p-3 rounded-lg border border-teal-400/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
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
                  disabled={isLoading}
                  className="flex-1 bg-[#111] border border-white/10 text-white placeholder-gray-600 text-xs p-3 focus:outline-none focus:border-teal-400/50 transition-colors rounded disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
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
        onClick={handleToggle}
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
