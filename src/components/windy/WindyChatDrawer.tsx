'use client';

import React from 'react';
import { AIChatCopilot } from '@/components/dashboard/AIChatCopilot';
import { Storm } from '@/lib/types/cyclone';
import { Bot, X } from 'lucide-react';

interface WindyChatDrawerProps {
  storm: Storm;
  isOpen: boolean;
  onClose: () => void;
}

export const WindyChatDrawer: React.FC<WindyChatDrawerProps> = ({
  storm,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:top-16 sm:left-8 sm:w-[420px] sm:h-[calc(100vh-8.5rem)] z-50 animate-in fade-in slide-in-from-left-4 duration-200">
      <div className="w-full h-full flex flex-col rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-zinc-700/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-black/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide">
                Cyra AI · Intelligence Copilot
              </h3>
              <p className="text-[10px] text-zinc-400">
                Ground-truth synoptic models & Explainable AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <AIChatCopilot storm={storm} />
        </div>
      </div>
    </div>
  );
};
