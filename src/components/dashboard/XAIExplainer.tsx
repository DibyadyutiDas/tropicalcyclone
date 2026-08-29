'use client';

import React from 'react';
import {
  Sparkles,
  Thermometer,
  Wind,
  Layers,
  Activity,
} from 'lucide-react';
import { Storm } from '@/lib/types/cyclone';

interface XAIExplainerProps {
  storm: Storm;
}

export const XAIExplainer: React.FC<XAIExplainerProps> = ({ storm }) => {
  const xai = storm.xai;

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-xl border border-zinc-800 p-3.5 overflow-y-auto custom-scrollbar text-xs text-zinc-200 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">Explainable AI (XAI)</h3>
            <p className="text-[10px] text-zinc-400">Feature Attribution & Physics Dynamics</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-900 text-purple-300 border border-zinc-800">
          SHAP / Grad-CAM
        </span>
      </div>

      {/* Atmospheric Diagnostics Gauge Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Sea Surface Temperature */}
        <div className="p-2.5 rounded-lg bg-black border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] mb-1">
            <span className="flex items-center gap-1 font-medium">
              <Thermometer className="w-3 h-3 text-rose-400" /> SST
            </span>
            <span className="text-rose-400 font-medium">+1.8°C</span>
          </div>
          <div className="text-base font-bold text-white">
            {xai.seaSurfaceTempC}°C
          </div>
          <p className="text-[9px] text-zinc-400 mt-0.5">&gt; 26.5°C threshold</p>
        </div>

        {/* Vertical Wind Shear */}
        <div className="p-2.5 rounded-lg bg-black border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] mb-1">
            <span className="flex items-center gap-1 font-medium">
              <Wind className="w-3 h-3 text-cyan-400" /> Wind Shear
            </span>
            <span className="text-emerald-400 font-medium">Favorable</span>
          </div>
          <div className="text-base font-bold text-white">
            {xai.verticalWindShearKts} kts
          </div>
          <p className="text-[9px] text-zinc-400 mt-0.5">&lt; 10 kts low shear</p>
        </div>

        {/* Ocean Heat Content */}
        <div className="p-2.5 rounded-lg bg-black border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] mb-1">
            <span className="flex items-center gap-1 font-medium">
              <Layers className="w-3 h-3 text-amber-400" /> Ocean Heat
            </span>
            <span className="text-amber-300 font-medium">High</span>
          </div>
          <div className="text-base font-bold text-white">
            {xai.oceanHeatContentKj} <span className="text-[10px] font-normal text-zinc-400">kJ/cm²</span>
          </div>
          <p className="text-[9px] text-zinc-400 mt-0.5">Deep warm thermal layer</p>
        </div>

        {/* Core Convective Energy Score */}
        <div className="p-2.5 rounded-lg bg-black border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] mb-1">
            <span className="flex items-center gap-1 font-medium">
              <Activity className="w-3 h-3 text-purple-400" /> Core Energy
            </span>
            <span className="text-purple-300 font-medium">98th Pct</span>
          </div>
          <div className="text-base font-bold text-white">
            {xai.convectiveCoreEnergyScore} <span className="text-[10px] font-normal text-zinc-400">/ 100</span>
          </div>
          <p className="text-[9px] text-zinc-400 mt-0.5">Strong vertical ascent</p>
        </div>
      </div>

      {/* Feature Importance Breakdown (SHAP Weights) */}
      <div className="mb-3">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Predictive Drivers (SHAP Attribution)
        </h4>
        <div className="space-y-2">
          {xai.primaryFeatures.map((f, i) => (
            <div key={i} className="p-2 rounded-lg bg-black border border-zinc-800/80">
              <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                <span className="text-white">{f.name}</span>
                <span className="font-mono text-cyan-400 font-semibold">{f.importance}%</span>
              </div>
              <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${f.importance}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-400 leading-snug">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grad-CAM Saliency Explanation */}
      <div className="p-2.5 rounded-lg bg-black border border-zinc-800/80">
        <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px] mb-1">
          <Sparkles className="w-3 h-3" />
          <span>Spatial Attention Focus</span>
        </div>
        <p className="text-[10px] text-zinc-300 leading-relaxed">
          {xai.gradCamAttentionSummary}
        </p>
      </div>
    </div>
  );
};
