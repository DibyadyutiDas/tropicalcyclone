'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Loader2,
  Send,
  Terminal,
} from 'lucide-react';
import { Storm, ChatMessage } from '@/lib/types/cyclone';
import { processUserCopilotQuery } from '@/lib/ai/agent';

interface AIChatCopilotProps {
  storm: Storm;
}

let msgIdCounter = 0;
const generateId = (prefix: string) => `${prefix}-${++msgIdCounter}`;

export const AIChatCopilot: React.FC<AIChatCopilotProps> = ({ storm }) => {
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
    <div className="flex flex-col h-full bg-[#16161a] text-zinc-100 overflow-hidden text-xs">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 custom-scrollbar">
        {messages.length === 0 && (
          <div className="p-2.5 rounded-lg bg-[#141418] border border-zinc-800 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-200">
              <span className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-zinc-400" />
                Diagnostic Agent Interface
              </span>
              <span className="text-[9px] font-mono text-zinc-500">8 Tools Connected</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Queries storm telemetry, multi-source satellite streams, SigLIP zero-shot stages, observation trend deltas, and IBTrACS prediction models.
            </p>

            <div className="p-1.5 rounded bg-[#0d0d10] border border-zinc-800/80 font-mono text-[9px] text-zinc-500 grid grid-cols-2 gap-1 mt-1">
              <div>• get_current_storm()</div>
              <div>• get_recent_observations()</div>
              <div>• analyze_satellite()</div>
              <div>• get_trend()</div>
              <div>• get_prediction()</div>
              <div>• search_official_sources()</div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Timestamp Header */}
            <div className="flex items-center gap-1 mb-0.5 px-1 text-[9px] text-zinc-500 font-mono">
              <span>{msg.sender === 'user' ? 'Operator' : 'Agent'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[95%] rounded-lg px-2.5 py-2 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                  : 'bg-[#141418] text-zinc-200 border border-zinc-800'
              }`}
            >
              {/* Tool Execution Logs */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mb-2 p-1.5 rounded bg-[#0d0d10] border border-zinc-800 font-mono text-[9px]">
                  <div className="flex items-center justify-between text-zinc-400 font-medium mb-1">
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-zinc-400" />
                      Tools Executed ({msg.toolCalls.length})
                    </span>
                  </div>

                  <div className="space-y-1 text-zinc-400">
                    {msg.toolCalls.map((tool) => (
                      <div key={tool.id} className="border-t border-zinc-800/80 pt-0.5">
                        <div className="flex items-center justify-between text-zinc-300">
                          <span className="text-zinc-200">→ {tool.toolName}()</span>
                          <span className="text-zinc-500 text-[8px]">{tool.executionTimeMs}ms</span>
                        </div>
                        <p className="text-zinc-500 text-[8px] mt-0.5 truncate">
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
                      <h4 key={idx} className="font-semibold text-zinc-100 text-xs mt-1 mb-1">
                        {line.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('#### ')) {
                    return (
                      <h5 key={idx} className="font-medium text-zinc-300 text-[11px] mt-1">
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
          <div className="flex items-center gap-2 p-2 rounded bg-[#141418] border border-zinc-800 text-[11px] text-zinc-400 font-mono">
            <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />
            <span>Invoking diagnostic tools...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-1.5 border-t border-zinc-800 bg-[#121214] flex items-center gap-1 overflow-x-auto select-none custom-scrollbar">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={isProcessing}
            className="h-6 whitespace-nowrap px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-[9px] font-medium text-zinc-300 transition-colors disabled:opacity-50 border border-zinc-700/60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-2 border-t border-zinc-800 bg-[#121214]">
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
            placeholder={`Ask about ${storm.name}...`}
            disabled={isProcessing}
            className="h-7 flex-1 bg-[#1c1c22] border border-zinc-700/80 rounded px-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="h-7 px-2.5 rounded bg-zinc-700 hover:bg-zinc-600 text-white font-medium text-xs flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <Send className="w-3 h-3 fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
};
