'use client';

import React from 'react';

interface WindyLegendProps {
  activeLayer: string;
  unit: 'kts' | 'kmh' | 'mph';
  onToggleUnit: (unit: 'kts' | 'kmh' | 'mph') => void;
}

export const WindyLegend: React.FC<WindyLegendProps> = ({
  activeLayer = 'wind',
  unit = 'kts',
  onToggleUnit,
}) => {
  // Wind scale values for kts, kmh, mph
  const scales = {
    kts: [
      { val: '0', color: '#1e3a8a' },
      { val: '15', color: '#0284c7' },
      { val: '30', color: '#06b6d4' },
      { val: '45', color: '#10b981' },
      { val: '64', color: '#eab308' },
      { val: '80', color: '#f97316' },
      { val: '100', color: '#ef4444' },
      { val: '120', color: '#a855f7' },
      { val: '140+', color: '#ec4899' },
    ],
    kmh: [
      { val: '0', color: '#1e3a8a' },
      { val: '30', color: '#0284c7' },
      { val: '55', color: '#06b6d4' },
      { val: '80', color: '#10b981' },
      { val: '120', color: '#eab308' },
      { val: '150', color: '#f97316' },
      { val: '185', color: '#ef4444' },
      { val: '220', color: '#a855f7' },
      { val: '260+', color: '#ec4899' },
    ],
    mph: [
      { val: '0', color: '#1e3a8a' },
      { val: '20', color: '#0284c7' },
      { val: '35', color: '#06b6d4' },
      { val: '50', color: '#10b981' },
      { val: '74', color: '#eab308' },
      { val: '95', color: '#f97316' },
      { val: '115', color: '#ef4444' },
      { val: '140', color: '#a855f7' },
      { val: '160+', color: '#ec4899' },
    ],
  };

  const currentScale = scales[unit] || scales.kts;

  return (
    <div className="select-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800/90 shadow-2xl text-zinc-300 text-xs">
      {/* Layer title & Unit switcher button */}
      <div className="flex items-center gap-1.5 pr-2 border-r border-zinc-800/80">
        <span className="font-semibold text-white uppercase text-[10px] tracking-wider">
          Wind Speed
        </span>
        <div className="flex bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 text-[10px] font-mono">
          {(['kts', 'kmh', 'mph'] as const).map((u) => (
            <button
              key={u}
              onClick={() => onToggleUnit(u)}
              className={`px-1.5 py-0.5 rounded-md transition-colors ${
                unit === u
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Windy Gradient Ramp */}
      <div className="flex flex-col gap-0.5">
        {/* Color bar gradient */}
        <div
          className="h-2.5 w-44 sm:w-56 rounded-full overflow-hidden border border-white/10"
          style={{
            background:
              'linear-gradient(to right, #1e3a8a, #0284c7, #06b6d4, #10b981, #eab308, #f97316, #ef4444, #a855f7, #ec4899, #ffffff)',
          }}
        />
        {/* Scale labels */}
        <div className="flex justify-between text-[9px] font-mono text-zinc-400 px-0.5">
          {currentScale.map((s, idx) => (
            <span key={idx}>{s.val}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
