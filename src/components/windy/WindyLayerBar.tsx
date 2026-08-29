'use client';

import React from 'react';
import {
  Flame,
  Globe,
  Layers,
  Sparkles,
  Waves,
  CloudRain,
  Activity,
  Compass,
} from 'lucide-react';

export interface WindyActiveLayers {
  windParticles: boolean;
  rainRadar: boolean;
  thermalIR: boolean;
  waterVapor: boolean;
  waves: boolean;
  pressure: boolean;
  gradCam: boolean;
  trackAndCone: boolean;
  satelliteBasemap: boolean;
}

interface WindyLayerBarProps {
  layers: WindyActiveLayers;
  onToggleLayer: (key: keyof WindyActiveLayers) => void;
  activeUnit?: 'kts' | 'kmh' | 'mph';
}

const WindStreamIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
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

export const WindyLayerBar: React.FC<WindyLayerBarProps> = ({
  layers,
  onToggleLayer,
}) => {
  const layerItems: {
    key: keyof WindyActiveLayers;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    glowClass: string;
  }[] = [
    {
      key: 'windParticles',
      name: 'Wind & Streamlines',
      description: 'Dynamic particle flow & Rankine vortex',
      icon: <WindStreamIcon className="w-4 h-4" />,
      color: 'text-cyan-400',
      glowClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    },
    {
      key: 'rainRadar',
      name: 'Rain & Convection',
      description: 'Doppler radar reflectivity dBZ',
      icon: <CloudRain className="w-4 h-4" />,
      color: 'text-lime-400',
      glowClass: 'bg-lime-500/20 text-lime-300 border-lime-400/80 shadow-[0_0_15px_rgba(163,230,53,0.35)]',
    },
    {
      key: 'thermalIR',
      name: 'Satellite IR (Dvorak)',
      description: 'Cold convective cloud-top temps',
      icon: <Flame className="w-4 h-4" />,
      color: 'text-rose-400',
      glowClass: 'bg-rose-500/20 text-rose-300 border-rose-400/80 shadow-[0_0_15px_rgba(244,63,94,0.35)]',
    },
    {
      key: 'waterVapor',
      name: 'Water Vapor',
      description: 'Upper troposphere moisture channel',
      icon: <Waves className="w-4 h-4" />,
      color: 'text-sky-400',
      glowClass: 'bg-sky-500/20 text-sky-300 border-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.35)]',
    },
    {
      key: 'waves',
      name: 'Waves & Swell',
      description: 'Significant wave height & storm surge',
      icon: <Activity className="w-4 h-4" />,
      color: 'text-blue-400',
      glowClass: 'bg-blue-500/20 text-blue-300 border-blue-400/80 shadow-[0_0_15px_rgba(59,130,246,0.35)]',
    },
    {
      key: 'pressure',
      name: 'Pressure & Isobars',
      description: 'Mean Sea Level Pressure (MSLP)',
      icon: <Compass className="w-4 h-4" />,
      color: 'text-amber-400',
      glowClass: 'bg-amber-500/20 text-amber-300 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    },
    {
      key: 'gradCam',
      name: 'AI Grad-CAM Attention',
      description: 'SigLIP neural focal activations',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'text-purple-400',
      glowClass: 'bg-purple-500/20 text-purple-300 border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.35)]',
    },
    {
      key: 'trackAndCone',
      name: 'Track & Uncertainty Cone',
      description: 'JTWC / IMD official track forecast',
      icon: <Layers className="w-4 h-4" />,
      color: 'text-amber-300',
      glowClass: 'bg-amber-500/20 text-amber-300 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.35)]',
    },
    {
      key: 'satelliteBasemap',
      name: 'Satellite / Dark Basemap',
      description: 'Switch between CARTO Dark & Esri Imagery',
      icon: <Globe className="w-4 h-4" />,
      color: 'text-emerald-400',
      glowClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.35)]',
    },
  ];

  return (
    <aside className="select-none flex flex-col gap-1.5 p-2 rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/90 shadow-2xl z-30 transition-all max-w-[230px]">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-800/80 mb-0.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-zinc-300">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Weather Layers</span>
        </div>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
          WINDY STYLE
        </span>
      </div>

      {/* Layer Buttons Stack */}
      <div className="flex flex-col gap-1">
        {layerItems.map((item) => {
          const isActive = layers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => onToggleLayer(item.key)}
              className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-all duration-200 border ${
                isActive
                  ? item.glowClass
                  : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/70 text-zinc-300 hover:text-white'
              }`}
              title={item.description}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`p-1 rounded-lg transition-transform group-hover:scale-110 ${
                    isActive ? 'bg-black/40' : 'bg-black/30 text-zinc-400'
                  }`}
                >
                  {item.icon}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-xs leading-tight truncate">
                    {item.name}
                  </div>
                </div>
              </div>

              {/* Status Indicator Dot */}
              <div className="shrink-0 ml-1.5 flex items-center">
                <span
                  className={`w-2 h-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] scale-110'
                      : 'bg-zinc-700 opacity-60'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
