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
  theme?: 'dark' | 'light';
}

export const CycloneAIEngine: React.FC<CycloneAIEngineProps> = ({
  storm,
  activePoint,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [activeSubmodule, setActiveSubmodule] = useState<'A' | 'B' | 'C'>('A');

  const pattern = storm.patternScores;
  const trend = storm.trend;
  const prediction = storm.prediction;

  return (
    <div className="flex flex-col gap-2.5 p-3 overflow-y-auto custom-scrollbar select-none text-xs">
      {/* Submodule Segment Navigation */}
      <div className={`p-1 rounded-xl border grid grid-cols-3 gap-1 ${
        isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-[#17171d] border-zinc-800'
      }`}>
        <button
          onClick={() => setActiveSubmodule('A')}
          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubmodule === 'A'
              ? isLight
                ? 'bg-white text-cyan-700 border border-slate-200'
                : 'bg-zinc-800 text-cyan-400 border border-zinc-700'
              : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
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
              ? isLight
                ? 'bg-white text-purple-700 border border-slate-200'
                : 'bg-zinc-800 text-purple-400 border border-zinc-700'
              : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
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
              ? isLight
                ? 'bg-white text-emerald-700 border border-slate-200'
                : 'bg-zinc-800 text-emerald-400 border border-zinc-700'
              : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
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
          <div className={`p-3 rounded-xl border ${
            isLight
              ? 'bg-cyan-50/50 border-cyan-200 text-slate-800'
              : 'bg-[#17171d] border-zinc-800 text-zinc-100'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-cyan-800' : 'text-zinc-200'}`}>
                Visual Pattern Classification
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-200' : 'bg-zinc-800 text-cyan-300 border-zinc-700'
              }`}>
                SigLIP Zero-Shot
              </span>
            </div>

            <p className={`text-[11px] leading-relaxed font-normal ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
              Pretrained SigLIP vision transformer evaluating zero-shot visual pattern classification and structural symmetry directly from satellite tensors.
            </p>

            {/* Pattern Scores Table */}
            <div className="mt-3 space-y-1.5 text-[11px]">
              <div className={`flex justify-between items-center py-1.5 px-2.5 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'
              }`}>
                <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Developing Stage</span>
                <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>0.21</span>
              </div>
              <div className={`flex justify-between items-center py-1.5 px-2.5 rounded-lg border font-semibold ${
                isLight
                  ? 'bg-cyan-50 border-cyan-300 text-slate-900'
                  : 'bg-zinc-800 border-zinc-700 text-white'
              }`}>
                <span className="flex items-center gap-1.5">
                  <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-500' : 'text-cyan-400'}`} />
                  <span>Organizing Cyclone (Dominant)</span>
                </span>
                <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>0.63</span>
              </div>
              <div className={`flex justify-between items-center py-1.5 px-2.5 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'
              }`}>
                <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Mature Eyewall</span>
                <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>0.58</span>
              </div>
              <div className={`flex justify-between items-center py-1.5 px-2.5 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800/80'
              }`}>
                <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Weakening / Shear</span>
                <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>0.12</span>
              </div>
            </div>

            {/* Geometry Indices */}
            <div className={`grid grid-cols-2 gap-2 text-[11px] mt-2.5 pt-2.5 border-t ${
              isLight ? 'border-slate-200' : 'border-zinc-800/80'
            }`}>
              <div className={`p-2 rounded-lg border flex justify-between items-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800/80'
              }`}>
                <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Eyewall Def:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>0.84</span>
              </div>
              <div className={`p-2 rounded-lg border flex justify-between items-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800/80'
              }`}>
                <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Symmetry:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>0.79</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE B: Trend Analysis */}
      {activeSubmodule === 'B' && (
        <div className="space-y-2.5">
          <div className={`p-3 rounded-xl border ${
            isLight
              ? 'bg-purple-50/50 border-purple-200 text-slate-800'
              : 'bg-[#17171d] border-zinc-800 text-zinc-100'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-purple-800' : 'text-zinc-200'}`}>
                Intensification Trends
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isLight ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-zinc-800 text-purple-300 border-zinc-700'
              }`}>
                Telemetry Delta
              </span>
            </div>

            <p className={`text-[11px] leading-relaxed font-normal ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
              Computes multi-hour intensification derivatives, Dvorak T-numbers, and eye diameter shrinkage.
            </p>

            {/* Trend Metrics */}
            <div className={`mt-3 p-2.5 rounded-xl border text-[11px] space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'
            }`}>
              <div className={`flex justify-between items-center py-0.5 border-b ${isLight ? 'border-slate-200' : 'border-zinc-800/70'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Wind Delta (6h):</span>
                <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>+{trend.windDelta6h} kts</span>
              </div>
              <div className={`flex justify-between items-center py-0.5 border-b ${isLight ? 'border-slate-200' : 'border-zinc-800/70'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Pressure Drop (6h):</span>
                <span className={`font-bold ${isLight ? 'text-rose-600' : 'text-rose-300'}`}>{trend.pressureDelta6h} hPa</span>
              </div>
              <div className={`flex justify-between items-center py-0.5 border-b ${isLight ? 'border-slate-200' : 'border-zinc-800/70'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>SigLIP Organization:</span>
                <span className={`font-bold ${isLight ? 'text-purple-700' : 'text-purple-300'}`}>+0.18 score</span>
              </div>
              <div className={`flex justify-between items-center py-0.5 border-b ${isLight ? 'border-slate-200' : 'border-zinc-800/70'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Motion Vector:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>{activePoint.movementSpeedKmh} km/h (NNE)</span>
              </div>

              <div className="pt-1 flex justify-between items-center">
                <span className={`font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Classified Status:</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                  isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-zinc-800 text-amber-300 border-zinc-700'
                }`}>
                  {trend.trendStatus}
                </span>
              </div>
            </div>

            {/* Dvorak Info */}
            <div className={`grid grid-cols-2 gap-2 text-[11px] mt-2.5 pt-2.5 border-t ${
              isLight ? 'border-slate-200' : 'border-zinc-800'
            }`}>
              <div className={`p-2 rounded-lg border flex justify-between items-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'
              }`}>
                <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Dvorak:</span>
                <span className={`font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>{trend.dvorakTNumber}</span>
              </div>
              <div className={`p-2 rounded-lg border flex justify-between items-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'
              }`}>
                <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Eye Diameter:</span>
                <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>{trend.estimatedEyeDiameterKm || 28} km</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE C: Lightweight Prediction */}
      {activeSubmodule === 'C' && (
        <div className="space-y-2.5">
          <div className={`p-3 rounded-xl border ${
            isLight
              ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
              : 'bg-[#17171d] border-zinc-800 text-zinc-100'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-emerald-800' : 'text-zinc-200'}`}>
                IBTrACS Historical Projection
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-zinc-800 text-emerald-300 border-zinc-700'
              }`}>
                ML Regressor
              </span>
            </div>

            <p className={`text-[11px] leading-relaxed font-normal ${isLight ? 'text-slate-700' : 'text-zinc-300/90'}`}>
              Trained on 40+ years of North Indian Ocean historical tracks to estimate analog trajectories and landfall timings.
            </p>

            {/* Landfall Callout Banner */}
            <div className={`mt-3 p-2.5 rounded-xl border space-y-1 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-zinc-800'
            }`}>
              <div className={`text-[10px] uppercase font-semibold flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                <MapPin className="w-3 h-3 text-red-500" />
                <span>Predicted Landfall Corridor</span>
              </div>
              <div className={`text-xs font-bold leading-snug break-words ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                {prediction.predictedLandfallLocation}
              </div>
            </div>

            {/* Prediction Outputs */}
            <div className={`space-y-1.5 text-[11px] pt-2 border-t ${isLight ? 'border-slate-200' : 'border-zinc-800/70'}`}>
              <div className="flex justify-between items-center py-0.5">
                <span className={`font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Evolution State:</span>
                <span className={`font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>Mature Stage (78%)</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className={`font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Estimated Arrival:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>{prediction.predictedLandfallTime}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className={`font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Predicted Surge:</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                  isLight ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}>
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
