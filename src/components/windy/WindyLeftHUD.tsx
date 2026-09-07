'use client';

import React, { useState } from 'react';
import {
  Bot,
  Brain,
  ChevronLeft,
  Compass,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  Satellite,
  Sun,
  Moon,
} from 'lucide-react';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';
import { LiveCycloneIntelligence } from '@/components/dashboard/LiveCycloneIntelligence';
import { MultiSourceSatelliteIntel } from '@/components/dashboard/MultiSourceSatelliteIntel';
import { CycloneAIEngine } from '@/components/dashboard/CycloneAIEngine';
import { AIChatCopilot } from '@/components/dashboard/AIChatCopilot';

interface WindyLeftHUDProps {
  storm: Storm;
  activePoint: ObservationPoint;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
  onOpenChat?: () => void;
  onRecenter: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export type LeftPanelFeatureTab = 'intelligence' | 'satellite' | 'ai_engine' | 'copilot';

export const WindyLeftHUD: React.FC<WindyLeftHUDProps> = ({
  storm,
  activePoint,
  isOpen: controlledIsOpen,
  onToggleOpen,
  onRecenter,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<LeftPanelFeatureTab>('intelligence');

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (onToggleOpen) {
      onToggleOpen(val);
    } else {
      setInternalIsOpen(val);
    }
  };

  const handleTabClick = (tab: LeftPanelFeatureTab) => {
    if (activeTab === tab && isOpen) {
      setIsOpen(false);
    } else {
      setActiveTab(tab);
      setIsOpen(true);
    }
  };

  const getTabModuleInfo = () => {
    switch (activeTab) {
      case 'intelligence':
        return {
          module: 'MODULE 1',
          title: 'Live Cyclone Intelligence',
          subtitle: 'Data foundation & telemetry normalization',
          tag: 'Realtime Stream',
        };
      case 'satellite':
        return {
          module: 'MODULE 2',
          title: 'Multi-Source Satellite Intel',
          subtitle: 'Multi-sensor pipeline & radiometric calibration',
          tag: '3 Sensor Feeds',
        };
      case 'ai_engine':
        return {
          module: 'MODULE 3',
          title: 'Cyclone AI Engine',
          subtitle: 'SigLIP vision, trend dynamics & IBTrACS ML',
          tag: 'Vision & Physics',
        };
      case 'copilot':
        return {
          module: 'MODULE 4',
          title: 'Cyra AI Copilot',
          subtitle: 'Diagnostic reasoning & synoptic querying',
          tag: 'Cyra AI Agent',
        };
    }
  };

  const info = getTabModuleInfo();
  const isLight = theme === 'light';

  return (
    <div
      className={`flex select-none h-full pointer-events-auto border-r transition-colors ${
        isLight
          ? 'border-slate-200 bg-white text-slate-800'
          : 'border-zinc-800 bg-[#121215] text-zinc-100'
      }`}
    >
      {/* 1. LEFT ACTIVITY BAR (Slim 48px Rail) */}
      <aside
        className={`w-12 h-full flex flex-col items-center justify-between py-3 border-r shrink-0 select-none ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f0f12] border-zinc-800'
        }`}
      >
        {/* Top: Panel Toggle & 4 Feature Icons */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Panel Open/Close Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isOpen
                ? isLight
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/80'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                : isLight
                ? 'text-slate-900 bg-slate-200 border border-slate-300'
                : 'text-white bg-zinc-800 border border-zinc-700'
            }`}
            title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>

          <div className={`w-6 h-px ${isLight ? 'bg-slate-200' : 'bg-zinc-800'}`} />

          {/* 4 Clean Feature Icons */}
          <div className="flex flex-col items-center gap-1.5 w-full">
            {/* 1. Live Intelligence Layer */}
            <button
              onClick={() => handleTabClick('intelligence')}
              className={`group relative w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                isOpen && activeTab === 'intelligence'
                  ? isLight
                    ? 'bg-slate-200 text-slate-900 border border-slate-300'
                    : 'bg-zinc-800 text-white border border-zinc-700'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
              title="1. Live Cyclone Intelligence Layer"
            >
              {isOpen && activeTab === 'intelligence' && (
                <span className={`absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full ${isLight ? 'bg-slate-900' : 'bg-zinc-200'}`} />
              )}
              <Globe className="w-4 h-4 transition-transform group-hover:scale-105" />
            </button>

            {/* 2. Multi-Source Satellite Intelligence */}
            <button
              onClick={() => handleTabClick('satellite')}
              className={`group relative w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                isOpen && activeTab === 'satellite'
                  ? isLight
                    ? 'bg-slate-200 text-slate-900 border border-slate-300'
                    : 'bg-zinc-800 text-white border border-zinc-700'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
              title="2. Multi-Source Satellite Intelligence"
            >
              {isOpen && activeTab === 'satellite' && (
                <span className={`absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full ${isLight ? 'bg-slate-900' : 'bg-zinc-200'}`} />
              )}
              <Satellite className="w-4 h-4 transition-transform group-hover:scale-105" />
            </button>

            {/* 3. Cyclone AI Engine */}
            <button
              onClick={() => handleTabClick('ai_engine')}
              className={`group relative w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                isOpen && activeTab === 'ai_engine'
                  ? isLight
                    ? 'bg-slate-200 text-slate-900 border border-slate-300'
                    : 'bg-zinc-800 text-white border border-zinc-700'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
              title="3. Cyclone AI Engine"
            >
              {isOpen && activeTab === 'ai_engine' && (
                <span className={`absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full ${isLight ? 'bg-slate-900' : 'bg-zinc-200'}`} />
              )}
              <Brain className="w-4 h-4 transition-transform group-hover:scale-105" />
            </button>

            {/* 4. Deep AI Agent / Copilot */}
            <button
              onClick={() => handleTabClick('copilot')}
              className={`group relative w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                isOpen && activeTab === 'copilot'
                  ? isLight
                    ? 'bg-slate-200 text-slate-900 border border-slate-300'
                    : 'bg-zinc-800 text-white border border-zinc-700'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
              title="4. Cyra AI Copilot"
            >
              {isOpen && activeTab === 'copilot' && (
                <span className={`absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full ${isLight ? 'bg-slate-900' : 'bg-zinc-200'}`} />
              )}
              <Bot className="w-4 h-4 transition-transform group-hover:scale-105" />
            </button>
          </div>
        </div>

        {/* Bottom: Theme Toggle & Recenter Storm */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                isLight
                  ? 'text-amber-500 hover:bg-amber-100 hover:text-amber-600'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title={`Switch to ${isLight ? 'Dark' : 'Light'} theme`}
              aria-label="Toggle Theme"
            >
              {isLight ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            onClick={onRecenter}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isLight
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/80'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="Recenter Map on Storm Eye"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. SIDEBAR CONTENT PANEL */}
      {isOpen && (
        <div
          className={`${
            activeTab === 'copilot' ? 'w-[360px] sm:w-[380px]' : 'w-[330px] sm:w-[350px]'
          } flex flex-col h-full overflow-hidden transition-all ${
            isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#121215] text-zinc-200'
          }`}
        >
          {/* Header Bar */}
          <div
            className={`px-3.5 py-2.5 border-b flex items-center justify-between shrink-0 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#151519] border-zinc-800'
            }`}
          >
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${
                  isLight
                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}>
                  {info.module}
                </span>
                <span className={`text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  • {info.tag}
                </span>
              </div>
              <h2 className={`text-[13px] font-bold tracking-tight truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {info.title}
              </h2>
              <p className={`text-[11px] leading-tight truncate ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {info.subtitle}
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                isLight
                  ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700'
              }`}
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Content Panel */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            {activeTab === 'intelligence' && (
              <LiveCycloneIntelligence storm={storm} activePoint={activePoint} theme={theme} />
            )}

            {activeTab === 'satellite' && (
              <MultiSourceSatelliteIntel storm={storm} theme={theme} />
            )}

            {activeTab === 'ai_engine' && (
              <CycloneAIEngine storm={storm} activePoint={activePoint} theme={theme} />
            )}

            {activeTab === 'copilot' && (
              <div className="flex-1 min-h-0 overflow-hidden">
                <AIChatCopilot storm={storm} theme={theme} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
