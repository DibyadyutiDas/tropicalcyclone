'use client';

import React from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  TrendingDown,
  Wind,
  Layers,
} from 'lucide-react';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';

interface LiveCycloneIntelligenceProps {
  storm: Storm;
  activePoint: ObservationPoint;
  theme?: 'dark' | 'light';
}

export const LiveCycloneIntelligence: React.FC<LiveCycloneIntelligenceProps> = ({
  storm,
  activePoint,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const trend = storm.trend;
  const prediction = storm.prediction;
  const windPercent = Math.min(100, Math.round((activePoint.windSpeedKnots / 150) * 100));

  return (
    <div className="flex flex-col gap-2.5 p-3 overflow-y-auto custom-scrollbar select-none text-xs">
      {/* 1. Landfall & Impact Assessment Section (Top Priority Advisory Card) */}
      <div className={`p-3 rounded-xl border space-y-2.5 transition-all ${
        isLight
          ? 'bg-amber-50/50 border-amber-200 text-slate-900'
          : 'bg-[#17171d] border-zinc-800 text-zinc-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`p-1 rounded-md ${isLight ? 'bg-amber-100 text-amber-800' : 'bg-zinc-800 text-amber-400'}`}>
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-amber-950' : 'text-zinc-200'}`}>
              Landfall & Impact Assessment
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            isLight
              ? 'bg-amber-100 text-amber-900 border-amber-300/80'
              : 'bg-zinc-800 text-amber-300 border-zinc-700'
          }`}>
            {prediction.landfallProbabilityPct}% Prob
          </span>
        </div>

        {/* Target Landfall Zone Box */}
        <div className={`p-2.5 rounded-lg border space-y-1 ${
          isLight
            ? 'bg-white border-amber-200/80'
            : 'bg-[#111115] border-zinc-800'
        }`}>
          <div className={`text-[10px] uppercase font-bold flex items-center gap-1.5 ${
            isLight ? 'text-amber-800' : 'text-zinc-400'
          }`}>
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Target Landfall Zone</span>
          </div>
          <div className={`text-xs font-bold leading-snug break-words ${
            isLight ? 'text-slate-900' : 'text-zinc-100'
          }`}>
            {prediction.predictedLandfallLocation}
          </div>
        </div>

        <div className={`space-y-1.5 text-[11px] pt-1 border-t ${
          isLight ? 'border-amber-100' : 'border-zinc-800/70'
        }`}>
          <div className="flex justify-between items-center py-0.5">
            <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Estimated Arrival:</span>
            <span className={`font-bold text-right font-mono ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
              {prediction.predictedLandfallTime}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Storm Surge Risk:</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
              isLight
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-zinc-800 text-rose-300 border-zinc-700'
            }`}>
              +{prediction.expectedSurgeHeightMeters}m above tide
            </span>
          </div>
        </div>
      </div>

      {/* 2. 2x2 Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Metric 1: Wind */}
        <div className={`p-2.5 rounded-xl transition-all border flex flex-col justify-between min-h-[102px] ${
          isLight
            ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
            : 'bg-[#17171d] hover:bg-[#1c1c24] border-zinc-800 text-zinc-100'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`p-1 rounded-md ${isLight ? 'bg-cyan-50 text-cyan-600' : 'bg-cyan-500/15 text-cyan-400'}`}>
                <Wind className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>Wind</span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-medium border ${
              isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-zinc-800 text-zinc-400 border-zinc-700/60'
            }`}>
              1-Min MSW
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {activePoint.windSpeedKnots}
              </span>
              <span className={`text-xs font-semibold ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>kts</span>
            </div>
            <div className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              {activePoint.windSpeedKmh} km/h
            </div>
          </div>

          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-zinc-800'}`}>
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isLight ? 'bg-cyan-500' : 'bg-cyan-400'
              }`}
              style={{ width: `${windPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Pressure */}
        <div className={`p-2.5 rounded-xl transition-all border flex flex-col justify-between min-h-[102px] ${
          isLight
            ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
            : 'bg-[#17171d] hover:bg-[#1c1c24] border-zinc-800 text-zinc-100'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`p-1 rounded-md ${isLight ? 'bg-rose-50 text-rose-600' : 'bg-rose-500/15 text-rose-400'}`}>
                <TrendingDown className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>Pressure</span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-medium border ${
              isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-zinc-800 text-zinc-400 border-zinc-700/60'
            }`}>
              Central Eye
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {activePoint.pressureHpa}
              </span>
              <span className={`text-xs font-semibold ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>hPa</span>
            </div>
            <div className={`text-[11px] font-medium flex items-center gap-0.5 ${isLight ? 'text-rose-600' : 'text-rose-300'}`}>
              <span>{trend.pressureDelta6h} hPa</span>
              <span className={`text-[9px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>(6h trend)</span>
            </div>
          </div>

          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-zinc-800'}`}>
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isLight ? 'bg-rose-500' : 'bg-rose-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(15, (1010 - activePoint.pressureHpa) * 1.2))}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Coordinates */}
        <div className={`p-2.5 rounded-xl transition-all border flex flex-col justify-between min-h-[96px] ${
          isLight
            ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
            : 'bg-[#17171d] hover:bg-[#1f1f26] border-zinc-800 text-zinc-100'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`p-1 rounded-md ${isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/15 text-emerald-400'}`}>
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>Coordinates</span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-medium border ${
              isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-zinc-800 text-zinc-400 border-zinc-700/60'
            }`}>
              WGS84
            </span>
          </div>

          <div className="my-1">
            <div className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
              {activePoint.lat.toFixed(2)}°N · {activePoint.lng.toFixed(2)}°E
            </div>
          </div>

          <div className={`text-[10px] font-medium flex items-center gap-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400/90'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{activePoint.isForecast ? 'Forecast Projection Point' : 'Observed Cyclone Eye'}</span>
          </div>
        </div>

        {/* Metric 4: Movement */}
        <div className={`p-2.5 rounded-xl transition-all border flex flex-col justify-between min-h-[96px] ${
          isLight
            ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
            : 'bg-[#17171d] hover:bg-[#1f1f26] border-zinc-800 text-zinc-100'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`p-1 rounded-md ${isLight ? 'bg-amber-50 text-amber-600' : 'bg-amber-500/15 text-amber-400'}`}>
                <Navigation className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>Movement</span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-medium border ${
              isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-zinc-800 text-zinc-400 border-zinc-700/60'
            }`}>
              {activePoint.movementSpeedKmh} km/h
            </span>
          </div>

          <div className="my-1">
            <div className={`text-sm font-bold truncate tracking-tight ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
              {activePoint.movementHeadingText.replace(/\s*\(\d+°\)/, '')} ({activePoint.movementHeadingDeg.toString().padStart(3, '0')}°)
            </div>
          </div>

          <div className={`text-[10px] font-medium flex items-center gap-1 ${isLight ? 'text-amber-700' : 'text-amber-400/90'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>{Math.round(activePoint.movementSpeedKmh * 0.54)} kts steering vector</span>
          </div>
        </div>
      </div>

      {/* 3. Track & Satellite Normalization Section */}
      <div className={`p-3 rounded-xl border space-y-2.5 ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#17171d] border-zinc-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`} />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
              Track & Sensor Normalization
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            isLight ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-zinc-800 text-cyan-300 border-zinc-700'
          }`}>
            {storm.timeline.length} Fixes
          </span>
        </div>

        {/* 2 Sub Stat Boxes */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className={`p-2 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800/90'}`}>
            <div className={`text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Historical Obs</div>
            <div className={`text-xs font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
              {storm.timeline.filter((p) => !p.isForecast).length} fixes (24h)
            </div>
          </div>
          <div className={`p-2 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800/90'}`}>
            <div className={`text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Forecast Window</div>
            <div className={`text-xs font-bold mt-0.5 ${isLight ? 'text-sky-600' : 'text-cyan-300'}`}>
              +{storm.timeline.filter((p) => p.isForecast).length * 6}h Projection
            </div>
          </div>
        </div>

        {/* Channel Details */}
        <div className={`space-y-1.5 pt-2 border-t text-[11px] ${isLight ? 'border-slate-200' : 'border-zinc-800/70'}`}>
          <div className="flex justify-between items-center py-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>INSAT-3DR (IR-1)</span>
            </div>
            <span className={`font-semibold text-right ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
              10.8µm <span className={`font-normal ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>(-84.2°C core)</span>
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Meteosat-9 (WV)</span>
            </div>
            <span className={`font-semibold text-right ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
              6.9µm <span className={`font-normal ${isLight ? 'text-purple-600' : 'text-purple-300'}`}>(Moisture flux)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
