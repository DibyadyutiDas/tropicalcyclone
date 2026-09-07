'use client';

import React, { useState } from 'react';
import {
  Bot,
  Brain,
  Globe,
  Satellite,
} from 'lucide-react';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';
import { LiveCycloneIntelligence } from './LiveCycloneIntelligence';
import { MultiSourceSatelliteIntel } from './MultiSourceSatelliteIntel';
import { CycloneAIEngine } from './CycloneAIEngine';
import { AIChatCopilot } from './AIChatCopilot';

interface LeftPanelProps {
  storm: Storm;
  activePoint: ObservationPoint;
}

export type DashboardLeftTab = 'intelligence' | 'satellite' | 'ai_engine' | 'copilot';

export const LeftPanel: React.FC<LeftPanelProps> = ({
  storm,
  activePoint,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardLeftTab>('intelligence');

  return (
    <aside className="w-full h-full flex flex-col bg-[#141417] rounded-lg border border-zinc-800 overflow-hidden text-zinc-100 select-none">
      {/* 4 Features Top Tab Navigation Bar */}
      <div className="p-1 border-b border-zinc-800 bg-[#101012] grid grid-cols-4 gap-1 shrink-0 font-mono text-[10px]">
        <button
          onClick={() => setActiveTab('intelligence')}
          className={`py-1 px-1 rounded flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'intelligence'
              ? 'bg-zinc-800 text-white font-medium'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title="1. Live Cyclone Intelligence Layer"
        >
          <Globe className="w-3 h-3 shrink-0" />
          <span className="hidden sm:inline truncate">1. Live Intel</span>
        </button>

        <button
          onClick={() => setActiveTab('satellite')}
          className={`py-1 px-1 rounded flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'satellite'
              ? 'bg-zinc-800 text-white font-medium'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title="2. Multi-Source Satellite Intelligence"
        >
          <Satellite className="w-3 h-3 shrink-0" />
          <span className="hidden sm:inline truncate">2. Satellites</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_engine')}
          className={`py-1 px-1 rounded flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'ai_engine'
              ? 'bg-zinc-800 text-white font-medium'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title="3. Cyclone AI Engine"
        >
          <Brain className="w-3 h-3 shrink-0" />
          <span className="hidden sm:inline truncate">3. Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('copilot')}
          className={`py-1 px-1 rounded flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'copilot'
              ? 'bg-zinc-800 text-white font-medium'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title="4. Cyra AI Copilot"
        >
          <Bot className="w-3 h-3 shrink-0" />
          <span className="hidden sm:inline truncate">4. Cyra AI</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {activeTab === 'intelligence' && (
          <LiveCycloneIntelligence storm={storm} activePoint={activePoint} />
        )}

        {activeTab === 'satellite' && (
          <MultiSourceSatelliteIntel storm={storm} />
        )}

        {activeTab === 'ai_engine' && (
          <CycloneAIEngine storm={storm} activePoint={activePoint} />
        )}

        {activeTab === 'copilot' && (
          <div className="flex-1 min-h-0 overflow-hidden">
            <AIChatCopilot storm={storm} />
          </div>
        )}
      </div>
    </aside>
  );
};
