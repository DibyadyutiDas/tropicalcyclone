'use client';

import React, { useState } from 'react';
import {
  Activity,
  Bot,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Flame,
  Gauge,
  MapPin,
  Navigation,
  Radio,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Waves,
} from 'lucide-react';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';
import { getCategoryColor } from '@/lib/utils/colors';

interface WindyLeftHUDProps {
  storm: Storm;
  activePoint: ObservationPoint;
  onOpenChat: () => void;
  onRecenter: () => void;
}

type HUDTab = 'telemetry' | 'landfall' | 'advisories';

export const WindyLeftHUD: React.FC<WindyLeftHUDProps> = ({
  storm,
  activePoint,
  onOpenChat,
  onRecenter,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<HUDTab>('telemetry');

  const catStyle = getCategoryColor(activePoint.category);
  const pattern = storm.patternScores;
  const trend = storm.trend;
  const prediction = storm.prediction;

  // Wind intensity percentage (scale 0-150 kts)
  const windPercent = Math.min(100, Math.round((activePoint.windSpeedKnots / 150) * 100));

  if (isCollapsed) {
    return (
      <div className="select-none z-30 animate-in fade-in duration-200">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 shadow-2xl text-zinc-200 hover:text-white hover:border-cyan-500/60 transition-all group"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1">
              {storm.name}
              <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${catStyle.bg} ${catStyle.text}`}>
                {activePoint.category}
              </span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {activePoint.windSpeedKnots} kts • {activePoint.pressureHpa} hPa
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform ml-1" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-80 max-h-[calc(100vh-8.5rem)] flex flex-col rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/90 shadow-2xl z-30 select-none overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between shrink-0 bg-black/40">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
              <h2 className="text-sm font-bold text-white tracking-wide truncate">
                {storm.name}
              </h2>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium truncate">
              {storm.basin} • {storm.code}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
          >
            {activePoint.category}
          </span>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-1"
            title="Collapse HUD"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="p-3 grid grid-cols-2 gap-2 border-b border-zinc-800/60 bg-black/20 shrink-0">
        {/* Wind Speed (MSW) */}
        <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-semibold text-cyan-400 flex items-center gap-1">
              <svg className="w-3 h-3 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M 12 3 C 16.5 3 20 6.5 20 11 C 20 13.8 18 16 15.5 16.8" />
                <path d="M 12 21 C 7.5 21 4 17.5 4 13 C 4 10.2 6 8 8.5 7.2" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
              MSW
            </span>
            <span className="text-[9px] font-mono">1-Min</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white">
                {activePoint.windSpeedKnots}
              </span>
              <span className="text-xs text-zinc-400">kts</span>
            </div>
            <p className="text-[10px] font-mono text-zinc-400">
              {activePoint.windSpeedKmh} km/h
            </p>
          </div>
          <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${windPercent}%` }}
            />
          </div>
        </div>

        {/* Central Pressure */}
        <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-semibold text-rose-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-rose-400" />
              Pressure
            </span>
            <span className="text-[9px] font-mono">Central</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white">
                {activePoint.pressureHpa}
              </span>
              <span className="text-xs text-zinc-400">hPa</span>
            </div>
            <p className="text-[10px] font-mono text-rose-400">
              {trend.pressureDelta6h} hPa (6h)
            </p>
          </div>
          <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-400 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(10, (1010 - activePoint.pressureHpa) * 1.2))}%` }}
            />
          </div>
        </div>

        {/* Position Coordinates */}
        <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex flex-col justify-between">
          <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            Coordinates
          </div>
          <div className="my-0.5">
            <div className="text-xs font-mono font-bold text-white">
              {activePoint.lat.toFixed(2)}°N
            </div>
            <div className="text-xs font-mono font-bold text-white">
              {activePoint.lng.toFixed(2)}°E
            </div>
          </div>
          <p className="text-[9px] text-zinc-400 font-mono">
            {activePoint.isForecast ? 'Forecast Position' : 'Observed Eye'}
          </p>
        </div>

        {/* Movement Bearing & Forward Speed */}
        <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex flex-col justify-between">
          <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1">
            <Navigation className="w-3 h-3 text-amber-400" />
            Movement
          </div>
          <div className="my-0.5">
            <div className="text-sm font-bold font-mono text-white">
              {activePoint.movementHeadingText}
            </div>
            <p className="text-xs font-mono text-amber-300">
              {activePoint.movementSpeedKmh} km/h
            </p>
          </div>
          <p className="text-[9px] text-zinc-400 font-mono">
            {activePoint.movementHeadingDeg}° Bearing
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="p-2 border-b border-zinc-800/80 bg-black/30 shrink-0">
        <div className="grid grid-cols-3 gap-1 p-0.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-medium">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-1 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'telemetry'
                ? 'bg-zinc-800 text-white font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>AI Intel</span>
          </button>

          <button
            onClick={() => setActiveTab('landfall')}
            className={`py-1 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'landfall'
                ? 'bg-zinc-800 text-white font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Waves className="w-3 h-3 text-sky-400" />
            <span>Landfall</span>
          </button>

          <button
            onClick={() => setActiveTab('advisories')}
            className={`py-1 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'advisories'
                ? 'bg-zinc-800 text-white font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Alerts</span>
          </button>
        </div>
      </div>

      {/* Tab Content Body (Scrollable) */}
      <div className="p-3 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-2.5 text-xs">
        {activeTab === 'telemetry' && (
          <>
            {/* Rapid Intensification Meter */}
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Intensification Trend
                </span>
                <span className="text-[10px] font-bold font-mono text-amber-400">
                  {trend.trendStatus}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-2">
                {trend.trendDescription}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-1.5 rounded-lg bg-black/40 border border-zinc-800">
                  <div className="text-zinc-400 text-[10px]">Dvorak CI</div>
                  <div className="font-bold text-white">{trend.ciNumber} ({trend.dvorakTNumber})</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/40 border border-zinc-800">
                  <div className="text-zinc-400 text-[10px]">6h Wind Delta</div>
                  <div className="font-bold text-cyan-400">+{trend.windDelta6h} kts</div>
                </div>
              </div>
            </div>

            {/* SigLIP AI Pattern Confidence */}
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  SigLIP Vision Confidence
                </span>
                <span className="text-[10px] font-mono font-bold text-purple-400">
                  {(pattern.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-0.5 text-zinc-400">
                    <span>Eyewall Definition</span>
                    <span className="text-zinc-200">{(pattern.eyeWallDefinition * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-400"
                      style={{ width: `${pattern.eyeWallDefinition * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-0.5 text-zinc-400">
                    <span>Convective Symmetry</span>
                    <span className="text-zinc-200">{(pattern.convectiveSymmetry * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-400"
                      style={{ width: `${pattern.convectiveSymmetry * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'landfall' && (
          <div className="space-y-2.5">
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Predicted Landfall Point
              </div>
              <div className="text-sm font-bold text-white mb-0.5">
                {prediction.predictedLandfallLocation}
              </div>
              <div className="text-[11px] font-mono text-cyan-400">
                ETA: {prediction.predictedLandfallTime}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-zinc-400 text-[10px]">Storm Surge</div>
                <div className="font-bold text-sky-400 text-sm">
                  {prediction.expectedSurgeHeightMeters}m
                </div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-zinc-400 text-[10px]">Landfall Prob</div>
                <div className="font-bold text-emerald-400 text-sm">
                  {prediction.landfallProbabilityPct}%
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advisories' && (
          <div className="space-y-2">
            {storm.imdBulletins.slice(0, 2).map((b) => (
              <div key={b.id} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="flex items-center justify-between text-[10px] font-mono text-rose-400 mb-1 font-bold">
                  <span>{b.bulletinNo}</span>
                  <span className="text-zinc-400">{b.issuedAt}</span>
                </div>
                <div className="text-xs font-bold text-zinc-200 mb-1">
                  {b.headline}
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-3">
                  {b.synopsis}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions Bar */}
      <div className="p-2.5 border-t border-zinc-800/80 bg-black/50 flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenChat}
          className="flex-1 h-8 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Meteorological Copilot</span>
        </button>

        <button
          onClick={onRecenter}
          className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-400 hover:text-cyan-300 hover:bg-zinc-800 transition-colors flex items-center justify-center shrink-0"
          title="Recenter Eye"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
