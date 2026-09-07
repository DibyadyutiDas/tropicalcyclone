'use client';

import React from 'react';
import {
  Compass,
  MapPin,
  Wind,
  X,
  Gauge,
  Navigation,
} from 'lucide-react';

export interface SpotPickerData {
  lat: number;
  lng: number;
  windSpeedKnots: number;
  windSpeedKmh: number;
  windHeadingDeg: number;
  pressureHpa: number;
  distanceToEyeKm: number;
  bearingToEye: string;
}

interface WindySpotPickerProps {
  data: SpotPickerData | null;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const WindySpotPicker: React.FC<WindySpotPickerProps> = ({ data, onClose, theme = 'dark' }) => {
  if (!data) return null;
  const isLight = theme === 'light';

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 select-none animate-in fade-in zoom-in-95 duration-150">
      <div className={`rounded-2xl backdrop-blur-xl p-3.5 shadow-2xl flex items-center gap-3 min-w-[280px] border transition-colors ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/40'
          : 'bg-[#16161a]/95 border-zinc-700/80 text-zinc-100 shadow-black/60'
      }`}>
        {/* Directional Wind Arrow */}
        <div className={`relative w-10 h-10 rounded-full border flex items-center justify-center shrink-0 shadow-inner ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#202026] border-zinc-700'
        }`}>
          <div
            className="transition-transform duration-300"
            style={{ transform: `rotate(${data.windHeadingDeg}deg)` }}
          >
            <Navigation className={`w-5 h-5 ${isLight ? 'text-cyan-600 fill-cyan-600' : 'text-cyan-400 fill-cyan-400'}`} />
          </div>
        </div>

        {/* Spot Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className={`flex items-center gap-1 text-[11px] font-mono font-semibold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
              <MapPin className="w-3 h-3" />
              <span>
                {data.lat.toFixed(2)}°N, {data.lng.toFixed(2)}°E
              </span>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Wind & Pressure Metrics */}
          <div className="flex items-baseline gap-2 mt-0.5">
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {data.windSpeedKnots}
              </span>
              <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>kts</span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                ({data.windSpeedKmh} km/h)
              </span>
            </div>

            <div className={`text-[11px] font-mono font-medium ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
              {data.pressureHpa} hPa
            </div>
          </div>

          {/* Distance to storm eye */}
          <div className={`text-[10px] flex items-center gap-1 mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            <span>To Eye:</span>
            <span className={`font-mono font-medium ${isLight ? 'text-amber-600 font-semibold' : 'text-amber-300'}`}>
              {Math.round(data.distanceToEyeKm)} km ({data.bearingToEye})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
