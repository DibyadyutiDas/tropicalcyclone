import React from 'react';
import { Globe, Compass, Plus, Minus } from 'lucide-react';

export interface WindyActiveLayers {
  windParticles: boolean;
  pressure: boolean;
  rainRadar: boolean;
  thermalIR: boolean;
  waterVapor: boolean;
  waves: boolean;
  gradCam: boolean;
  trackAndCone: boolean;
  satelliteBasemap: boolean;
}

export interface MapNavigationControls {
  zoomIn: () => void;
  zoomOut: () => void;
  recenter: () => void;
  toggleProjection: () => void;
  toggleEarthSpin: () => void;
  isGlobe: boolean;
  isSpinning: boolean;
}

interface WindyLayerBarProps {
  layers: WindyActiveLayers;
  onToggleLayer: (key: keyof WindyActiveLayers) => void;
  activeUnit?: 'kts' | 'kmh' | 'mph';
  theme?: 'dark' | 'light';
  mapControls?: MapNavigationControls | null;
}

export const WindyLayerBar: React.FC<WindyLayerBarProps> = ({
  layers,
  onToggleLayer,
  theme = 'dark',
  mapControls,
}) => {
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
            <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="currentColor">
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
        <div
          className="w-full h-full rounded-full flex items-center justify-center bg-cyan-950"
        >
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
      key: 'gradCam',
      name: 'AI Attention',
      thumbnail: (
        <div
          className="w-full h-full rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, #facc15 0%, #ef4444 50%, #7c3aed 100%)',
          }}
        >
          <span className="text-[7px] font-black text-black font-mono">AI</span>
        </div>
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
    <aside className="select-none flex flex-col items-end gap-1.5 z-30 pointer-events-auto">
      {/* Scrollable container for layers to guarantee no vertical overflow on low-height screens */}
      <div className="flex flex-col items-end gap-1.5 max-h-[calc(100vh-230px)] overflow-y-auto no-scrollbar pr-0.5">
        {layerItems.map((item) => {
          const isActive = layers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => onToggleLayer(item.key)}
              className={`group flex items-center gap-2 pl-3.5 pr-1 py-0.5 rounded-full text-xs transition-all duration-150 shadow-md cursor-pointer ${
                isActive
                  ? isLight
                    ? 'bg-white text-sky-700 font-semibold border border-sky-300 ring-2 ring-sky-100 shadow-md'
                    : 'bg-[#222228] text-white font-medium border border-zinc-600 ring-1 ring-white/10 shadow-lg'
                  : isLight
                  ? 'bg-white/90 hover:bg-white backdrop-blur-md text-slate-700 hover:text-slate-900 border border-slate-250 shadow-xs'
                  : 'bg-[#16161a]/90 hover:bg-[#202026] backdrop-blur-md text-zinc-200 hover:text-white border border-zinc-800'
              }`}
            >
              {/* Left text label */}
              <span className="text-xs tracking-tight whitespace-nowrap leading-none select-none">
                {item.name}
              </span>

              {/* Right circular thumbnail icon (borderless) */}
              <div
                className="w-7 h-7 rounded-full overflow-hidden shrink-0 transition-transform group-hover:scale-105"
              >
                {item.thumbnail}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sleek Map Navigation & 3D Tools Stack (Guaranteed never to overlap layers) */}
      {mapControls && (
        <div className="flex flex-col items-end gap-1.5 pt-1.5 mt-0.5 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-300 w-full">
          {/* Projection & Spin Tools Row */}
          <div className="flex items-center gap-1.5">
            {/* Real 3D Earth Spin Button */}
            <button
              onClick={mapControls.toggleEarthSpin}
              className={`group flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer shadow-md ${
                mapControls.isSpinning
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-300'
                  : isLight
                  ? 'bg-white/90 hover:bg-white text-slate-700 hover:text-cyan-600 border border-slate-250 shadow-xs'
                  : 'bg-[#16161a]/90 hover:bg-[#202026] text-zinc-300 hover:text-cyan-400 border border-zinc-800'
              }`}
              title={mapControls.isSpinning ? 'Stop Real 3D Earth Spin' : 'Spin Real 3D Earth (Planetary Rotation)'}
            >
              <Globe className={`w-4 h-4 ${mapControls.isSpinning ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
            </button>

            {/* 3D Globe vs 2D Flat Toggle */}
            <button
              onClick={mapControls.toggleProjection}
              className={`group flex items-center gap-1 px-3 h-8 rounded-full text-[10px] font-bold font-mono transition-all cursor-pointer shadow-md ${
                mapControls.isGlobe
                  ? isLight
                    ? 'bg-sky-50 text-sky-700 border border-sky-300 ring-1 ring-sky-200'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/40 ring-1 ring-blue-500/30'
                  : isLight
                  ? 'bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-250'
                  : 'bg-[#16161a]/90 hover:bg-[#202026] text-zinc-300 hover:text-white border border-zinc-800'
              }`}
              title={mapControls.isGlobe ? 'Switch to 2D Flat Projection' : 'Switch to 3D Spherical Globe'}
            >
              <span>{mapControls.isGlobe ? '3D GLOBE' : '2D FLAT'}</span>
            </button>
          </div>

          {/* Recenter & Zoom Controls Row */}
          <div className="flex items-center gap-1.5">
            {/* Recenter on Cyclone Eye */}
            <button
              onClick={mapControls.recenter}
              className={`group flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer shadow-md ${
                isLight
                  ? 'bg-white/90 hover:bg-white text-cyan-600 hover:text-cyan-700 border border-slate-250'
                  : 'bg-[#16161a]/90 hover:bg-[#202026] text-cyan-400 hover:text-cyan-300 border border-zinc-800'
              }`}
              title="Recenter on Cyclone Eye"
            >
              <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </button>

            {/* Zoom In / Zoom Out Combined Pill */}
            <div
              className={`flex items-center rounded-full p-0.5 border shadow-md ${
                isLight
                  ? 'bg-white/90 border-slate-250 text-slate-700'
                  : 'bg-[#16161a]/90 border-zinc-800 text-zinc-300'
              }`}
            >
              <button
                onClick={mapControls.zoomIn}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-700/50 light:hover:bg-slate-200 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <div className={`w-px h-3.5 ${isLight ? 'bg-slate-300' : 'bg-zinc-700'}`} />
              <button
                onClick={mapControls.zoomOut}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-700/50 light:hover:bg-slate-200 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
