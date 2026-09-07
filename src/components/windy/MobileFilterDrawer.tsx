'use client';

import React, { useEffect } from 'react';
import { X, Check, Sun, Moon } from 'lucide-react';
import { WindyActiveLayers } from './WindyLayerBar';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  layers: WindyActiveLayers;
  onToggleLayer: (key: keyof WindyActiveLayers) => void;
  onSetLayers?: (layers: WindyActiveLayers) => void;
  unit?: 'kts' | 'kmh' | 'mph';
  onToggleUnit?: (unit: 'kts' | 'kmh' | 'mph') => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  layers,
  onToggleLayer,
  unit = 'kts',
  onToggleUnit,
  theme = 'dark',
  onToggleTheme,
}) => {
  // Prevent background body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const layerItems: {
    key: keyof WindyActiveLayers;
    name: string;
    thumbnail: React.ReactNode;
  }[] = [
    {
      key: 'windParticles',
      name: 'Wind',
      thumbnail: (
        <div
          className="w-full h-full rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, #22c55e 0%, #15803d 40%, #a855f7 85%, #ec4899 100%)',
          }}
        >
          <svg className="w-3.5 h-3.5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M 12 4 C 17 4 20 7 20 12 C 20 16 16 19 12 19" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2" fill="white" />
          </svg>
        </div>
      ),
    },
    {
      key: 'rainRadar',
      name: 'Weather radar',
      thumbnail: (
        <div
          className="w-full h-full rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #eab308 45%, #ef4444 80%, #a855f7 100%)',
          }}
        >
          <div className="w-2 h-2 rounded-full bg-white/90" />
        </div>
      ),
    },
    {
      key: 'thermalIR',
      name: 'Satellite (IR)',
      thumbnail: (
        <div
          className="w-full h-full rounded-full overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #93c5fd 0%, #1e40af 50%, #0f172a 100%)',
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M 6 8 C 9 6 15 7 18 10 C 16 12 13 11 11 13 C 9 15 10 17 8 18 C 6 16 5 12 6 8 Z" />
            </svg>
          </div>
        </div>
      ),
    },
    {
      key: 'trackAndCone',
      name: 'Track & Cone',
      thumbnail: (
        <div
          className="w-full h-full rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, #ef4444 0%, #991b1b 55%, #475569 90%)',
          }}
        >
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M 12 3 C 17 3 20 7 20 12 C 20 15 17 18 14 19" />
            <path d="M 12 21 C 7 21 4 17 4 12 C 4 9 7 6 10 5" />
            <circle cx="12" cy="12" r="1.5" fill="white" />
          </svg>
        </div>
      ),
    },
    {
      key: 'pressure',
      name: 'Pressure',
      thumbnail: (
        <div className="w-full h-full rounded-full flex items-center justify-center bg-cyan-950">
          <span className="text-[8px] font-bold font-mono text-cyan-300">1008</span>
        </div>
      ),
    },
    {
      key: 'waterVapor',
      name: 'Clouds',
      thumbnail: (
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle, #e2e8f0 0%, #94a3b8 45%, #334155 100%)',
          }}
        />
      ),
    },
    {
      key: 'waves',
      name: 'Waves',
      thumbnail: (
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #d946ef 100%)',
          }}
        />
      ),
    },
    {
      key: 'satelliteBasemap',
      name: 'Satellite Map',
      thumbnail: (
        <div
          className="w-full h-full rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #065f46 0%, #1e3a8a 50%, #0369a1 100%)',
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M 2 12 H 22" />
            </svg>
          </div>
        </div>
      ),
    },
  ];

  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex justify-end md:hidden animate-in fade-in duration-150 select-none">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container */}
      <div
        className={`relative w-[280px] xs:w-[300px] h-full border-l flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200 overflow-hidden ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#18181d] border-zinc-800 text-zinc-100'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Layers"
      >
        {/* Minimal Header */}
        <div
          className={`px-4 py-3.5 border-b flex items-center justify-between shrink-0 ${
            isLight ? 'border-slate-200 bg-slate-50/80' : 'border-zinc-800/80 bg-[#141418]'
          }`}
        >
          <h2 className={`text-sm font-semibold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Layers & Filters
          </h2>
          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isLight
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal Clean Layer List */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1 custom-scrollbar">
          {layerItems.map((item) => {
            const isActive = layers[item.key];
            return (
              <button
                key={item.key}
                onClick={() => onToggleLayer(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? isLight
                      ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-200/80 shadow-xs'
                      : 'bg-[#24242c] text-white font-medium shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-zinc-300 hover:bg-[#1f1f25] hover:text-white'
                }`}
              >
                {/* Left: Thumbnail + Name */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 shadow-sm">
                    {item.thumbnail}
                  </div>
                  <span className="text-xs font-medium tracking-tight">
                    {item.name}
                  </span>
                </div>

                {/* Right: Clean minimal toggle */}
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 flex items-center ${
                    isActive
                      ? 'bg-[#38bdf8] justify-end'
                      : isLight
                      ? 'bg-slate-300 justify-start'
                      : 'bg-zinc-700/80 justify-start'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform ${
                      isActive ? 'text-[#0284c7]' : 'text-transparent'
                    }`}
                  >
                    {isActive && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Minimal Footer: Theme & Unit Switchers */}
        <div
          className={`p-3 border-t flex flex-col gap-2.5 shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141418] border-zinc-800/80'
          }`}
        >
          {/* Theme Switcher */}
          {onToggleTheme && (
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                {isLight ? (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                )}
                Appearance
              </span>
              <div
                className={`flex rounded-lg p-0.5 border text-[10px] font-sans ${
                  isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-[#202026] border-zinc-800'
                }`}
              >
                <button
                  onClick={() => onToggleTheme('dark')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    !isLight
                      ? 'bg-[#38bdf8] text-slate-950 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  Dark
                </button>
                <button
                  onClick={() => onToggleTheme('light')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    isLight
                      ? 'bg-white text-amber-600 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  Light
                </button>
              </div>
            </div>
          )}

          {/* Unit Switcher */}
          {onToggleUnit && (
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                Wind Units
              </span>
              <div
                className={`flex rounded-lg p-0.5 border text-[10px] font-mono ${
                  isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-[#202026] border-zinc-800'
                }`}
              >
                {(['kts', 'kmh', 'mph'] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => onToggleUnit(u)}
                    className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                      unit === u
                        ? isLight
                          ? 'bg-sky-500 text-white font-bold shadow-sm'
                          : 'bg-[#38bdf8] text-black font-bold shadow-sm'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
