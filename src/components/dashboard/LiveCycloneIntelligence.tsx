'use client';

import React from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  TrendingDown,
  Wind,
  Layers,
  Activity,
  Clock,
  Radio,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';

interface LiveCycloneIntelligenceProps {
  storm: Storm;
  activePoint: ObservationPoint;
}

export const LiveCycloneIntelligence: React.FC<LiveCycloneIntelligenceProps> = ({
  storm,
  activePoint,
}) => {
  const trend = storm.trend;
  const prediction = storm.prediction;
  const windPercent = Math.min(100, Math.round((activePoint.windSpeedKnots / 150) * 100));

  return (
    <div className="flex flex-col gap-2.5 p-3 overflow-y-auto custom-scrollbar select-none text-xs">
      {/* 1. Stream Status Banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent border border-emerald-500/20 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Live Normalized Stream
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            15m Cadence
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-zinc-300/90 font-normal">
          Time-synchronized synoptic foundation consolidating Doppler track, scatterometer winds, barometric telemetry, and multi-sensor imagery.
        </p>
      </div>

      {/* 2. 2x2 Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Metric 1: Wind */}
        <div className="p-2.5 rounded-xl bg-[#17171d]/90 hover:bg-[#1c1c24] transition-all border border-zinc-800/80 shadow-sm flex flex-col justify-between min-h-[102px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-cyan-500/15 text-cyan-400">
                <Wind className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-zinc-200">Wind</span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              1-Min MSW
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tight text-white">
                {activePoint.windSpeedKnots}
              </span>
              <span className="text-xs font-semibold text-cyan-400">kts</span>
            </div>
            <div className="text-[11px] font-medium text-zinc-400">
              {activePoint.windSpeedKmh} km/h
            </div>
          </div>

          <div className="h-1.5 w-full bg-zinc-800/90 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]"
              style={{ width: `${windPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Pressure */}
        <div className="p-2.5 rounded-xl bg-[#17171d]/90 hover:bg-[#1c1c24] transition-all border border-zinc-800/80 shadow-sm flex flex-col justify-between min-h-[102px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-rose-500/15 text-rose-400">
                <TrendingDown className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-zinc-200">Pressure</span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              Central Eye
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tight text-white">
                {activePoint.pressureHpa}
              </span>
              <span className="text-xs font-semibold text-rose-400">hPa</span>
            </div>
            <div className="text-[11px] font-medium text-rose-300 flex items-center gap-0.5">
              <span>{trend.pressureDelta6h} hPa</span>
              <span className="text-[9px] text-zinc-500">(6h trend)</span>
            </div>
          </div>

          <div className="h-1.5 w-full bg-zinc-800/90 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.5)]"
              style={{ width: `${Math.min(100, Math.max(15, (1010 - activePoint.pressureHpa) * 1.2))}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Coordinates */}
        <div className="p-2.5 rounded-xl bg-[#17171d]/90 hover:bg-[#1c1c24] transition-all border border-zinc-800/80 shadow-sm flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-emerald-500/15 text-emerald-400">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-zinc-200">Coordinates</span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              WGS84
            </span>
          </div>

          <div className="my-1">
            <div className="text-sm font-bold text-zinc-100 tracking-tight">
              {activePoint.lat.toFixed(2)}°N · {activePoint.lng.toFixed(2)}°E
            </div>
          </div>

          <div className="text-[10px] font-medium text-emerald-400/90 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{activePoint.isForecast ? 'Forecast Projection Point' : 'Observed Cyclone Eye'}</span>
          </div>
        </div>

        {/* Metric 4: Movement */}
        <div className="p-2.5 rounded-xl bg-[#17171d]/90 hover:bg-[#1c1c24] transition-all border border-zinc-800/80 shadow-sm flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-amber-500/15 text-amber-400">
                <Navigation className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-zinc-200">Movement</span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              {activePoint.movementSpeedKmh} km/h
            </span>
          </div>

          <div className="my-1">
            <div className="text-sm font-bold text-zinc-100 truncate tracking-tight">
              {activePoint.movementHeadingText.replace(/\s*\(\d+°\)/, '')} ({activePoint.movementHeadingDeg.toString().padStart(3, '0')}°)
            </div>
          </div>

          <div className="text-[10px] font-medium text-amber-400/90 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{Math.round(activePoint.movementSpeedKmh * 0.54)} kts steering vector</span>
          </div>
        </div>
      </div>

      {/* 3. Track & Satellite Normalization Section */}
      <div className="p-3 rounded-xl bg-[#17171d]/90 border border-zinc-800/80 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
              Track & Sensor Normalization
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-cyan-300 border border-zinc-700/70">
            {storm.timeline.length} Fixes
          </span>
        </div>

        {/* 2 Sub Stat Boxes */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-[#111115] border border-zinc-800/90">
            <div className="text-[10px] text-zinc-400 font-medium">Historical Obs</div>
            <div className="text-xs font-bold text-zinc-100 mt-0.5">
              {storm.timeline.filter((p) => !p.isForecast).length} fixes (24h)
            </div>
          </div>
          <div className="p-2 rounded-lg bg-[#111115] border border-zinc-800/90">
            <div className="text-[10px] text-zinc-400 font-medium">Forecast Window</div>
            <div className="text-xs font-bold text-cyan-300 mt-0.5">
              +{storm.timeline.filter((p) => p.isForecast).length * 6}h Projection
            </div>
          </div>
        </div>

        {/* Channel Details */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/70 text-[11px]">
          <div className="flex justify-between items-center py-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="font-medium text-zinc-300">INSAT-3DR (IR-1)</span>
            </div>
            <span className="text-zinc-200 font-semibold text-right">
              10.8µm <span className="text-cyan-400 font-normal">(-84.2°C core)</span>
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="font-medium text-zinc-300">Meteosat-9 (WV)</span>
            </div>
            <span className="text-zinc-200 font-semibold text-right">
              6.9µm <span className="text-purple-300 font-normal">(Moisture flux)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4. Forecast & Landfall Assessment Section */}
      <div className="p-3 rounded-xl bg-[#17171d]/90 border border-zinc-800/80 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
              Landfall & Impact Assessment
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            {prediction.landfallProbabilityPct}% Prob
          </span>
        </div>

        {/* Full Uncut Landfall Target Card */}
        <div className="p-2.5 rounded-lg bg-[#111115] border border-zinc-800 space-y-1">
          <div className="text-[10px] uppercase font-semibold text-zinc-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-400" />
            <span>Target Landfall Zone</span>
          </div>
          <div className="text-xs font-bold text-zinc-100 leading-snug break-words">
            {prediction.predictedLandfallLocation}
          </div>
        </div>

        <div className="space-y-1.5 text-[11px] pt-1 border-t border-zinc-800/70">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-zinc-400 font-medium">Estimated Arrival:</span>
            <span className="font-bold text-zinc-100 text-right">
              {prediction.predictedLandfallTime}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-zinc-400 font-medium">Storm Surge Risk:</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
              +{prediction.expectedSurgeHeightMeters}m above tide
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
