'use client';

import React, { useState } from 'react';
import {
  Brain,
  Eye,
  Flame,
  LineChart,
  Navigation,
  TrendingDown,
  TrendingUp,
  Wind,
  Sparkles,
  Layers,
  MapPin,
  Clock,
  Waves,
} from 'lucide-react';
import { Storm, ObservationPoint } from '@/lib/types/cyclone';

interface CycloneAIEngineProps {
  storm: Storm;
  activePoint: ObservationPoint;
}

export const CycloneAIEngine: React.FC<CycloneAIEngineProps> = ({
  storm,
  activePoint,
}) => {
  const [activeSubmodule, setActiveSubmodule] = useState<'A' | 'B' | 'C'>('A');

  const pattern = storm.patternScores;
  const trend = storm.trend;
  const prediction = storm.prediction;

  return (
    <div className="flex flex-col gap-2.5 p-3 overflow-y-auto custom-scrollbar select-none text-xs">
      {/* Submodule Segment Navigation */}
      <div className="p-1 rounded-xl bg-[#17171d]/90 border border-zinc-800/80 grid grid-cols-3 gap-1">
        <button
          onClick={() => setActiveSubmodule('A')}
          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubmodule === 'A'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>A. SigLIP</span>
        </button>

        <button
          onClick={() => setActiveSubmodule('B')}
          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubmodule === 'B'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <TrendingUp className="w-3 h-3" />
          <span>B. Trends</span>
        </button>

        <button
          onClick={() => setActiveSubmodule('C')}
          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubmodule === 'C'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Brain className="w-3 h-3" />
          <span>C. IBTrACS</span>
        </button>
      </div>

      {/* SUBMODULE A: Visual Pattern Analysis */}
      {activeSubmodule === 'A' && (
        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                Visual Pattern Classification
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                SigLIP Zero-Shot
              </span>
            </div>

            <p className="text-[11px] text-zinc-300/90 leading-relaxed font-normal">
              Pretrained SigLIP vision transformer evaluating zero-shot visual pattern classification and structural symmetry directly from satellite tensors.
            </p>

            {/* Pattern Scores Table */}
            <div className="mt-3 space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center py-1.5 px-2.5 rounded-lg bg-[#111115] border border-zinc-800/80">
                <span className="text-zinc-300 font-medium">Developing Stage</span>
                <span className="text-zinc-400 font-bold">0.21</span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-cyan-500/15 to-[#1c1c24] border border-cyan-500/40 font-semibold shadow-xs">
                <span className="text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Organizing Cyclone (Dominant)</span>
                </span>
                <span className="text-cyan-300 font-bold">0.63</span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-2.5 rounded-lg bg-[#111115] border border-zinc-800/80">
                <span className="text-zinc-300 font-medium">Mature Eyewall</span>
                <span className="text-zinc-400 font-bold">0.58</span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-2.5 rounded-lg bg-[#111115] border border-zinc-800/80">
                <span className="text-zinc-300 font-medium">Weakening / Shear</span>
                <span className="text-zinc-400 font-bold">0.12</span>
              </div>
            </div>

            {/* Geometry Indices */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mt-2.5 pt-2.5 border-t border-zinc-800/80">
              <div className="p-2 rounded-lg bg-[#111115] border border-zinc-800/80 flex justify-between items-center">
                <span className="text-zinc-400">Eyewall Def:</span>
                <span className="font-bold text-zinc-100">0.84</span>
              </div>
              <div className="p-2 rounded-lg bg-[#111115] border border-zinc-800/80 flex justify-between items-center">
                <span className="text-zinc-400">Symmetry:</span>
                <span className="font-bold text-zinc-100">0.79</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE B: Trend Analysis */}
      {activeSubmodule === 'B' && (
        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                Intensification Trends
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Telemetry Delta
              </span>
            </div>

            <p className="text-[11px] text-zinc-300/90 leading-relaxed font-normal">
              Computes multi-hour intensification derivatives, Dvorak T-numbers, and eye diameter shrinkage.
            </p>

            {/* Trend Metrics */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#111115] border border-zinc-800/90 text-[11px] space-y-2">
              <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/70">
                <span className="text-zinc-400">Wind Delta (6h):</span>
                <span className="font-bold text-cyan-300">+{trend.windDelta6h} kts</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/70">
                <span className="text-zinc-400">Pressure Drop (6h):</span>
                <span className="font-bold text-rose-300">{trend.pressureDelta6h} hPa</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/70">
                <span className="text-zinc-400">SigLIP Organization:</span>
                <span className="font-bold text-purple-300">+0.18 score</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/70">
                <span className="text-zinc-400">Motion Vector:</span>
                <span className="font-bold text-zinc-200">{activePoint.movementSpeedKmh} km/h (NNE)</span>
              </div>

              <div className="pt-1 flex justify-between items-center">
                <span className="text-zinc-400 font-medium">Classified Status:</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {trend.trendStatus}
                </span>
              </div>
            </div>

            {/* Dvorak Info */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mt-2.5 pt-2.5 border-t border-zinc-800/80">
              <div className="p-2 rounded-lg bg-[#111115] border border-zinc-800/80 flex justify-between items-center">
                <span className="text-zinc-400">Dvorak:</span>
                <span className="font-bold text-amber-400">{trend.dvorakTNumber}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#111115] border border-zinc-800/80 flex justify-between items-center">
                <span className="text-zinc-400">Eye Diameter:</span>
                <span className="font-bold text-cyan-300">{trend.estimatedEyeDiameterKm || 28} km</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE C: Lightweight Prediction */}
      {activeSubmodule === 'C' && (
        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                IBTrACS Historical Projection
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                ML Regressor
              </span>
            </div>

            <p className="text-[11px] text-zinc-300/90 leading-relaxed font-normal">
              Trained on 40+ years of North Indian Ocean historical tracks to estimate analog trajectories and landfall timings.
            </p>

            {/* Landfall Callout Banner */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#111115] border border-zinc-800 space-y-1">
              <div className="text-[10px] uppercase font-semibold text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" />
                <span>Predicted Landfall Corridor</span>
              </div>
              <div className="text-xs font-bold text-zinc-100 leading-snug break-words">
                {prediction.predictedLandfallLocation}
              </div>
            </div>

            {/* Prediction Outputs */}
            <div className="space-y-1.5 text-[11px] pt-2 border-t border-zinc-800/70">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-zinc-400 font-medium">Evolution State:</span>
                <span className="font-bold text-emerald-300">Mature Stage (78%)</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-zinc-400 font-medium">Estimated Arrival:</span>
                <span className="font-bold text-zinc-100">{prediction.predictedLandfallTime}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-zinc-400 font-medium">Predicted Surge:</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  +{prediction.expectedSurgeHeightMeters}m above tide
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
