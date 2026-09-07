'use client';

import React, { useState } from 'react';
import {
  Bot,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { Storm } from '@/lib/types/cyclone';
import { AIChatCopilot } from './AIChatCopilot';
import { IMDBulletinFeed } from './IMDBulletinFeed';
import { ActionableAlerts } from './ActionableAlerts';

interface RightPanelProps {
  storm: Storm;
}

type RightPanelTab = 'chat' | 'bulletins' | 'alerts';

export const RightPanel: React.FC<RightPanelProps> = ({ storm }) => {
  const [activeTab, setActiveTab] = useState<RightPanelTab>('chat');

  const tabs: {
    id: RightPanelTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'chat',
      label: 'Cyra AI',
      icon: <Bot className="w-3.5 h-3.5" />,
    },
    {
      id: 'bulletins',
      label: 'IMD Feed',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
      badge: storm.coastalAlerts.length ? `${storm.coastalAlerts.length}` : undefined,
    },
  ];

  return (
    <aside className="w-full h-full flex flex-col gap-2 overflow-hidden select-none">
      {/* Tab Switcher Navigation (Uniform button height h-8, exact equal width) */}
      <div className="grid grid-cols-3 p-1 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full h-8 flex items-center justify-center gap-1.5 px-1 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-900 text-white border border-zinc-700 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    tab.id === 'alerts'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-zinc-800 text-cyan-400 border border-zinc-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Body */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'chat' && <AIChatCopilot storm={storm} />}
        {activeTab === 'bulletins' && <IMDBulletinFeed storm={storm} />}
        {activeTab === 'alerts' && <ActionableAlerts storm={storm} />}
      </div>
    </aside>
  );
};
