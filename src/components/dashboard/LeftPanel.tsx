'use client';

import React from 'react';
import {
  Activity,
  Gauge,
  MapPin,
  Navigation,
  Sparkles,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Waves,
} from 'lucide-react';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';
import { getCategoryColor } from '@/lib/utils/colors';

interface LeftPanelProps {
  storm: Storm;
  activePoint: ObservationPoint;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  storm,
  activePoint,
}) => {
  const catStyle = getCategoryColor(activePoint.category);
  const pattern = storm.patternScores;
  const trend = storm.trend;
  const prediction = storm.prediction;

  // Max wind percentage based on 150 kts scale
  const windPercent = Math.min(100, Math.round((activePoint.windSpeedKnots / 150) * 100));

  return (
    <aside className="w-full h-full flex flex-col gap-2.5 overflow-y-auto pr-0.5 text-zinc-200 select-none custom-scrollbar">
      {/* 1. Storm Telemetry Card */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-cyan-400">
              <Gauge className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Storm Telemetry
              </h2>
            </div>
          </div>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
          >
            {activePoint.category}
          </span>
        </div>

        {/* 4 Identical Dimension Telemetry Metric Cards */}
        <div className="grid grid-cols-2 gap-2">
          {/* 1. Max Sustained Wind (MSW) */}
          <div className="h-[92px] rounded-lg bg-black border border-zinc-800/80 p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1 font-medium">
                <svg
                  className="w-3 h-3 text-cyan-400"
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
                MSW
              </span>
              <span className="text-[9px] font-mono text-zinc-400">1-Min</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white tracking-tight font-mono">
                  {activePoint.windSpeedKnots}
                </span>
                <span className="text-xs font-medium text-zinc-400">kts</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">
                {activePoint.windSpeedKmh} km/h
              </p>
            </div>
            {/* Wind Intensity Bar */}
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${windPercent}%` }}
              />
            </div>
          </div>

          {/* 2. Central Pressure */}
          <div className="h-[92px] rounded-lg bg-black border border-zinc-800/80 p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1 font-medium">
                <Activity className="w-3 h-3 text-rose-400" /> Pressure
              </span>
              <span className="text-[9px] font-mono text-zinc-400">hPa</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white tracking-tight font-mono">
                  {activePoint.pressureHpa}
                </span>
                <span className="text-xs font-medium text-zinc-400">hPa</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <TrendingDown className="w-3 h-3 text-emerald-400" />
                <span className="font-mono">{trend.pressureDelta6h} hPa (6h)</span>
              </div>
            </div>
            {/* Pressure Bar */}
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-300"
                style={{ width: `${Math.max(10, 100 - (activePoint.pressureHpa - 900))}%` }}
              />
            </div>
          </div>

          {/* 3. Eye Center Location */}
          <div className="h-[92px] rounded-lg bg-black border border-zinc-800/80 p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-cyan-400" /> Eye Center
              </span>
              <span className="text-[9px] font-mono text-zinc-400">GPS</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-white tracking-tight font-mono">
                  {activePoint.lat.toFixed(1)}°N
                </span>
                <span className="text-xs text-zinc-400 font-mono">, {activePoint.lng.toFixed(1)}°E</span>
              </div>
              <p className="text-[10px] text-zinc-400 truncate">
                {storm.basin.split('(')[0].trim()}
              </p>
            </div>
            {/* GPS Fixed Indicator Bar */}
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400/80 w-full" />
            </div>
          </div>

          {/* 4. Heading & Movement */}
          <div className="h-[92px] rounded-lg bg-black border border-zinc-800/80 p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1 font-medium">
                <Navigation className="w-3 h-3 text-emerald-400" /> Heading
              </span>
              <span className="text-[9px] font-mono text-zinc-400">DIR</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-white tracking-tight truncate">
                  {activePoint.movementHeadingText.split(' ')[0]}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {activePoint.movementHeadingText.includes('(') ? activePoint.movementHeadingText.slice(activePoint.movementHeadingText.indexOf('(')) : ''}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">
                @ {activePoint.movementSpeedKmh} km/h
              </p>
            </div>
            {/* Movement Speed Vector Bar */}
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (activePoint.movementSpeedKmh / 35) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Pattern Analysis (SigLIP zero-shot vision) */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Pattern Analysis
              </h2>
              <p className="text-[10px] text-zinc-400">SigLIP Zero-Shot Vision</p>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-purple-300">
            {pattern.dominantPattern}
          </div>
        </div>

        {/* Pattern Probability Bars */}
        <div className="space-y-2 mb-2.5">
          {[
            { label: 'Developing', value: pattern.developing, barColor: 'bg-cyan-500' },
            { label: 'Organizing', value: pattern.organizing, barColor: 'bg-amber-500' },
            { label: 'Mature (Eye/CDO)', value: pattern.mature, barColor: 'bg-rose-500' },
            { label: 'Weakening', value: pattern.weakening, barColor: 'bg-purple-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-zinc-300 font-medium">{item.label}</span>
                <span className="font-mono font-semibold text-white">
                  {(item.value * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.barColor} rounded-full transition-all duration-300`}
                  style={{ width: `${item.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Structural Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-[11px]">
          <div className="flex items-center justify-between px-2 py-1 rounded bg-black border border-zinc-800/80">
            <span className="text-zinc-400">Eyewall Clarity</span>
            <span className="font-mono font-semibold text-cyan-400">
              {(pattern.eyeWallDefinition * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 rounded bg-black border border-zinc-800/80">
            <span className="text-zinc-400">Symmetry</span>
            <span className="font-mono font-semibold text-purple-400">
              {(pattern.convectiveSymmetry * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Dynamic Trend & Intensification */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-amber-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Trend Analysis
              </h2>
              <p className="text-[10px] text-zinc-400">6-Hour Rate of Change</p>
            </div>
          </div>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider border ${
              trend.trendStatus === 'Rapid Intensification'
                ? 'bg-rose-950/60 text-rose-400 border-rose-600'
                : 'bg-amber-950/60 text-amber-400 border-amber-600'
            }`}
          >
            {trend.trendStatus}
          </span>
        </div>

        {/* Delta Metrics Grid */}
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          <div className="rounded-lg bg-black border border-zinc-800/80 p-1.5 text-center">
            <span className="text-[9px] text-zinc-400 block font-medium">ΔWind (6h)</span>
            <span className="text-xs font-bold text-cyan-400">
              +{trend.windDelta6h} kts
            </span>
          </div>

          <div className="rounded-lg bg-black border border-zinc-800/80 p-1.5 text-center">
            <span className="text-[9px] text-zinc-400 block font-medium">Dvorak</span>
            <span className="text-xs font-bold text-amber-300">
              {trend.dvorakTNumber}
            </span>
          </div>

          <div className="rounded-lg bg-black border border-zinc-800/80 p-1.5 text-center">
            <span className="text-[9px] text-zinc-400 block font-medium">Eye Diam.</span>
            <span className="text-xs font-bold text-purple-300">
              {trend.estimatedEyeDiameterKm ? `${trend.estimatedEyeDiameterKm} km` : 'N/A'}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 leading-relaxed bg-black p-2 rounded-lg border border-zinc-800/80">
          {trend.trendDescription}
        </p>
      </div>

      {/* 4. Landfall ETA & Impact Estimation Widget */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Landfall Impact
              </h2>
              <p className="text-[10px] text-zinc-400">IBTrACS Ensemble Model</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-900 text-rose-400 border border-zinc-800">
            {prediction.landfallProbabilityPct}% Prob
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="p-2 rounded-lg bg-black border border-zinc-800/80">
            <span className="text-[9px] text-zinc-400 block uppercase tracking-wider font-semibold">Target Coast</span>
            <span className="font-semibold text-white leading-tight block mt-0.5 text-[11px]">
              {prediction.predictedLandfallLocation}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div className="p-2 rounded-lg bg-black border border-zinc-800/80">
              <span className="text-[9px] text-zinc-400 block uppercase tracking-wider font-semibold">ETA</span>
              <span className="font-semibold text-amber-300 text-[10px] block mt-0.5">
                {prediction.predictedLandfallTime}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-black border border-zinc-800/80">
              <span className="text-[9px] text-zinc-400 block uppercase tracking-wider font-semibold">Peak Surge</span>
              <span className="font-semibold text-rose-400 text-[10px] flex items-center gap-1 mt-0.5">
                <Waves className="w-3 h-3 shrink-0" />
                <span>{prediction.expectedSurgeHeightMeters} meters</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
