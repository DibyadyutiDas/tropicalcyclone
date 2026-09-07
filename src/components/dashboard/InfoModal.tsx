'use client';

import React from 'react';
import {
  X,
  Globe,
  Bot,
  Layers,
  Wind,
  Cpu,
} from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-y-auto p-5 text-zinc-200 custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">StormSense AI Architecture</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 text-cyan-400 font-semibold border border-zinc-800">
                v2.6 Enterprise
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Multi-spectral cyclone forecasting and explainable intelligence platform
            </p>
          </div>
        </div>

        {/* 4 Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {/* Feature 1 */}
          <div className="p-3.5 rounded-xl bg-black border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
              <Globe className="w-4 h-4" />
              <span>1. Live Cyclone Intelligence Layer</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Normalized data foundation ingesting cyclone position, track vectors, MSW (knots/kmh), central barometric pressure, forward velocity, and RSMC/IMD forecast bulletins.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-3.5 rounded-xl bg-black border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
              <Layers className="w-4 h-4" />
              <span>2. Multi-Source Satellite Intelligence</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Processes INSAT-3DR TIR-1 (10.8µm), Water Vapor (6.9µm), Visible RGB, and GPM Microwave into unified feature matrices with cold cloud-top temperatures (-84.2°C).
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-3.5 rounded-xl bg-black border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
              <Cpu className="w-4 h-4" />
              <span>3. Cyclone AI Engine</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Submodules: (A) Visual pattern analysis using SigLIP zero-shot vision classification, (B) Dynamic trend analysis calculating 6h Δwind/pressure and Dvorak T-ratings, and (C) IBTrACS ensemble trajectory prediction.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-3.5 rounded-xl bg-black border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Bot className="w-4 h-4" />
              <span>4. Cyra AI - Deep Copilot Agent</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Autonomous reasoning layer with 8 executable tools (<code className="text-cyan-400">get_current_storm</code>, <code className="text-cyan-400">analyze_satellite</code>, <code className="text-cyan-400">get_prediction</code>, <code className="text-cyan-400">search_official_sources</code>).
            </p>
          </div>
        </div>

        {/* Technical Stack Pills */}
        <div className="border-t border-zinc-800 pt-3.5 flex flex-wrap items-center justify-between gap-2.5 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-zinc-300">Stack:</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">Next.js App Router</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">TypeScript</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">MapLibre GL</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">SigLIP + IBTrACS</span>
          </div>

          <button
            onClick={onClose}
            className="h-8 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
