'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Loader2,
  Send,
  ShieldAlert,
  Sparkles,
  Terminal,
  TrendingUp,
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
      await new Promise((resolve) => setTimeout(resolve, 600));

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
    'When and where is landfall expected?',
    'Explain SigLIP pattern scores & Grad-CAM',
    'Is rapid intensification occurring?',
    'Show official IMD alerts & evacuations',
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="px-3.5 py-2.5 border-b border-zinc-800 bg-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-cyan-400">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
              Grounded AI Copilot
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 text-emerald-400 font-semibold border border-zinc-800">
                RAG + TOOLS
              </span>
            </h3>
            <p className="text-[10px] text-zinc-400">8 Diagnostic GIS Tools</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender Name & Timestamp */}
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-zinc-400">
              <span className="font-medium text-zinc-400">
                {msg.sender === 'user' ? 'Operator' : 'StormSense'}
              </span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[94%] rounded-xl px-3 py-2 text-xs ${
                msg.sender === 'user'
                  ? 'bg-zinc-800 text-white rounded-br-none border border-zinc-700'
                  : 'bg-black text-zinc-200 border border-zinc-800 rounded-bl-none'
              }`}
            >
              {/* Tool Execution Logs (If any) */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mb-2 p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      Executed {msg.toolCalls.length} Diagnostic Tools
                    </span>
                    <span className="text-[9px] text-zinc-400">Autonomous</span>
                  </div>

                  <div className="space-y-1">
                    {msg.toolCalls.map((tool) => (
                      <div key={tool.id} className="border-t border-zinc-800 pt-1">
                        <div className="flex items-center justify-between text-zinc-300">
                          <span className="text-emerald-400">⚡ {tool.toolName}()</span>
                          <span className="text-[9px] text-zinc-400">{tool.executionTimeMs}ms</span>
                        </div>
                        <p className="text-zinc-400 text-[9px] mt-0.5 truncate">
                          {tool.resultSnippet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Markdown Content */}
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.text.split('\n').map((line, idx) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h4 key={idx} className="font-semibold text-cyan-300 text-xs mt-1 mb-1">
                        {line.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('#### ')) {
                    return (
                      <h5 key={idx} className="font-medium text-amber-300 text-[11px] mt-1">
                        {line.replace('#### ', '')}
                      </h5>
                    );
                  }
                  return <p key={idx}>{line}</p>;
                })}
              </div>

              {/* Structured Output Cards */}
              {msg.structuredData && (
                <div className="mt-2 pt-2 border-t border-zinc-800">
                  {msg.structuredData.type === 'landfall_card' && (
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
                      <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Predicted Landfall
                      </div>
                      <div className="text-white font-medium">
                        {String(msg.structuredData.data.location)}
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                        <span>ETA: <strong className="text-amber-300">{String(msg.structuredData.data.eta)}</strong></span>
                        <span>Surge: <strong className="text-rose-400">{String(msg.structuredData.data.surge)}</strong></span>
                      </div>
                    </div>
                  )}

                  {msg.structuredData.type === 'trend_card' && (
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Trend Diagnosis
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        <div>ΔWind: <strong className="text-cyan-400">{String(msg.structuredData.data.windDelta)}</strong></div>
                        <div>ΔPressure: <strong className="text-emerald-400">{String(msg.structuredData.data.pressureDelta)}</strong></div>
                        <div>Dvorak: <strong className="text-amber-300">{String(msg.structuredData.data.dvorak)}</strong></div>
                        <div>Pattern: <strong className="text-purple-300">{String(msg.structuredData.data.dominantPattern)}</strong></div>
                      </div>
                    </div>
                  )}

                  {msg.structuredData.type === 'xai_card' && (
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
                      <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5" /> Convective Diagnostics
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        <div>Sensor: <strong className="text-white">{String(msg.structuredData.data.sensor)}</strong></div>
                        <div>Core Temp: <strong className="text-cyan-300">{String(msg.structuredData.data.coreTemp)}</strong></div>
                        <div>Eyewall Index: <strong className="text-emerald-300">{String(msg.structuredData.data.eyeWallIndex)}</strong></div>
                        <div>Stage: <strong className="text-purple-300">{String(msg.structuredData.data.dominantStage)}</strong></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-black border border-zinc-800 text-xs text-cyan-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Agent reasoning and invoking GIS tools...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Chips (Uniform button height h-7) */}
      <div className="p-2 border-t border-zinc-800 bg-black flex items-center gap-1.5 overflow-x-auto select-none custom-scrollbar">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={isProcessing}
            className="h-7 whitespace-nowrap px-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[10px] font-medium text-zinc-300 transition-colors disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box (Uniform h-8 elements) */}
      <div className="p-2.5 border-t border-zinc-800 bg-black">
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
            placeholder={`Ask StormSense about ${storm.name}...`}
            disabled={isProcessing}
            className="h-8 flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="h-8 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
};
