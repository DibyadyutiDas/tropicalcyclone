'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Loader2,
  Send,
  Terminal,
} from 'lucide-react';
import { Storm, ChatMessage } from '@/lib/types/cyclone';
import { processUserCopilotQuery } from '@/lib/ai/agent';

interface AIChatCopilotProps {
  storm: Storm;
  theme?: 'dark' | 'light';
}

let msgIdCounter = 0;
const generateId = (prefix: string) => `${prefix}-${++msgIdCounter}`;

export const AIChatCopilot: React.FC<AIChatCopilotProps> = ({ storm, theme = 'dark' }) => {
  const isLight = theme === 'light';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: generateId('user'),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString().slice(11, 16) + ' UTC',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await processUserCopilotQuery(textToSend, storm, messages);

      const agentMsg: ChatMessage = {
        id: generateId('agent'),
        sender: 'agent',
        text: response.text,
        timestamp: new Date().toISOString().slice(11, 16) + ' UTC',
        toolCalls: response.toolLogs,
        structuredData: response.structuredCard,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const samplePrompts = [
    `What is happening with ${storm.name}?`,
    'Analyze satellite & SigLIP scores',
    'Get trend & IBTrACS prediction',
    'Search official IMD bulletins',
  ];

  return (
    <div className={`flex flex-col h-full overflow-hidden text-xs ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#16161a] text-zinc-100'
    }`}>
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Timestamp Header */}
            <div className={`flex items-center gap-1 mb-0.5 px-1 text-[9px] font-mono ${
              isLight ? 'text-slate-400' : 'text-zinc-500'
            }`}>
              <span>{msg.sender === 'user' ? 'Operator' : 'Cyra AI'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[95%] rounded-lg px-2.5 py-2 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? isLight
                    ? 'bg-sky-600 text-white'
                    : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                  : isLight
                    ? 'bg-white text-slate-800 border border-slate-200'
                    : 'bg-[#141418] text-zinc-200 border border-zinc-800'
              }`}
            >
              {/* Tool Execution Logs */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className={`mb-2 p-1.5 rounded border font-mono text-[9px] ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d0d10] border-zinc-800'
                }`}>
                  <div className={`flex items-center justify-between font-medium mb-1 ${
                    isLight ? 'text-slate-600' : 'text-zinc-400'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3 h-3" />
                      Tools Executed ({msg.toolCalls.length})
                    </span>
                  </div>

                  <div className={`space-y-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    {msg.toolCalls.map((tool) => (
                      <div key={tool.id} className={`border-t pt-0.5 ${isLight ? 'border-slate-200' : 'border-zinc-800/80'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>→ {tool.toolName}()</span>
                          <span className={`text-[8px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>{tool.executionTimeMs}ms</span>
                        </div>
                        <p className={`text-[8px] mt-0.5 truncate ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                          {tool.resultSnippet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Markdown Content */}
              <div className="whitespace-pre-wrap text-[11px] leading-relaxed">
                {msg.text.split('\n').map((line, idx) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h4 key={idx} className={`font-semibold text-xs mt-1 mb-1 ${
                        msg.sender === 'user' ? 'text-white' : isLight ? 'text-slate-900' : 'text-zinc-100'
                      }`}>
                        {line.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('#### ')) {
                    return (
                      <h5 key={idx} className={`font-medium text-[11px] mt-1 ${
                        msg.sender === 'user' ? 'text-sky-100' : isLight ? 'text-slate-700' : 'text-zinc-300'
                      }`}>
                        {line.replace('#### ', '')}
                      </h5>
                    );
                  }
                  return <p key={idx}>{line}</p>;
                })}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className={`flex items-center gap-2 p-2 rounded border text-[11px] font-mono ${
            isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-[#141418] border-zinc-800 text-zinc-400'
          }`}>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Invoking diagnostic tools...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className={`p-1.5 border-t flex items-center gap-1 overflow-x-auto select-none custom-scrollbar ${
        isLight ? 'border-slate-200 bg-slate-100/90' : 'border-zinc-800 bg-[#121214]'
      }`}>
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={isProcessing}
            className={`h-6 whitespace-nowrap px-2 rounded text-[9px] font-medium transition-colors disabled:opacity-50 border ${
              isLight
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700/60'
            }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className={`p-2 border-t ${
        isLight ? 'border-slate-200 bg-slate-100' : 'border-zinc-800 bg-[#121214]'
      }`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask Cyra AI about ${storm.name}...`}
            disabled={isProcessing}
            className={`h-7 flex-1 rounded px-2.5 text-xs focus:outline-none disabled:opacity-50 border ${
              isLight
                ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-500'
                : 'bg-[#1c1c22] border-zinc-700/80 text-white placeholder-zinc-500 focus:border-zinc-500'
            }`}
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className={`h-7 px-2.5 rounded font-medium text-xs flex items-center justify-center transition-colors disabled:opacity-40 text-white ${
              isLight ? 'bg-sky-600 hover:bg-sky-700' : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            <Send className="w-3 h-3 fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
};
