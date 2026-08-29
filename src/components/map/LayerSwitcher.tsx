'use client';

import React from 'react';
import {
  Flame,
  Globe,
  Layers,
  Sparkles,
  Waves,
} from 'lucide-react';

export interface ActiveLayersState {
  windParticles: boolean;
  thermalIR: boolean;
  waterVapor: boolean;
  gradCam: boolean;
  trackAndCone: boolean;
  satelliteBasemap: boolean;
}

interface LayerSwitcherProps {
  layers: ActiveLayersState;
  onToggleLayer: (layerKey: keyof ActiveLayersState) => void;
}

const CycloneWindIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M 12 3 C 16.5 3 20 6.5 20 11 C 20 13.8 18 16 15.5 16.8" />
    <path d="M 12 21 C 7.5 21 4 17.5 4 13 C 4 10.2 6 8 8.5 7.2" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

export const LayerSwitcher: React.FC<LayerSwitcherProps> = ({
  layers,
  onToggleLayer,
}) => {
  const layerButtons: {
    key: keyof ActiveLayersState;
    label: string;
    shortLabel?: string;
    icon: React.ReactNode;
    activeClass: string;
  }[] = [
    {
      key: 'windParticles',
      label: 'Wind Particles',
      shortLabel: 'Wind',
      icon: <CycloneWindIcon className="w-3.5 h-3.5" />,
      activeClass: 'bg-zinc-900 text-cyan-400 border-cyan-500',
    },
    {
      key: 'thermalIR',
      label: 'Thermal IR',
      shortLabel: 'IR',
      icon: <Flame className="w-3.5 h-3.5" />,
      activeClass: 'bg-zinc-900 text-rose-400 border-rose-500',
    },
    {
      key: 'waterVapor',
      label: 'Water Vapor',
      shortLabel: 'Vapor',
      icon: <Waves className="w-3.5 h-3.5" />,
      activeClass: 'bg-zinc-900 text-sky-400 border-sky-500',
    },
    {
      key: 'gradCam',
      label: 'Grad-CAM',
      shortLabel: 'AI CAM',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      activeClass: 'bg-zinc-900 text-purple-400 border-purple-500',
    },
    {
      key: 'trackAndCone',
      label: 'Track & Cone',
      shortLabel: 'Track',
      icon: <Layers className="w-3.5 h-3.5" />,
      activeClass: 'bg-zinc-900 text-amber-400 border-amber-500',
    },
    {
      key: 'satelliteBasemap',
      label: 'Satellite',
      shortLabel: 'Sat',
      icon: <Globe className="w-3.5 h-3.5" />,
      activeClass: 'bg-zinc-900 text-emerald-400 border-emerald-500',
    },
  ];

  return (
    <div className="w-full bg-zinc-950 border-b border-zinc-800 px-3 py-1.5 flex items-center gap-2.5 select-none z-10 shrink-0">
      <div className="flex items-center gap-1.5 pr-2.5 text-[10px] uppercase font-bold tracking-widest text-zinc-400 border-r border-zinc-800 shrink-0">
        <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>LAYERS</span>
      </div>

      <div className="flex-1 grid grid-cols-6 gap-1.5 min-w-0">
        {layerButtons.map((btn) => {
          const isActive = layers[btn.key];
          return (
            <button
              key={btn.key}
              onClick={() => onToggleLayer(btn.key)}
              className={`h-7 flex items-center justify-center gap-1.5 px-1.5 rounded-md text-xs font-semibold border transition-colors whitespace-nowrap overflow-hidden ${
                isActive
                  ? btn.activeClass
                  : 'bg-black text-zinc-400 border-zinc-800/90 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
              title={btn.label}
            >
              {btn.icon}
              <span className="truncate">{btn.shortLabel || btn.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
