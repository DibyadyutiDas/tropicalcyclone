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
}

export const WindySpotPicker: React.FC<WindySpotPickerProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 select-none animate-in fade-in zoom-in-95 duration-150">
      <div className="rounded-2xl bg-[#16161a]/95 backdrop-blur-xl border border-zinc-700/80 p-3.5 shadow-2xl flex items-center gap-3 text-zinc-100 min-w-[280px]">
        {/* Directional Wind Arrow */}
        <div className="relative w-10 h-10 rounded-full bg-[#202026] border border-zinc-700 flex items-center justify-center shrink-0 shadow-inner">
          <div
            className="transition-transform duration-300"
            style={{ transform: `rotate(${data.windHeadingDeg}deg)` }}
          >
            <Navigation className="w-5 h-5 text-cyan-400 fill-cyan-400" />
          </div>
        </div>

        {/* Spot Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-semibold">
              <MapPin className="w-3 h-3" />
              <span>
                {data.lat.toFixed(2)}°N, {data.lng.toFixed(2)}°E
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Wind & Pressure Metrics */}
          <div className="flex items-baseline gap-2 mt-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono text-white">
                {data.windSpeedKnots}
              </span>
              <span className="text-xs text-zinc-400 font-medium">kts</span>
              <span className="text-[10px] text-zinc-400 font-mono">
                ({data.windSpeedKmh} km/h)
              </span>
            </div>

            <div className="text-[11px] font-mono text-zinc-300">
              {data.pressureHpa} hPa
            </div>
          </div>

          {/* Distance to storm eye */}
          <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
            <span>To Eye:</span>
            <span className="font-mono text-amber-300 font-medium">
              {Math.round(data.distanceToEyeKm)} km ({data.bearingToEye})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
